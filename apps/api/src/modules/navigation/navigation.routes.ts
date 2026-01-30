import { Router as ExpressRouter } from 'express';
import {
    fullNavigationController,
    subNavigationController,
} from 'src/modules/navigation/controller/navigation.controller';

import type { Router } from 'express';

const router: Router = ExpressRouter();

router.get('/', fullNavigationController);
router.get('/:nodeId', subNavigationController);

export default router;
