import { join, relative } from 'path';
import { readdirSync, statSync } from 'fs';

import { Router } from 'express';

const router = Router();
const routesPath = __dirname;

export const loadRoutes = (dirPath: string) => {
    readdirSync(dirPath)
        .forEach((file) => {
            const fullPath = join(dirPath, file);
            const stats = statSync(fullPath);

            if (file.startsWith('__tests__')) {
                return;
            }

            if (stats.isDirectory()) {
                // Recurse into subdirectory
                loadRoutes(fullPath);
            } else if (stats.isFile() && !file.startsWith('index') && /\.(ts|js)$/.test(file)) {
                const routeModule = require(fullPath);
                const route = routeModule.default;

                if (route && typeof route === 'function') {
                    const relPath = relative(routesPath, fullPath).replace(/\.(ts|js)$/, '');
                    // const parts = parse(relPath);
                    let mountPath = '/' + relPath.replace(/\\/g, '/');

                    // Special case: web.ts mounts at "/"
                    if (mountPath === '/web') mountPath = '/';

                    if (mountPath.includes('/__')) mountPath = mountPath.replace(/\/__\w+/g, '')

                    router.use(mountPath, route);
                }
            }
        });
}

export default router;
