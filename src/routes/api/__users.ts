import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
    res.json({
        data: [],
        status: 'success',
        message: 'OK',
        code: 200,
    });
});

export default router;
