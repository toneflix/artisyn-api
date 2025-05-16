import CategoryController from 'src/controllers/Admin/CategoryController';
import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'public/media' })

router.get('/categories', new CategoryController().index);
router.post('/categories', upload.none(), new CategoryController().create);
router.get('/categories/:id', new CategoryController().show);
router.put('/categories/:id', upload.none(), new CategoryController().update);
router.delete('/categories/:id', upload.none(), new CategoryController().delete);

export default router;
