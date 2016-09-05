let bcrypt = require('bcryptjs');
import * as Express from 'express';
import { Service } from 'typedi';

import { BaseApi } from '../base.api';
import { UnauthorizedException } from '../../framework/exceptions/exceptions';
import { AuthService } from '../../framework/auth/auth.service';
import { AuthRepo } from '../../framework/auth/auth.repo';
import { ITokenResponse } from './token-response.interface';

@Service()
export class AuthApi extends BaseApi {

    constructor(private _authService: AuthService, private _authRepo: AuthRepo) {
        super();
    }

    public registerByEmail(req: Express.Request, res: Express.Response): void {
        try {
            // Validate
            let validData: any = req.body; // validation.validateRegisterByEmail(req.body);

            // Prep password
            let hash: string = this.hashPassword(validData.password);

            // trandorm for database
            let accountModel: any = {
                name: validData.name,
                email: validData.email,
                passwordHash: hash
            };

            // insert
            this._authRepo.createAccount(accountModel)
                .then(accountId => {
                    // create response
                    let response: ITokenResponse = this.createTokenResponse(accountId);
                    res.status(201).send(response);
                })
                .catch(err => {
                    this.sendErrorResponse(err, res);
                });
        } catch (err) {
            this.sendErrorResponse(err, res);
        }
    };

    public signInByEmail(req: Express.Request, res: Express.Response): void {
        let failedSignInMessage: string = 'Either the email or password is incorrect';

        try {
            // Validate
            let validData: any = req.body; // validation.validateSignInByEmail(req.body);

            this._authRepo.getAccountByEmail(validData.email)
                .then(account => {

                    // check password
                    let match: boolean = this.compare(validData.password, account.passwordHash);

                    if (match === false) {
                        throw new UnauthorizedException(failedSignInMessage);
                    }

                    // create response
                    let response: ITokenResponse = this.createTokenResponse(account.Id);
                    res.status(200).send(response);
                })
                .catch(err => {
                    if (err.name === 'NotFoundException') {
                        err = new UnauthorizedException(failedSignInMessage);
                    }

                    this.sendErrorResponse(err, res);
                });
        }
        catch (err) {
            this.sendErrorResponse(err, res);
        }
    }

    private createTokenResponse(accountId: number): ITokenResponse {
        // create token
        let token: string = new AuthService().createToken(accountId);

        // create response
        let response: ITokenResponse = {
            token: token
        };

        return response;
    }

    private hashPassword(password): string {
        let salt: string = bcrypt.genSaltSync(10);
        let hash: string = bcrypt.hashSync(password, salt);

        return hash;
    };

    private compare(password, hash): boolean {
        return bcrypt.compareSync(password, hash);
    };
};