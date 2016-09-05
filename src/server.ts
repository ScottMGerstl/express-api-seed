#!/bin/env node

import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser'
import { Container } from 'typedi';

import { AuthHandler } from './framework/server/auth-handler';
import { AuthService } from './framework/auth/auth.service';
import { AuthRepo } from './framework/auth/auth.repo';
import { RouteRegistry } from './framework/server/route-registry';
import { ServerTerminationHandler } from './framework/server/server-termination-handler';

import { IServerOptions } from './framework/server/server-options.interface';
import { ConfigService } from './framework/config/config.service';
import { IServerConfig } from './framework/config/config.interface';

class Server {
    private app: express.Express;
    private options: IServerOptions;
    private authHandler: AuthHandler;

    constructor(private _options: IServerOptions, private _authHandler: AuthHandler) {
        this.options = _options;
        this.authHandler = _authHandler;
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
        this.app.use((req, res, next) => this.authHandler.verifyAuthentication(req, res, next));

        routes.registerAuthenticatedRoutes(this.app);
    }
}

// Get and set config values
let settings: IServerConfig = ConfigService.getServerConfig();

let options: IServerOptions = {
    ipAddress: settings.ipAddress,
    port: settings.port
};

let authHandler: AuthHandler = Container.get(AuthHandler);

// Setup and start the server with config values
let srvr: Server = new Server(options, authHandler);
srvr.init();
srvr.start();
