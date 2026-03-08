import { Request, Response } from 'express';

import { getHealthStatus } from '../health';

describe('getHealthStatus handler', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            send: jest.fn(),
        };
    });

    it('should return OK status', () => {
        getHealthStatus(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.send).toHaveBeenCalledWith({
            status: 'OK',
        });
    });

    it('should call send exactly once', () => {
        getHealthStatus(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });
});
