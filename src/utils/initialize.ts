import { facebookStrategy, googleStrategy } from './passport';

import { ErrorHandler } from "./request-handlers";
import { Express } from "express"
import cors from 'cors';
import { env } from './helpers';
import logger from 'pino-http';
import passport from 'passport';
import routes from 'src/routes/index';

export const initialize = (app: Express) => {
    // Route And Cors
    app.use(cors());
    app.use(routes);

    // Initialize Passport
    passport.use(googleStrategy())
    passport.use(facebookStrategy())
    app.use(passport.initialize());

    // Error Handler
    app.use(ErrorHandler)

    // Logger
    if (env('NODE_ENV') !== 'test') {
        app.use(logger())
    }
}
