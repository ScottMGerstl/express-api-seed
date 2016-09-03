import * as moment from 'moment';
import * as crypto from 'crypto';

import { IAuthConfig } from '../config/config.interface';
import { ConfigService } from '../config/config.service';
import { UnauthorizedException, ForbiddenException } from '../exceptions/exceptions';
import { ResponseUtils } from '../utils/response.utils';

export class AuthHandler {
    public static createToken(accountId) {

        let header = {
            type: 'JWT',
            tkv: '0'
        };

        let authConfig: IAuthConfig = ConfigService.getAuthConfigs();

        let payload = {
            iss: authConfig.iss,
            sub: accountId,
            iat: moment().utc().unix(),
            exp: moment().utc().add(authConfig.validDays, 'days').unix()
        };

        let encodedHeader = this.base64Encode(header);
        let encodedPayload = this.base64Encode(payload);

        let unsignedToken = encodedHeader + '.' + encodedPayload;

        let signedToken = unsignedToken + '.' + this.getTokenSignature(unsignedToken);

        return signedToken;
    }

    public static verifyAuthentication(req) {
        try {
            let accountId = null;

            let tokenParts = this.parseAuthenticationHeader(req);
            let payloadPart = this.comparePayloadWithSignature(tokenParts);

            let payload = JSON.parse(this.base64Decode(payloadPart));

            this.checkEffectiveRange(payload);

            if (!payload.sub) {
                throw new UnauthorizedException();
            }

            return accountId = payload.sub;

        } catch (err) {
            if (err.name !== 'UnauthorizedException' && err.name !== 'ForbiddenException') {
                throw new UnauthorizedException();
            } else {
                throw err;
            }
        }
    }

    public static verifyToken(req, res, next) {
        try {
            let accountId = this.verifyAuthentication(req);
            req.accountId = accountId;
            next();
        } catch (error) {
            ResponseUtils.sendErrorResponse(error, res);
        }
    }

    private static parseAuthenticationHeader(req) {
        if (!req.headers.authorization) {
            throw new UnauthorizedException('The authorization header is missing fro mthe request headers');
        }

        let headerValues = req.headers.authorization.split(' ');

        if (headerValues.length !== 2) {
            throw new UnauthorizedException('The authorization header is not well formed');
        }

        if (headerValues[0] !== 'Bearer') {
            throw new UnauthorizedException('The authorization header requires the Bearer schema');
        }

        let token = headerValues[1];
        let tokenParts = token.split('.');

        if (token !== undefined && token !== null && token.length > 0 && tokenParts.length === 3) {
            return tokenParts;
        } else {
            throw new UnauthorizedException('The authorization header requires a valid token');
        }
    }

    private static comparePayloadWithSignature(tokenParts) {
        let header = tokenParts[0];
        let payload = tokenParts[1];
        let signature = tokenParts[2];

        if (this.getTokenSignature(header + '.' + payload) === signature) {
            return payload;
        } else {
            throw new UnauthorizedException();
        }
    }

    private static checkEffectiveRange(payload) {
        let now = moment().utc().unix();

        if (now < payload.iat) {
            throw new UnauthorizedException('this token is not yet effective');
        }

        if (payload.exp < now) {
            throw new UnauthorizedException('this token has expired');
        }
    }

    private static base64Encode(obj) {
        let base64Value = new Buffer(JSON.stringify(obj)).toString('base64');
        return base64Value;
    }

    private static base64Decode(value) {
        let result = new Buffer(value, 'base64').toString('utf8');
        return result;
    }

    private static getTokenSignature(unsignedToken) {
        let secret = ConfigService.getAuthConfigs().accountSecret;

        let hash = crypto.createHmac('sha512', secret);
        hash.update(unsignedToken);
        let signature = hash.digest('base64');

        return signature;
    }
}