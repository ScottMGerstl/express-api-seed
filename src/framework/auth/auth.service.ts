import { IAuthConfig } from '../config/config.interface';
import { ConfigService } from '../config/config.service';
import { UnauthorizedException } from '../exceptions/exceptions';
import { ResponseUtils } from '../utils/response.utils';
import { EncodingUtils } from '../utils/encoding.utils';
import { JwtHeader, JwtPayload } from './jwt.interface';

import * as moment from 'moment';
import * as crypto from 'crypto';

export class AuthService {
    public createToken(accountId: number): string {

        let header: JwtHeader = {
            type: 'JWT',
            tkv: '0'
        };

        let authConfig: IAuthConfig = ConfigService.getAuthConfigs();

        let payload: JwtPayload = {
            iss: authConfig.iss,
            sub: accountId,
            iat: moment().utc().unix(),
            exp: moment().utc().add(authConfig.validDays, 'days').unix()
        };

        let encodedHeader: string = EncodingUtils.base64Encode(header);
        let encodedPayload: string = EncodingUtils.base64Encode(payload);

        let unsignedToken: string = encodedHeader + '.' + encodedPayload;

        let signedToken: string = unsignedToken + '.' + this.getTokenSignature(unsignedToken);

        return signedToken;
    }

    public getTokenSignature(unsignedToken: string): string {
        let secret = ConfigService.getAuthConfigs().accountSecret;

        let hash = crypto.createHmac('sha512', secret);
        hash.update(unsignedToken);
        let signature: string = hash.digest('base64');

        return signature;
    }
}