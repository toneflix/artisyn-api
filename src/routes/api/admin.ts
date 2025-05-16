import CategoryController from 'src/controllers/Admin/CategoryController';
import { Router } from 'express';

const router = Router();

router.get('/categories', new CategoryController().index);

export default router;
