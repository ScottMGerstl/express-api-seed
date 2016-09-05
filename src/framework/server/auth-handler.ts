import { Service } from 'typedi';

import { AuthService } from '../auth/auth.service';
import { EncodingUtils } from '../utils/encoding.utils';
import { UnauthorizedException } from '../exceptions/exceptions';
import { JwtPayload } from '../auth/jwt.interface';
import { ResponseUtils } from '../../framework/utils/response.utils';

import * as moment from 'moment';
import * as Express from 'express';

@Service()
export class AuthHandler {
    constructor(private _authService: AuthService) { }

    /**
     * Use this to verify authentication in the express server
     *
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {Express.NextFunction} next
     */
    public verifyAuthentication(req: Express.Request, res: Express.Response, next: Express.NextFunction): void {
        try {
            // Parse token
            let tokenParts: string[] = this.parseAuthenticationHeader(req);

            // Check the token for tampering
            let payloadPart: string = this.comparePayloadWithSignature(tokenParts);

            // Parse the payload
            let payload: JwtPayload = EncodingUtils.base64Decode<JwtPayload>(payloadPart);

            // Check if the token is in effective range
            this.checkEffectiveRange(payload);

            // check for the accountId
            if (!payload.sub) {
                throw new UnauthorizedException();
            }

            // add accountId to request for easy handling
            req.body.accountId = payload.sub;

            // continue
            next();
        }
        catch (err) {
            // Resolve any unknown errors
            if (err.name !== 'UnauthorizedException' && err.name !== 'ForbiddenException') {
                err = new UnauthorizedException();
            }

            // Send the response
            ResponseUtils.sendErrorResponse(err, res);
        }
    }

    private parseAuthenticationHeader(req: Express.Request): string[] {
        if (!req.headers['authorization']) {
            throw new UnauthorizedException('The authorization header is missing from the request headers');
        }

        let headerValues: string[] = req.headers['authorization'].split(' ');

        if (headerValues.length !== 2) {
            throw new UnauthorizedException('The authorization header is not well formed');
        }

        if (headerValues[0] !== 'Bearer') {
            throw new UnauthorizedException('The authorization header requires the Bearer schema');
        }

        let token: string = headerValues[1];
        let tokenParts: string[] = token.split('.');

        if (token !== undefined && token !== null && token.length > 0 && tokenParts.length === 3) {
            return tokenParts;
        }
        else {
            throw new UnauthorizedException('The authorization header requires a valid token');
        }
    }

    private comparePayloadWithSignature(tokenParts): string {
        let header: string = tokenParts[0];
        let payload: string = tokenParts[1];
        let signature: string = tokenParts[2];

        if (this._authService.getTokenSignature(header + '.' + payload) === signature) {
            return payload;
        }
        else {
            throw new UnauthorizedException();
        }
    }

    private checkEffectiveRange(payload: JwtPayload): void {
        let now = moment().utc().unix();

        if (now < payload.iat) {
            throw new UnauthorizedException('this token is not yet effective');
        }

        if (payload.exp < now) {
            throw new UnauthorizedException('this token has expired');
        }
    }
}