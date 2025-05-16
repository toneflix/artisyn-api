import { Request, Response } from "express";
import Resource, { ApiResource } from 'src/resources/index';

import BaseController from "../BaseController";
import CategoryCollection from "src/resources/CategoryCollection";
import CategoryResource from "src/resources/CategoryResource";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Admin/CategoryController
 */
export default class extends BaseController {
    /**
     * Get all resource from the database
     * 
     * @param req 
     * @param res 
     */
    index = async (req: Request, res: Response) => {

        ApiResource(new CategoryCollection(req, res, {
            data: await prisma.category.findMany(
                { orderBy: { id: 'asc' } }
            ),
        }))
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

        const category = await prisma.category.findFirst(
            { where: { id: req.params.id } }
        )

        ApiResource(new CategoryResource(req, res, {
            data: category,
        }))
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
     * @example router.post('/categorys', upload.none(), new AdminController().create);
     * 
     * @param req 
     * @param res 
     */
    create = async (req: Request, res: Response) => {

        const formData = this.validate(req, {
            name: 'required|string|min:3',
            icon: 'string|min:3',
            description: 'string|min:10',
        });

        const data = await prisma.category.create({
            data: formData,
        })

        ApiResource(new CategoryResource(req, res, {
            data,
        }))
            .json()
            .status(201)
            .additional({
                status: 'success',
                message: 'New category created successfully',
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
        const formData = this.validate(req, {
            name: 'required|string|min:3',
            icon: 'string|min:3',
            description: 'string|min:10',
        });

        const data = await prisma.category.update({
            where: { id: req.params.id },
            data: formData,
        })

        ApiResource(new CategoryResource(req, res, {
            data,
        }))
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: 'Category updated successfully',
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
        await prisma.category.delete(
            { where: { id: req.params.id } }
        )

        ApiResource(new CategoryResource(req, res, {
            data: {},
        }))
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: 'category deleted successfully',
                code: 202,
            });
    }
}
