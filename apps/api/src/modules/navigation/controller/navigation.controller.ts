import type { Request, Response } from 'express';
import navigationService from 'src/modules/navigation/services/navigation.service';
import { sendJsonWithEtag } from 'src/utils/middlewares';

export const fullNavigationController = (
    _request: Request,
    response: Response,
) => {
    sendJsonWithEtag(response, navigationService.get());
};
