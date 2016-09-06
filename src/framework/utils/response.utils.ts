import { LoggingService } from '../logging/logging.service';
import * as Express from 'express';

export class ResponseUtils {

    /**
     * Handles resolving an exception into the correct type of error and send the response
     *
     * @static
     * @param {*} err error to handle
     * @param {Express.Response} res
     */
    public static sendErrorResponse (err: any, res: Express.Response): void {
        let responseCode: number = 500;

        let response: any = {};

        if (err.code) {
            responseCode = err.code;
        }

        // Be explicit in the information returned. Don't return a stack trace to a user.
        response.message = err.message;

        if (err.name === 'ValidationException') {
            response.validationErrors = err.validationErrors;
            responseCode = 422;
        }

        res.status(responseCode).send(response);

        // If it was an unhandled error, log the error
        if (responseCode === 500) {
            LoggingService.log(err);
        }
    }
}