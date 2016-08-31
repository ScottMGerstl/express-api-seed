import * as ConfigStore from './config-store';
import { IConfig } from './config.interface';

export class ConfigService {

    private static configs: IConfig;

    public static getConfigs() {
        if (this.configs === undefined) {
            this.configs = ConfigStore.configStore;
        }

        return this.configs;
    }
}