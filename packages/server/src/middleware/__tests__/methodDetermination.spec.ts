import { NextFunction, Request, Response } from 'express';

import { HttpMethod, methodDetermination } from '../methodDetermination';

describe('methodDetermination middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;

    const expectedResponse = {
        error: 'Method Not allowed',
    };

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(function (code) {
                this.statusCode = code;
                return this;
            }),
        };
        mockNext = jest.fn();
    });

    it('should return 405 without any Headers', async () => {
        methodDetermination(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockResponse.statusCode).toBe(405);
        expect(mockResponse.send).toHaveBeenCalled();
        expect(mockResponse.send).toHaveReturned();
        expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse.error);
    });

    it('should return 405 for POST Requests', async () => {
        methodDetermination(
            {
                method: HttpMethod.POST,
            } as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockResponse.statusCode).toBe(405);
        expect(mockResponse.send).toHaveBeenCalled();
        expect(mockResponse.send).toHaveReturned();
        expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse.error);
    });

    it('should call next() for HEAD Requests', async () => {
        methodDetermination(
            {
                method: HttpMethod.GET,
            } as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for GET Requests', async () => {
        methodDetermination(
            {
                method: HttpMethod.GET,
            } as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockNext).toHaveBeenCalled();
    });
});
