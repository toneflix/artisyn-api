import { Router } from 'express';
import { name } from "../../package.json"

const router = Router();

router.get('/', (req, res) => {
    res.send(`Welcome to ${name}`);
});

export default router;
