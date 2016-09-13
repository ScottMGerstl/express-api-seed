import { IConfig } from './config.interface';

export var configStore: IConfig = {
    environment: 'local',
    server: {
        port: process.env.PORT || 8088
    },
    auth: {
        iss: 'mysite.com',
        accountSecret: '1234567890',
        validDays: 7
    },
    errorTracking: {
        accessToken: 'putYourTokenHere'
    }
};