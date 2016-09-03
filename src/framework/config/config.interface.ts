export interface IConfig {
    environment: string;
    server: IServerConfig;
    auth: IAuthConfig;
}

export interface IErrorTrackingConfig {
    accessToken: string;
}

export interface IServerConfig {
    ipAddress: string;
    port: number;
}

export interface IAuthConfig {
    iss: string;
    accountSecret: string;
    validDays: number;
}

export interface IDatabaseConfig {
    user: string;
    password: string;
    port: number;
    host: string;
    databaseName: string;
}
