import * as ConfigStore from './config-store';
import { IConfig, IAuthConfig, IServerConfig, IErrorTrackingConfig, IDatabaseConfig } from './config.interface';

export class ConfigService {

    public static getAuthConfigs(): IAuthConfig {
        return ConfigStore.configStore.auth;
    }

    public static getServerConfig(): IServerConfig {
        return ConfigStore.configStore.server;
    }
}