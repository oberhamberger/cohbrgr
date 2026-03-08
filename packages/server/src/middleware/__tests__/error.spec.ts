import { NextFunction, Request, Response } from 'express';

import { errorHandler } from '../error';

describe('errorHandler middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            method: 'GET',
            url: '/api/test',
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it('should return 500 status code', () => {
        const error = new Error('Test error');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should return Internal Server Error message', () => {
        const error = new Error('Test error');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Internal Server Error',
        });
    });

    it('should handle errors with different request methods', () => {
        mockRequest.method = 'POST';
        const error = new Error('POST error');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Internal Server Error',
        });
    });
});
