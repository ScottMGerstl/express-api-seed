export interface IApiException extends Error {
    code: number;
}

export class BaseApiException implements IApiException {
    public name: string;
    public message: string;
    public code: number;

    constructor(message: string, name: string, code: number) {
        this.message = message;
        this.name = name;
        this.code = code;
    }
}

export class UnauthorizedException extends BaseApiException {
    constructor(message?: string) {
        super(message || 'You are not authorized to access this resource', 'UnauthorizedException', 401);
    }
}

export class ForbiddenException extends BaseApiException {
    constructor() {
        super('you are not allowed to access this resource', 'ForbiddenException', 403);
    }
}

export class NotFoundException extends BaseApiException {
    constructor(message: string) {
        super(message, 'NotFoundException', 404);
    }
}

export class ConflictException extends BaseApiException {
    constructor(message: string) {
        super(message, 'ConflictException', 409);
    }
}