"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const processCSV_1 = require("../utils/processCSV");
const csv_parser_1 = __importDefault(require("csv-parser"));
// Mocking fs and csv-parser
jest.mock('fs');
jest.mock('csv-parser');
describe('processCSV', () => {
    const mockData = [
        { currency: 'USD', amount: '100' },
        { currency: 'EUR', amount: '85' }
    ];
    it('should process CSV data correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking fs and csv-parser behavior
        const on = jest.fn().mockReturnThis();
        const pipe = jest.fn().mockReturnThis();
        fs_1.default.createReadStream.mockReturnValue({ pipe });
        csv_parser_1.default.mockReturnValue({ on });
        on.mockImplementation((event, callback) => {
            if (event === 'data') {
                callback(mockData[0]);
                callback(mockData[1]);
            }
            else if (event === 'end') {
                callback(null);
            }
            return { on };
        });
        const data = yield (0, processCSV_1.processCSV)('mock.csv');
        expect(data).toEqual(mockData);
    }));
    it('should reject when an error occurs during file reading', () => __awaiter(void 0, void 0, void 0, function* () {
        const on = jest.fn().mockReturnThis();
        const pipe = jest.fn().mockReturnThis();
        fs_1.default.createReadStream.mockReturnValue({ pipe });
        csv_parser_1.default.mockReturnValue({ on });
        on.mockImplementation((event, callback) => {
            if (event === 'error') {
                callback(new Error('File read error'));
            }
            return { on };
        });
        yield expect((0, processCSV_1.processCSV)('mock.csv')).rejects.toThrow('File read error');
    }));
});
