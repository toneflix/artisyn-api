import express, { Express } from "express"
import { facebookStrategy, googleStrategy } from './passport';
import routes, { loadRoutes } from 'src/routes/index';

import { ErrorHandler } from "./request-handlers";
import cors from 'cors';
import { env } from './helpers';
import logger from 'pino-http';
import methodOverride from 'method-override';
import passport from 'passport';
import path from 'path';
import { activityLogger } from '../middleware/activityLogger';

export const initialize = (app: Express) => {
    // Parse application/x-www-form-urlencoded (for non-multipart forms)
    app.use(express.urlencoded({ extended: true }));

    // Method Override 
    app.use(methodOverride('X-HTTP-Method'))

    // Route And Cors
    loadRoutes(path.resolve(__dirname, '../routes'));
    app.use(cors());
    app.use(routes);

    // Passport
    passport.use(googleStrategy())
    passport.use(facebookStrategy())

    // Initialize 
    app.use(passport.initialize());

    // Error Handler
    app.use(ErrorHandler)

    // Logger
    if (env('NODE_ENV') !== 'test') {
        app.use(logger())
    }

    // Activity Logger
    app.use(activityLogger); // Register activity logger globally
}
