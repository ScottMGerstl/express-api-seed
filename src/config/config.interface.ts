export interface IConfig {
    environment: string;
    apiLocation: IApiLocation;
}

export interface IErrorTracking {
    accessToken: string;
}

export interface IApiLocation {
    ipAddress: string;
    port: number;
}

export interface IDatabaseConnection {
    user: string;
    password: string;
    port: number;
    host: string;
    databaseName: string;
}
