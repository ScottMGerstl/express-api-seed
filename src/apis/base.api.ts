import { ResponseUtils } from '../framework/utils/response.utils';

export abstract class BaseApi {
    public static sendErrorResponse(err, res) {
        console.log('base');
        ResponseUtils.sendErrorResponse(err, res);
    }
}
