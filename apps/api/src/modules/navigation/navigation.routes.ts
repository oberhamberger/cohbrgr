import type { Router } from 'express';
import { Router as ExpressRouter } from 'express';
import {
    fullNavigationController,
    subNavigationController,
} from 'src/modules/navigation/controller/navigation.controller';

const router: Router = ExpressRouter();

router.get('/', fullNavigationController);
router.get('/:nodeId', subNavigationController);

export default router;
