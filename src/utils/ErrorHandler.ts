import { NextFunction, Request, Response } from "express"

import { env } from "./helpers";

interface RequestError extends Error {
    statusCode?: number | undefined,
    errors?: Record<string, any> | undefined
}

const ErrorHandler = (err: RequestError, req: Request, res: Response, next: NextFunction) => {
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

    if (env('NODE_ENV') === 'development') {
        error.stack = err.stack
    }

    res.status(errStatus).json(error)
}

export default ErrorHandler
