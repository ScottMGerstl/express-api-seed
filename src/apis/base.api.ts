import { ResponseUtils } from '../framework/utils/response.utils';
import * as Express from 'express';

export abstract class BaseApi {

    /**
     * Resolves the error asnd sends the appropriate response
     *
     * @param {*} err
     * @param {Express.Response} res
     */
    public sendErrorResponse(err: any, res: Express.Response): void {
        ResponseUtils.sendErrorResponse(err, res);
    }
}
