import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
    res.status(202).json({
        data: {
            id: 1,
        },
        status: 'success',
        message: 'Login was successfull',
        code: 202,
    });
});

export default router;
