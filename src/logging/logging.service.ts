export class LoggingService {
    public static log(error: Error) {
        console.error(JSON.stringify(error));
    }
}