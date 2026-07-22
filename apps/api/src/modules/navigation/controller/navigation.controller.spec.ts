import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';

import navigationService from 'src/modules/navigation/services/navigation.service';

import { sendJsonWithEtag } from '@cohbrgr/server';

import {
    fullNavigationController,
    subNavigationController,
} from './navigation.controller';

import type { Request, Response } from 'express';

vi.mock('src/modules/navigation/services/navigation.service');
vi.mock('@cohbrgr/server', async () => ({
    ...(await vi.importActual('@cohbrgr/server')),
    sendJsonWithEtag: vi.fn(),
}));

describe('navigation.controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('fullNavigationController', () => {
        it('should call navigationService.get and send the result', () => {
            const navigationData = { hero: { nodes: [] } };
            (navigationService.get as Mock).mockReturnValue(navigationData);

            fullNavigationController(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(navigationService.get).toHaveBeenCalledTimes(1);
            expect(sendJsonWithEtag).toHaveBeenCalledWith(
                mockResponse,
                navigationData,
            );
        });
    });

    describe('subNavigationController', () => {
        it('should return 400 if nodeId is missing', () => {
            mockRequest.params = {};

            subNavigationController(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Node ID is required',
            });
        });

        it('should return 404 if sub-navigation is not found', () => {
            const nodeId = 'non-existent-node';
            mockRequest.params = { nodeId };
            (navigationService.getSubNavigation as Mock).mockReturnValue(
                undefined,
            );

            subNavigationController(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(navigationService.getSubNavigation).toHaveBeenCalledWith(
                nodeId,
            );
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: `Sub-navigation for '${nodeId}' not found`,
            });
        });

        it('should call navigationService.getSubNavigation and send the result', () => {
            const nodeId = 'hero';
            const subNavigationData = [{ id: 'hero-github' }];
            mockRequest.params = { nodeId };
            (navigationService.getSubNavigation as Mock).mockReturnValue(
                subNavigationData,
            );

            subNavigationController(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(navigationService.getSubNavigation).toHaveBeenCalledWith(
                nodeId,
            );
            expect(sendJsonWithEtag).toHaveBeenCalledWith(
                mockResponse,
                subNavigationData,
            );
        });
    });
});
