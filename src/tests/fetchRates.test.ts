import { fetchConversionRates } from '../utils/fetchRates';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('fetchConversionRates', () => {
  it('should return conversion rates successfully', async () => {
    const mockRates = { USD: 1.0, EUR: 0.85 };
    (axios.get as jest.Mock).mockResolvedValue({ data: { rates: mockRates } });

    const rates = await fetchConversionRates();
    expect(rates).toEqual(mockRates);
  });

  it('should throw an error when fetching rates fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Error fetching conversion rates'));

    await expect(fetchConversionRates()).rejects.toThrow('Error fetching conversion rates');
  });
});