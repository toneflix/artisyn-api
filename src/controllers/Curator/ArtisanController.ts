import { Request, Response } from "express";

import BaseController from "src/controllers/BaseController";
import { PrismaClient } from "@prisma/client";
import Resource from 'src/resources/index';

const prisma = new PrismaClient();

/**
 * Curator/ArtisanController
 */
export default class extends BaseController {
    /**
     * Get all resource from the database
     * 
     * @param req 
     * @param res 
     */
    index = async (req: Request, res: Response) => {

        Resource(req, res, {
            data: await prisma.artisan.findMany(
                {
                    where: {
                        curator: {
                            id: req.user?.id
                        }
                    },
                    orderBy: { id: 'asc' }
                }
            ),
        })
            .json()
            .status(200)
            .additional({
                status: 'success',
                message: 'OK',
                code: 200,
            });
    }

    /**
     * Get a specific resource from the database
     * 
     * @param req 
     * @param res 
     */
    show = async (req: Request, res: Response) => {
        Resource(req, res, {
            data: await prisma.artisan.findFirstOrThrow(
                {
                    where: {
                        id: req.params.id || '-',
                        curator: {
                            id: req.user?.id
                        }
                    }
                }
            ),
        })
            .json()
            .status(200)
            .additional({
                status: 'success',
                message: 'OK',
                code: 200,
            });
    }

    /**
     * Create a new resource in the database
     * 
     * The calling route must recieve a multer.RequestHandler instance
     * 
     * @example router.post('/artisans', upload.none(), new AdminController().create);
     * 
     * @param req 
     * @param res 
     */
    create = async (req: Request, res: Response) => {

        const data = await this.validateAsync(req, {
            name: `required|string|unique:artisan|min:3`,
            email: 'nullable|email|unique:artisan',
            description: 'nullable|string|min:10',
        }) as any;

        const artisan = await prisma.artisan.create({ data })

        Resource(req, res, {
            data: artisan,
        })
            .json()
            .status(201)
            .additional({
                status: 'success',
                message: 'New artisan created successfully',
                code: 201,
            });
    }

    /**
     * Update a specific resource in the database
     * 
     * @param req 
     * @param res 
     */
    update = async (req: Request, res: Response) => {
        const data = await prisma.artisan.update({
            where: { id: req.params.id },
            data: req.body(),
        })

        Resource(req, res, {
            data,
        })
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: 'artisan updated successfully',
                code: 202,
            });
    }

    /**
     * Delete a specific resource from the database
     * 
     * @param req 
     * @param res 
     */
    delete = async (req: Request, res: Response) => {
        await prisma.artisan.delete(
            { where: { id: req.params.id } }
        )

        Resource(req, res, {
            data: {},
        })
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: 'artisan deleted successfully',
                code: 202,
            });
    }
}
