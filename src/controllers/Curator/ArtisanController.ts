import { Request, Response } from "express";

import BaseController from "src/controllers/BaseController";
import { PrismaClient } from "@prisma/client";
import Resource from 'src/resources/index';
import { regex } from "simple-body-validator";

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
                            id: req.user?.curator?.id
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
        console.log(req.body)
        const data = await this.validateAsync(req, {
            name: `required|string|unique:artisan|min:3`,
            email: 'nullable|required_without:phone|email|unique:artisan',
            phone: 'nullable|required_without:email|unique:artisan',
            price: 'nullable|string|min:0',
            price_range: ['nullable', 'string', regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?-\d{1,3}(,\d{3})*(\.\d{1,2})?$/)],
            type: 'nullable|string|in:PERSON,BUSINESS',
            description: 'required|string|min:10',
            category_id: 'required|exists:category,id',
            country: 'required|string',
            state: 'required|string',
            city: 'required|string',
        });

        const artisan = await prisma.artisan.create({
            data: Object.assign({}, data, {
                curator: { connect: { id: req.user?.id! } },
                category: { connect: { id: data.category_id } },
                priceRange: (data.price_range ?? '').replaceAll(' ', '').split('-').map((e: string) => parseFloat(e)),
                price: parseFloat(data.price ?? '0'),
                price_range: undefined,
                category_id: undefined,
                country: undefined,
                state: undefined,
                city: undefined,
                location: {
                    create: {
                        country: data.country,
                        state: data.state,
                        city: data.city,
                        latitude: 0,
                        longitude: 0,
                    }
                }
            }),
            include: {
                category: true,
                location: true,
            },
        })

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
