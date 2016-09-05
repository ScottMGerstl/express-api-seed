#!/bin/env node

import * as express from 'express';
import * as bodyParser from 'body-parser'

import { Service } from 'typedi';

import { AuthHandler } from './auth-handler';
import { RouteRegistry } from './route-registry';
import { ServerTerminationHandler } from './server-termination-handler';
import { IServerOptions } from './server-options.interface';

@Service()
export class Server {

    private app: express.Express;

    constructor(private _authHandler: AuthHandler, private _routeRegistry: RouteRegistry) { }

    /**
     * sets up the server
     */
    public init() {
        // Setup a termination handler to log output
        new ServerTerminationHandler().init();

        // setup the server
        this.app = express();

        // Request body parsing
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        // register non-auth routes
        this._routeRegistry.registerPublicRoutes(this.app);

        // Implement authentication handler
        this.app.use((req, res, next) => this._authHandler.verifyAuthentication(req, res, next));

        // register authenticated routes
        this._routeRegistry.registerAuthenticatedRoutes(this.app);
    }

    /**
     * Starts the server
     *
     * @param {IServerOptions} options ip address and port to run on
     */
    public start(options: IServerOptions) {
        this.app.listen(options.port, options.ipAddress, () => {
            console.log('%s: Node server started on %s:%s ...', new Date(Date.now()), options.ipAddress, options.port);
        });
    }
}
