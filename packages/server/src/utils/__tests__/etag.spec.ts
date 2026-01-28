import type { Request, Response } from 'express';

import { etagOf, sendJsonWithEtag } from '../etag';

describe('etag utilities', () => {
    describe('etagOf', () => {
        it('should return a consistent hash for the same payload', () => {
            const payload = { a: 1, b: 'test' };
            const etag1 = etagOf(payload);
            const etag2 = etagOf(payload);
            expect(etag1).toBe(etag2);
        });

        it('should return a different hash for different payloads', () => {
            const payload1 = { a: 1, b: 'test' };
            const payload2 = { a: 2, b: 'test' };
            const etag1 = etagOf(payload1);
            const etag2 = etagOf(payload2);
            expect(etag1).not.toBe(etag2);
        });

        it('should return a sha1 hex string', () => {
            const payload = { test: 'data' };
            const etag = etagOf(payload);
            expect(etag).toMatch(/^[a-f0-9]{40}$/);
        });
    });

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
    });
});
