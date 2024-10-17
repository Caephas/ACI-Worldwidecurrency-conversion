import fs from 'fs';
import csv from 'csv-parser';

interface Transaction {
  currency: string;
  amount: number;
}

interface Fee {
  currency: string;
  feeRate: number;
}

export function processCSV(filePath: string): Promise<Transaction[]> {
  const transactions: Transaction[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const transaction: Transaction = {
          currency: row['currency'],
          amount: parseFloat(row['amount']),
        };
        transactions.push(transaction);
      })
      .on('end', () => {
        resolve(transactions);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export function processFeesCSV(filePath: string): Promise<Fee[]> {
  const fees: Fee[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const fee: Fee = {
          currency: row['currency'],
          feeRate: parseFloat(row['fee']),
        };
        fees.push(fee);
      })
      .on('end', () => {
        resolve(fees);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}