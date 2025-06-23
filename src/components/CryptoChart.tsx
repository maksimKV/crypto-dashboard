import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { CoinData } from "@/types";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

interface Props {
  data: CoinData[];
}

export const CryptoChart = ({ data }: Props) => {
  const chartData = {
    labels: data.map((coin) => coin.name),
    datasets: [
      {
        label: "Price (USD)",
        data: data.map((coin) => coin.current_price),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};