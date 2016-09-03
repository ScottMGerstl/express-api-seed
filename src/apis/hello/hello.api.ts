import { BaseApi } from '../base.api';
import * as Express from 'express';

export class HelloApi extends BaseApi {
    public static sayHi(req: Express.Request, res: Express.Response): void {
        res.status(200).send({message : 'Hello, world'});
    }

    public static sayHiToMe(req: Express.Request, res: Express.Response): void {
        res.status(200).send({message : 'Hey, ' + req.body.name});
    }
}