import { useEffect, useState } from "react";
import { CryptoChart } from "@/components/CryptoChart";
import { fetchCryptoData } from "@/utils/fetchData";
import { CoinData } from "@/types";

export default function Home() {
  const [data, setData] = useState<CoinData[]>([]);

  useEffect(() => {
    fetchCryptoData().then(setData);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Crypto Dashboard</h1>
      <CryptoChart data={data} />
    </main>
  );
}