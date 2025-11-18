import type { Router } from 'express';
import { Router as ExpressRouter } from 'express';
import { fullNavigationController } from 'src/modules/navigation/controller/navigation.controller';

const router: Router = ExpressRouter();

router.get('/', fullNavigationController);

export default router;
