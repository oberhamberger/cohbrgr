import type { Router } from 'express';
import { Router as ExpressRouter } from 'express';
import {
    fullTranslationController,
    languageSpecificTranslationController,
} from 'src/modules/translation/controller/translation.controller';
import { requireSupportedLanguage } from 'src/modules/translation/middleware/language.middleware';

const router: Router = ExpressRouter();

router.get('/', fullTranslationController);
router.get(
    '/:lang',
    requireSupportedLanguage,
    languageSpecificTranslationController,
);

export default router;
