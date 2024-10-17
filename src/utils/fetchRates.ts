import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export async function fetchConversionRates() {
  try {
    const response = await axios.get(`${process.env.API_URL}`, {
      params: {
        app_id: process.env.APP_ID,
      },
    });
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching conversion rates:', error);
    throw error;
  }
}