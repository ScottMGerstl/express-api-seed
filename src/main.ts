#!/bin/env node

import 'reflect-metadata';
import { Container } from 'typedi';
import { Server } from './framework/server/server';

import { IServerOptions } from './framework/server/server-options.interface';
import { ConfigService } from './framework/config/config.service';
import { IServerConfig } from './framework/config/config.interface';

// Get and set config values
let settings: IServerConfig = ConfigService.getServerConfig();

let options: IServerOptions = {
    port: settings.port
};

// Setup and start the server with config values
let srvr: Server = Container.get(Server);

srvr.init();
srvr.start(options);
