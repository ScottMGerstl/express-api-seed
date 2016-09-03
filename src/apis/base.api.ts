import { ResponseUtils } from '../framework/utils/response.utils';
import * as Express from 'express';

export abstract class BaseApi {
    public sendErrorResponse(err: any, res: Express.Response): void {
        ResponseUtils.sendErrorResponse(err, res);
    }
}
