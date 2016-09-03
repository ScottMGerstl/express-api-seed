import { IConfig } from './config.interface';

export var configStore: IConfig = {
    environment: 'local',
    server: {
        ipAddress: '127.0.0.1',
        port: 8088
    },
    auth: {
        iss: 'mysite.com',
        accountSecret: '1234567890',
        validDays: 7
    }
};