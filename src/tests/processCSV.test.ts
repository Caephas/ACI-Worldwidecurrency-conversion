import fs from 'fs';
import { processCSV } from '../utils/processCSV';
import csv from 'csv-parser';

// Mocking fs and csv-parser
jest.mock('fs');
jest.mock('csv-parser');

describe('processCSV', () => {
  const mockData = [
    { currency: 'USD', amount: '100' },
    { currency: 'EUR', amount: '85' }
  ];

  it('should process CSV data correctly', async () => {
    // Mocking fs and csv-parser behavior
    const on = jest.fn().mockReturnThis();
    const pipe = jest.fn().mockReturnThis();
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe });
    (csv as jest.Mock).mockReturnValue({ on });

    on.mockImplementation((event: string, callback: (data: any) => void) => {
      if (event === 'data') {
        callback(mockData[0]);
        callback(mockData[1]);
      } else if (event === 'end') {
        callback(null);
      }
      return { on };
    });

    const data = await processCSV('mock.csv');
    expect(data).toEqual(mockData);
  });

  it('should reject when an error occurs during file reading', async () => {
    const on = jest.fn().mockReturnThis();
    const pipe = jest.fn().mockReturnThis();
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe });
    (csv as jest.Mock).mockReturnValue({ on });

    on.mockImplementation((event: string, callback: (data: any) => void) => {
      if (event === 'error') {
        callback(new Error('File read error'));
      }
      return { on };
    });

    await expect(processCSV('mock.csv')).rejects.toThrow('File read error');
  });
});