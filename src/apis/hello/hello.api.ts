import * as Express from 'express';
import { Service } from 'typedi';

import { BaseApi } from '../base.api';
import { UnauthorizedException } from '../../framework/exceptions/exceptions';
import { AuthRepo } from '../../framework/auth/auth.repo';

@Service()
export class HelloApi extends BaseApi {
    constructor(private _authRepo: AuthRepo) {
        super();
    }

    public sayHi(req: Express.Request, res: Express.Response): void {
        res.status(200).send({ message: 'Hello, world' });
    }

    public sayHiToMe(req: Express.Request, res: Express.Response): void {
        this._authRepo.getAccountById(req.body.accountId)
            .then(account => {
                res.status(200).send({ message: 'Hey, ' + account.name });
            })
            .catch(err => {
                this.sendErrorResponse(new UnauthorizedException(), res);
            });
    }
}