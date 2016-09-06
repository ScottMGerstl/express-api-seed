import * as moment from 'moment';
import { Container } from 'typedi';
import { ConfigService } from '../config/config.service';
import { IErrorTrackingConfig } from '../config/config.interface';

export class LoggingService {
    public static log(error: Error): void {

        let timestamp: moment.Moment = moment();
        // Make logging non-bloacking
        setTimeout(() => {
            LoggingService.executeLogging(error, timestamp);
        });
    }

    private static executeLogging(error: any, timestamp: moment.Moment): void {
        let errorTrackingConfig: IErrorTrackingConfig = Container.get(ConfigService).errorTrackingConfigs;
        LoggingService.makeErrorSerializable();

        let readableTimestamp: string = timestamp.toISOString();
        console.error(`${readableTimestamp}: ${JSON.stringify(error)}`);
    }

    /**
     * Adds property to Error that lets JSON.stringify() serialize {Error}. Will only run if not yet run.
     * Solution from http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify#answer-18391400
     *
     * @private
     * @static
     */
    private static makeErrorSerializable() {
        if (!('toJSON' in Error.prototype)) {
            Object.defineProperty(Error.prototype, 'toJSON', {
                value: function () {
                    let alt = {};

                    Object.getOwnPropertyNames(this).forEach(function (key) {
                        alt[key] = this[key];
                    }, this);

                    return alt;
                },
                configurable: true,
                writable: true
            });
        }
    }
}