export class LoggingService {
    public static log(error: Error): void {
        console.error(JSON.stringify(error));
    }
}