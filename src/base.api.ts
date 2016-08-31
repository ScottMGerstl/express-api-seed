import { LoggingService } from './logging/logging.service';

export class BaseApi {
    public static sendErrorResponse(err, res) {
        let responseCode: number = 500;

        let response = {};

        if (err.code) {
            responseCode = err.code;
        }

        response['message'] = err.message;

        if (err.name === 'ValidationException') {
            response['validationErrors'] = err.validationErrors;
            responseCode = 422;
        }

        res.status(responseCode).send(response);

        if (responseCode === 500) {
            LoggingService.log(err);
        }
    }
}
