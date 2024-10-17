import { calculateTotalInUSD } from "../currencyProcessor";

describe('calculateTotalInUSD', () => {
    let consoleWarnSpy: jest.SpyInstance;
  
    beforeAll(() => {
      // Mock console.warn to suppress warnings in the test output
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
  
    afterAll(() => {
      // Restore console.warn after tests are done
      consoleWarnSpy.mockRestore();
    });
  
    it('should calculate the total amount in USD', async () => {
      const transactions = [
        { currency: 'USD', amount: 100 },
        { currency: 'EUR', amount: 85 },
      ];
      const rates = { USD: 1.0, EUR: 0.85 };
  
      const totalInUSD = await calculateTotalInUSD(transactions, rates);
      expect(totalInUSD).toBeCloseTo(200); // 100 USD + (85 EUR / 0.85) = 200 USD
    });
  
    it('should handle missing conversion rates', async () => {
      const transactions = [
        { currency: 'USD', amount: 100 },
        { currency: 'UNKNOWN', amount: 85 },
      ];
      const rates = { USD: 1.0 };
  
      const totalInUSD = await calculateTotalInUSD(transactions, rates);
      expect(totalInUSD).toBeCloseTo(100); // Only the USD amount is processed
    });
  });