import { NextFunction, Request, Response } from 'express';
import methodDetermination, {
    HttpMethod,
} from 'src/server/middleware/methodDetermination';

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
        expect(mockResponse.send).toBeCalled();
        expect(mockResponse.send).toReturn();
        expect(mockResponse.send).toBeCalledWith(expectedResponse.error);
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
        expect(mockResponse.send).toBeCalled();
        expect(mockResponse.send).toReturn();
        expect(mockResponse.send).toBeCalledWith(expectedResponse.error);
    });

    it('should call next() for HEAD Requests', async () => {
        methodDetermination(
            {
                method: HttpMethod.GET,
            } as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockNext).toBeCalled();
    });

    it('should call next() for GET Requests', async () => {
        methodDetermination(
            {
                method: HttpMethod.GET,
            } as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockNext).toBeCalled();
    });
});
