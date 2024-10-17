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
Object.defineProperty(exports, "__esModule", { value: true });
const currencyProcessor_1 = require("../currencyProcessor");
describe('calculateTotalInUSD', () => {
    it('should calculate the total amount in USD', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = [
            { currency: 'USD', amount: 100 },
            { currency: 'EUR', amount: 85 },
        ];
        const rates = { USD: 1.0, EUR: 0.85 };
        const totalInUSD = yield (0, currencyProcessor_1.calculateTotalInUSD)(transactions, rates);
        expect(totalInUSD).toBeCloseTo(200); // 100 USD + (85 EUR / 0.85) = 200 USD
    }));
    it('should handle missing conversion rates', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = [
            { currency: 'USD', amount: 100 },
            { currency: 'UNKNOWN', amount: 85 },
        ];
        const rates = { USD: 1.0 };
        const totalInUSD = yield (0, currencyProcessor_1.calculateTotalInUSD)(transactions, rates);
        expect(totalInUSD).toBeCloseTo(100); // Only the USD amount is processed
    }));
});
