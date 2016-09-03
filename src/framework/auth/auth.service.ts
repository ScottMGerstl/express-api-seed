import { IAuthConfig } from '../config/config.interface';
import { ConfigService } from '../config/config.service';

import * as moment from 'moment';
import * as crypto from 'crypto';

export class AuthService {
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