import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API route handler for fetching cryptocurrency market data.
 * Acts as a proxy to CoinGecko API to avoid CORS issues on client side.
 * 
 * @param req - Incoming Next.js API request object
 * @param res - Next.js API response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Make a GET request to CoinGecko API for top 10 coins by market cap in USD
  const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 10,
      page: 1,
      sparkline: false, // Do not include sparkline data for simplicity
    },
  });

  // Respond with JSON data received from CoinGecko API
  res.status(200).json(response.data);
}