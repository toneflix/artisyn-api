import { Request, Response } from "express";

import BaseController from "src/controllers/BaseController";
import { PrismaClient } from "@prisma/client";
import Resource from 'src/resources/index';

const prisma = new PrismaClient();

/**
 * Curator/ArtisanStateController
 */
export default class extends BaseController {
    /**
     * Set the activation status of a specific resource in the database
     * 
     * @param req 
     * @param res 
     */
    activation = async (req: Request, res: Response) => {
        const { active: isActive } = this.validate(req, {
            active: 'required|boolean',
        });

        const data = await prisma.artisan.update({
            data: { isActive },
            where: {
                id: req.params.id || '-',
                archivedAt: null,
                curator: {
                    id: req.user?.id
                }
            },
        })

        Resource(req, res, { data })
            .json()
            .status(202)
            .additional({
                status: 'success',
                message: `Artisan ${!isActive ? 'de' : ''}activated successfully.`,
                code: 202,
            });
    }
}
