import * as ConfigStore from './config-store';
import { IConfig, IAuthConfig, IServerConfig, IErrorTrackingConfig, IDatabaseConfig } from './config.interface';

export class ConfigService {

    /**
     * gets the configurations for the server
     *
     * @static
     * @returns {IServerConfig} values neeeded for server setup
     */
    public static getServerConfig(): IServerConfig {
        return ConfigStore.configStore.server;
    }

    /**
     * gets the config values needed for authentication
     *
     * @readonly
     * @type {IAuthConfig} the config values needed for authentication
     */
    public get authConfigs(): IAuthConfig {
        return ConfigStore.configStore.auth;
    }
}