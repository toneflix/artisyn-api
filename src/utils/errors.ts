import { Request, Response } from "express"

import ErrorHandler from "./request-handlers";

export class BaseError extends Error {

    errors?: { [key: string]: string[] | string } | undefined = undefined;

    statusCode: number;

    constructor(message?: string, statusCode: number = 400, options?: ErrorOptions) {
        super(message, options);
        this.statusCode = statusCode
    }
}
export class ValidationError extends BaseError {
    errors: { [key: string]: string[] | string }
    statusCode: number = 422;

    constructor(message?: string, errors: { [key: string]: string[] | string } = {}, options?: ErrorOptions) {
        super(message, 422, options);
        this.errors = errors
    }

    static withMessages (messages: { [key: string]: string[] }) {
        const keys = Object.keys(messages)
        const message = keys.length > 1
            ? `${messages[keys[0]][0]} and ${keys.length - 1} other error(s)`
            : messages[keys[0]][0]

        throw new ValidationError(message, messages);
    }
}

export class RequestError extends BaseError {

    statusCode: number;

    constructor(message?: string, statusCode: number = 400, options?: ErrorOptions) {
        super(message, statusCode, options);
        this.statusCode = statusCode
    }

    static abortIf (boolean: boolean, message: string, code?: number, req?: Request, res?: Response) {
        if (boolean) {
            if (req && res) {
                return ErrorHandler(new RequestError(message, code), req, res)
            }

            throw new RequestError(message, code);
        }
    }
}

export class AutheticationError extends RequestError {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, 401, options);
        this.message = message ?? 'Unauthenticated'
    }
}

