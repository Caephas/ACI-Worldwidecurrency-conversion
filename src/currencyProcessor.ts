import { fetchConversionRates } from './utils/fetchRates';
import { processCSV } from './utils/processCSV';

async function calculateTotalInUSD(transactions: any[], rates: Record<string, number>): Promise<number> {
  let total = 0;

  transactions.forEach((transaction) => {
    const rate = rates[transaction.currency];
    if (rate) {
      total += transaction.amount / rate; // Convert to USD
    } else {
      console.warn(`No rate found for ${transaction.currency}`);
    }
  });

  return total;
}

async function main() {
  try {
    const rates = await fetchConversionRates();
    const transactions = await processCSV('./subTask1.csv');
    const totalInUSD = await calculateTotalInUSD(transactions, rates);

    console.log(`Total amount in USD: ${totalInUSD.toFixed(2)}`);
  } catch (error) {
    console.error('Error processing currency transactions:');
  }
}

main();