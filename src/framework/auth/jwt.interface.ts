export interface JwtHeader {
    type: string;
    tkv: string;
}

export interface JwtPayload {
    iss: string;
    sub: number;
    iat: number;
    exp: number;
}