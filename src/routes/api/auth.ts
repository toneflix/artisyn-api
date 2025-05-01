import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
    res.json({
        data: {
            id: 1,
        },
        status: 'success',
        message: 'Login was successfull',
        code: 200,
    });
});

export default router;
