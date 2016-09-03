#!/bin/env node

import * as express from 'express';
import * as bodyParser from 'body-parser'

import { AuthHandler } from './framework/server/auth-handler';
import { RouteRegistry } from './framework/server/route-registry';
import { ServerTerminationHandler } from './framework/server/server-termination-handler';

import { IServerOptions } from './framework/server/server-options.interface';
import { ConfigService } from './framework/config/config.service';
import { IServerConfig } from './framework/config/config.interface';

class Api {
    private app;
    private options: IServerOptions;

    constructor(private _options: IServerOptions) {
        this.options = _options;
    }

    public init() {
        // Setup a termination handler to log output
        new ServerTerminationHandler().init();

        // setup the server
        this.initServer();
    }

    public start() {
        this.app.listen(this.options.port, this.options.ipAddress, () => {
            console.log('%s: Node server started on %s:%s ...', new Date(Date.now()), this.options.ipAddress, this.options.port);
        });
    }

    private initServer() {
        this.app = express();

        // Request body parsing
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        let routes: RouteRegistry = new RouteRegistry();
        routes.registerPublicRoutes(this.app);

        // Implement authentication here when needed
        this.app.use(AuthHandler.verifyAuthentication)

        routes.registerAuthenticatedRoutes(this.app);
    }
}

// Get and set config values
let settings: IServerConfig = ConfigService.getServerConfig();

let options: IServerOptions = {
    ipAddress: settings.ipAddress,
    port: settings.port
};

// Setup and start the server with config values
let srvr: Api = new Api(options);
srvr.init();
srvr.start();
