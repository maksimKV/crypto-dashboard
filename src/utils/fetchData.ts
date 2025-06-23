import axios from "axios";
import { CoinData } from "@/types";

export async function fetchCryptoData(): Promise<CoinData[]> {
  const res = await axios.get("/api/prices");
  return res.data;
}