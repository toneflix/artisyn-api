export class ValidationError extends Error {
    errors: Record<string, string[] | string>
    statusCode: number = 422;

    constructor(message?: string, errors: Record<string, string[] | string> = {}, options?: ErrorOptions) {
        super(message, options);
        this.errors = errors
    }
}

export class RequestError extends Error {
    statusCode: number;

    constructor(message?: string, statusCode: number = 422, options?: ErrorOptions) {
        super(message, options);
        this.statusCode = statusCode
    }
}
