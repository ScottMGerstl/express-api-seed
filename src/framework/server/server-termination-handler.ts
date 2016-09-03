export class ServerTerminationHandler {

    private signatures: string[];

    constructor() {
        this.signatures = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];
    }

    public init() {
        process.on('exit', () => {
            this.terminate(null);
        });

        this.signatures.forEach((element, index, array) => {
            process.on(element, () => {
                this.terminate(element);
            });
        });
    }

    private terminate(signature: string) {
        if (signature) {
            console.log('%s: Received %s - terminating Tortoise API ...', new Date(Date.now()), signature);
            process.exit(1);
        }

        console.log('%s: Node server stopped.', new Date(Date.now()));
    }
}
