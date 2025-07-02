# Crypto Dashboard

Visualize cryptocurrency prices, volumes, and market share with interactive charts.

[Live Demo](https://crypto-dashboard-jyxj.onrender.com/)  
[GitHub Repository](https://github.com/maksimKV/crypto-dashboard)

---

## Overview

Crypto Dashboard is a real-time web application built with Next.js and TypeScript, leveraging the CoinGecko API to provide users with up-to-date cryptocurrency prices, market capitalization, volume, and trends. The dashboard features interactive charts and supports multiple fiat currencies for a global audience.

---

## Features

- 📈 **Line, Bar, Pie, and Radar Charts** for visualizing price, volume, and market share
- 🔍 **Coin Selector** to choose and compare different cryptocurrencies
- 💱 **Currency Selector** for viewing prices in various fiat currencies
- 🛡️ **Error Boundaries** and robust error handling
- ⚡ **Caching & Rate Limiting** for efficient API usage
- 🌐 **Responsive Design** with Tailwind CSS
- 🧪 **Comprehensive Unit & Integration Tests** (Jest + React Testing Library)

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React, SSR)
- **Language:** TypeScript
- **Charts:** [Chart.js](https://www.chartjs.org/) via [react-chartjs-2](https://react-chartjs-2.js.org/)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **API:** [CoinGecko API](https://www.coingecko.com/en/api)
- **Testing:** Jest, React Testing Library

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/maksimKV/crypto-dashboard.git
cd crypto-dashboard

# Install dependencies
npm install
# or
yarn install
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
npm test
# or
yarn test
```

---

## Project Structure

```
crypto-dashboard/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Next.js pages (API routes & UI)
│   ├── store/           # Redux slices and selectors
│   ├── styles/          # Tailwind/global CSS
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── __tests__/           # Unit & integration tests
├── public/              # Static assets
├── ...
```

---

## Disclaimer

> **Note:** This app is hosted on Render's free tier. Free web services on Render [spin down after 15 minutes of inactivity and may take up to a minute to start up again when you visit the site](https://render.com/docs/free). If the app takes a while to load, please be patient while the server wakes up. This is expected behavior for free-tier deployments. [[source](https://render.com/docs/faq)]

---

## Credits

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Chart.js](https://www.chartjs.org/) and [react-chartjs-2](https://react-chartjs-2.js.org/) for charting
- [Render](https://render.com/) for hosting

---

## Contact

For questions or feedback, please open an issue on the [GitHub repository](https://github.com/maksimKV/crypto-dashboard).
