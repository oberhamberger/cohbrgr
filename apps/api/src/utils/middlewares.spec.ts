import type { Request, Response } from 'express';

import { etagOf } from './common';
import { sendJsonWithEtag } from './middlewares';

describe('middlewares', () => {
    describe('sendJsonWithEtag', () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;

        beforeEach(() => {
            mockRequest = {
                headers: {},
            };
            mockResponse = {
                req: mockRequest as Request,
                set: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
                end: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
        });

        it('should set ETag header on response', () => {
            const payload = { test: 'data' };

            sendJsonWithEtag(mockResponse as Response, payload);

            expect(mockResponse.set).toHaveBeenCalledWith(
                'ETag',
                etagOf(payload),
            );
        });

        it('should return 304 when If-None-Match matches ETag', () => {
            const payload = { test: 'data' };
            const etag = etagOf(payload);
            mockRequest.headers = { 'if-none-match': etag };

            sendJsonWithEtag(mockResponse as Response, payload);

            expect(mockResponse.status).toHaveBeenCalledWith(304);
            expect(mockResponse.end).toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it('should return JSON when If-None-Match does not match', () => {
            const payload = { test: 'data' };
            mockRequest.headers = { 'if-none-match': 'different-etag' };

            sendJsonWithEtag(mockResponse as Response, payload);

            expect(mockResponse.json).toHaveBeenCalledWith(payload);
            expect(mockResponse.status).not.toHaveBeenCalledWith(304);
        });

        it('should return JSON when no If-None-Match header', () => {
            const payload = { test: 'data' };
            mockRequest.headers = {};

            sendJsonWithEtag(mockResponse as Response, payload);

            expect(mockResponse.json).toHaveBeenCalledWith(payload);
        });

        it('should handle complex payloads', () => {
            const payload = {
                nested: { data: [1, 2, 3] },
                string: 'test',
            };

            sendJsonWithEtag(mockResponse as Response, payload);

            expect(mockResponse.set).toHaveBeenCalledWith(
                'ETag',
                expect.any(String),
            );
            expect(mockResponse.json).toHaveBeenCalledWith(payload);
        });
    });
});
