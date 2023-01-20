"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const methodDetermination_1 = __importStar(require("src/server/middleware/methodDetermination"));
describe('methodDetermination middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
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
        (0, methodDetermination_1.default)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.statusCode).toBe(405);
        expect(mockResponse.send).toBeCalled();
        expect(mockResponse.send).toReturn();
        expect(mockResponse.send).toBeCalledWith(expectedResponse.error);
    });
    it('should return 405 for POST Requests', async () => {
        (0, methodDetermination_1.default)({
            method: methodDetermination_1.HttpMethod.POST,
        }, mockResponse, mockNext);
        expect(mockResponse.statusCode).toBe(405);
        expect(mockResponse.send).toBeCalled();
        expect(mockResponse.send).toReturn();
        expect(mockResponse.send).toBeCalledWith(expectedResponse.error);
    });
    it('should call next() for HEAD Requests', async () => {
        (0, methodDetermination_1.default)({
            method: methodDetermination_1.HttpMethod.GET,
        }, mockResponse, mockNext);
        expect(mockNext).toBeCalled();
    });
    it('should call next() for GET Requests', async () => {
        (0, methodDetermination_1.default)({
            method: methodDetermination_1.HttpMethod.GET,
        }, mockResponse, mockNext);
        expect(mockNext).toBeCalled();
    });
});
//# sourceMappingURL=methodDetermination.spec.js.map