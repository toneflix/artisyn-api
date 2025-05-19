import { NextFunction, Request, Response } from "express"

import { BaseError } from "./errors";
import { Prisma } from "@prisma/client";
import { env } from "./helpers";

export const ErrorHandler = (err: BaseError | string, req: Request, res: Response, next?: NextFunction) => {

    const message = 'Something went wrong';

    const error: Record<string, any> = {
        status: 'error',
        code: typeof err === 'string' || !err.statusCode ? 500 : err.statusCode,
        message: typeof err === 'string' ? `${message}: ${err}` : err.message || message,
    }

    if (typeof err !== 'string' && err.errors) {
        error.errors = err.errors
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        error.code = 404
        error.message = `${err.meta?.modelName} not found!`
    }

    if (typeof err !== 'string' && env('NODE_ENV') === 'development' && env<boolean>('HIDE_ERROR_STACK') !== true) {
        error.stack = err.stack
    }

    res.status(error.code).json(error)
}

export default ErrorHandler
