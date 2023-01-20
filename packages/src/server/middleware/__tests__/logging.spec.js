"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("src/server/middleware/logging"));
describe('logging middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeEach(() => {
        mockRequest = {
            ip: 'test',
            headers: {
                'user-agent': 'test',
            },
        };
        mockResponse = {
            statusCode: 0,
            json: jest.fn(),
            send: jest.fn(),
        };
        mockNext = jest.fn();
    });
    it('should call next() for all requests', async () => {
        (0, logging_1.default)(true)(mockRequest, mockResponse, mockNext);
        expect(mockNext).toBeCalled();
    });
});
//# sourceMappingURL=logging.spec.js.map