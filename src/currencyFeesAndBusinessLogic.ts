import { fetchConversionRates } from './utils/fetchRates';
import { processCSV, processFeesCSV } from './utils/processCSV';

async function calculateTotalInUSD(transactions: any[], fees: any[], rates: Record<string, number>): Promise<number> {
  let total = 0;

  transactions.forEach((transaction) => {
    const rate = rates[transaction.currency];
    const fee = fees.find((f) => f.currency === transaction.currency)?.feeRate || 0;

    if (rate) {
      let adjustedAmount = transaction.amount;
      // Apply business rule: double the amount if the fee is less than 3%
      if (fee < 3) {
        adjustedAmount *= 2;
      }
      total += adjustedAmount / rate;
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
    const fees = await processFeesCSV('./subTask2.csv');
    const totalInUSD = await calculateTotalInUSD(transactions, fees, rates);

    console.log(`Total amount in USD after applying fees: ${totalInUSD.toFixed(2)}`);
  } catch (error) {
    console.error('Error processing transactions with fees:');
  }
}

main();