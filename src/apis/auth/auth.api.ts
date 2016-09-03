// let password = require('../services/passwordService.js');
// let validation = require('../services/validationService.js');
// let repo = require('../repos/accountsRepo.js');

let bcrypt = require('bcryptjs');

import { BaseApi } from '../base.api';
import { UnauthorizedException } from '../../framework/exceptions/exceptions';
import { AuthService } from '../../framework/auth/auth.service';
import { ResponseUtils } from '../../framework/utils/response.utils';

export class AuthApi extends BaseApi {

    private static repo = [];

    public static registerByEmail(req, res): void {
        try {
            // Validate
            let validData = req.body; // validation.validateRegisterByEmail(req.body);

            // Prep password
            let hash = AuthApi.hash(validData.password);

            // trandorm for database
            let accountModel: any = {
                name: validData.name,
                email: validData.email,
                passwordHash: hash
            };

            AuthApi.repo.push(accountModel);
            accountModel.accountId = AuthApi.repo.length;

            // insert
            // repo.registerByEmail(accountModel)

            // respond
            // .then(function (accountId) {

            // create response
            let response = AuthApi.createTokenResponse(accountModel.accountId);

            res.status(201).send(response);
            // })
            // .catch(function (err) {
            // this.sendErrorResponse(err, res);
            // })
            // .done();
        } catch (err) {
            AuthApi.sendErrorResponse(err, res);
        }
    };

    public static signInByEmail(req, res): void {
        let failedSignInMessage: string = 'Either the email or password is incorrect';

        try {
            // Validate
            let validData = req.body; // validation.validateSignInByEmail(req.body);

            let authData;

            console.log(JSON.stringify(AuthApi.repo));

            for (let r of AuthApi.repo) {
                if (r.email === validData.email) {
                    authData = r;
                    break;
                }
            };

            // repo.auth.findByEmail(validData.email)
                // .then(function (authData) {

                    // check password
                    console.log(JSON.stringify(authData));

                    let match = AuthApi.compare(validData.password, authData.passwordHash);

                    if (match === false) {
                        throw new UnauthorizedException(failedSignInMessage);
                    }

                    // create response
                    let response = AuthApi.createTokenResponse(authData.Id);
                    console.log(JSON.stringify(response));
                    res.status(200).send(response);
                // })
                // .catch(function (err) {
                //     if (err.name === 'NotFoundException') {
                //         err = new UnauthorizedException(failedSignInMessage);
                //     }

                //     this.sendErrorResponse(err, res);
                // })
                // .done();

        } catch (err) {
            throw err; // AuthApi.sendErrorResponse(err, res);
        }
    }

    private static createTokenResponse(accountId) {
        // create token
        let token = AuthService.createToken(accountId);

        // create response
        let response = {
            token: token
        };

        return response;
    }

    private static hash(password) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        return hash;
    };

    private static compare(password, hash) {
        return bcrypt.compareSync(password, hash);
    };
};