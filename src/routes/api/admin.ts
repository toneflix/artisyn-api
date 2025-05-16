import CategoryController from 'src/controllers/Admin/CategoryController';
import { Router } from 'express';
import { authenticateToken } from 'src/utils/helpers';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'public/media' })

router.get('/categories', authenticateToken, new CategoryController().index);
router.post('/categories', authenticateToken, upload.none(), new CategoryController().create);
router.get('/categories/:id', authenticateToken, new CategoryController().show);
router.put('/categories/:id', authenticateToken, upload.none(), new CategoryController().update);
router.delete('/categories/:id', authenticateToken, upload.none(), new CategoryController().delete);

export default router;
