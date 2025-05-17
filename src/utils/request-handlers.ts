import { NextFunction, Request, Response } from "express"

import { BaseError } from "./errors";
import { Prisma } from "@prisma/client";
import { env } from "./helpers";

export const ErrorHandler = (err: BaseError, req: Request, res: Response, next?: NextFunction) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';

    const error: Record<string, any> = {
        status: 'error',
        code: errStatus,
        message: errMsg,
    }

    if (err.errors) {
        error.errors = err.errors
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        error.code = 404
        error.message = `${err.meta?.modelName} not found!`
    }

    if (env('NODE_ENV') === 'development' && env<boolean>('HIDE_ERROR_STACK') !== true) {
        error.stack = err.stack
    }

    res.status(error.code).json(error)
}

export default ErrorHandler
