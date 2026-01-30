import type { Request, Response } from 'express';
import navigationService from 'src/modules/navigation/services/navigation.service';

import { sendJsonWithEtag } from '@cohbrgr/server';

/**
 * Controller that returns the complete navigation structure with ETag caching.
 */
export const fullNavigationController = (
    _request: Request,
    response: Response,
) => {
    return sendJsonWithEtag(response, navigationService.get());
};

/**
 * Controller that returns the sub-navigation for a specific node ID with ETag caching.
 */
export const subNavigationController = (
    _request: Request,
    response: Response,
) => {
    const { nodeId } = _request.params;

    if (!nodeId) {
        return response.status(400).json({ error: 'Node ID is required' });
    }

    const subNavigation = navigationService.getSubNavigation(nodeId);
    if (subNavigation) {
        return sendJsonWithEtag(response, subNavigation);
    } else {
        return response
            .status(404)
            .json({ error: `Sub-navigation for '${nodeId}' not found` });
    }
};
