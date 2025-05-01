import { Router } from 'express';
import { name as appName } from "../../package.json"

const router = Router();

router.get('/', (req, res) => {
    res.send(`Welcome to ${appName}`);
});

export default router;
