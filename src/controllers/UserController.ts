import { Request, Response } from "express";

import Resource from '../resources/index';

/**
 * UserController
 */
export default class {
    async index (req: Request, res: Response) {

        Resource(req, res, {
            data: [],
        })
            .json()
            .status(200)
            .additional({
                status: 'success',
                message: 'OK',
                code: 200,
            });
    }

    async show (req: Request, res: Response) {
        Resource(req, res, {
            data: {},
        })
            .json()
            .status(200)
            .additional({
                status: 'success',
                message: 'OK',
                code: 200,
            });
    }

    async create (req: Request, res: Response) {
        Resource(req, res, {
            data: {},
        })
            .json()
            .status(201)
            .additional({
                status: 'success',
                message: 'New User created successfully',
                code: 201,
            });
    }

    async update (req: Request, res: Response) {
        Resource(req, res, {
            data: {},
        })
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: 'User updated successfully',
                code: 202,
            });
    }

    async delete (req: Request, res: Response) {
        Resource(req, res, {
            data: {},
        })
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: 'User deleted successfully',
                code: 202,
            });
    }
}
