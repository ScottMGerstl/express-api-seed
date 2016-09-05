export interface IApiException extends Error {
    code: number;
}

export abstract class BaseApiException implements IApiException {
    public name: string;
    public message: string;
    public code: number;

    constructor(message: string, name: string, code: number) {
        this.message = message;
        this.name = name;
        this.code = code;
    }
}

/**
 * Exception to indicate the failed attempt to access an authorized resource
 *
 * @export
 * @class UnauthorizedException
 * @extends {BaseApiException}
 */
export class UnauthorizedException extends BaseApiException {
    constructor(message?: string) {
        super(message || 'You are not authorized to access this resource', 'UnauthorizedException', 401);
    }
}

/**
 * Exception to indicate the failed attempt to access a resource that is nopt allowed to the accessor
 *
 * @export
 * @class ForbiddenException
 * @extends {BaseApiException}
 */
export class ForbiddenException extends BaseApiException {
    constructor() {
        super('you are not allowed to access this resource', 'ForbiddenException', 403);
    }
}

/**
 * Exception to indicate the failed attempt to find a specific resource
 *
 * @export
 * @class NotFoundException
 * @extends {BaseApiException}
 */
export class NotFoundException extends BaseApiException {
    constructor(message: string) {
        super(message, 'NotFoundException', 404);
    }
}

/**
 * Exception to indicate the dicovery of more than one resource when only one was expected
 *
 * @export
 * @class ConflictException
 * @extends {BaseApiException}
 */
export class ConflictException extends BaseApiException {
    constructor(message: string) {
        super(message, 'ConflictException', 409);
    }
}