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
const fetchRates_1 = require("../utils/fetchRates");
const axios_1 = __importDefault(require("axios"));
// Mock axios
jest.mock('axios');
describe('fetchConversionRates', () => {
    it('should return conversion rates successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRates = { USD: 1.0, EUR: 0.85 };
        axios_1.default.get.mockResolvedValue({ data: { rates: mockRates } });
        const rates = yield (0, fetchRates_1.fetchConversionRates)();
        expect(rates).toEqual(mockRates);
    }));
    it('should throw an error when fetching rates fails', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get.mockRejectedValue(new Error('Error fetching conversion rates'));
        yield expect((0, fetchRates_1.fetchConversionRates)()).rejects.toThrow('Error fetching conversion rates');
    }));
});
