# Crypto Dashboard

[![GitHub Repo](https://img.shields.io/badge/GitHub-crypto--dashboard-blue?logo=github)](https://github.com/maksimKV/crypto-dashboard)

A real-time cryptocurrency dashboard built with **Next.js**, **TypeScript**, **Redux Toolkit**, and **Chart.js**.  
Track prices, market cap, volume, and trends for top cryptocurrencies, with beautiful interactive charts and multi-currency support.

---

## 🚀 Features

- **Live Crypto Data:**  
  Fetches real-time data from the CoinGecko API.
- **Multiple Currencies:**  
  Supports USD ($), EUR (€), BGN (лв), CHF (Fr.), AED (د.إ), SAR (ر.س), and GBP (£).
- **Interactive Charts:**  
  Line, Bar, Pie, and Radar charts for price, volume, and market cap trends.
- **Pagination & Filtering:**  
  Easily browse and select coins, with pagination for large lists.
- **Robust Error Handling:**  
  Graceful UI for API/network errors.
- **Distributed Rate Limiting:**  
  Uses Redis (if configured) or in-memory fallback to prevent abuse.
- **Server-Side Rendering:**  
  Fast initial load and SEO-friendly.
- **TypeScript & Linting:**  
  Fully typed, with strict linting and formatting.
- **Comprehensive Testing:**  
  Unit and integration tests for all major features.

---

## 🛠️ Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/maksimKV/crypto-dashboard.git
cd crypto-dashboard
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Environment Variables**

Create a `.env.local` file in the root directory.  
The following variables are supported:

```env
# (Optional) Custom CoinGecko API base URL
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3

# (Optional, for distributed rate limiting)
REDIS_URL=redis://localhost:6379
```

> **Note:**  
> - If `REDIS_URL` is not set, rate limiting will use an in-memory fallback (suitable for local/dev only).
> - `.env*` files are gitignored by default.

### 4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

### **Recommended: Deploy to Vercel**

[Vercel](https://vercel.com/) is the easiest way to deploy Next.js apps. After pushing your code to GitHub:

1. Go to [vercel.com/import](https://vercel.com/import) and import your repo.
2. Set any required environment variables (`COINGECKO_API_BASE_URL`, `REDIS_URL`) in the Vercel dashboard.
3. Click **Deploy**.

Your app will be live at `https://your-project-name.vercel.app`.

### **Other Node.js Hosts**
- You can deploy to any Node.js-compatible host (e.g., Netlify, AWS, DigitalOcean).
- Make sure to set the same environment variables in your host's dashboard.
- Run `npm run build` and `npm start` for production.

---

## 🧪 Running Tests

- **All tests:**  
  `npm test`
- **Unit tests:**  
  `npm run test:unit`
- **Integration tests:**  
  `npm run test:integration`
- **Test coverage:**  
  `npm run test:coverage`

---

## 📊 Supported Currencies

| Code | Symbol | Name                |
|------|--------|---------------------|
| USD  | $      | US Dollar           |
| EUR  | €      | Euro                |
| BGN  | лв     | Bulgarian Lev       |
| CHF  | Fr.    | Swiss Franc         |
| AED  | د.إ    | UAE Dirham          |
| SAR  | ر.س    | Saudi Riyal         |
| GBP  | £      | British Pound       |

---

## 📝 API Endpoints

All data is fetched via the internal API route:  
`/api/cryptoApi`

**Query parameters:**
- `currency` (string): One of the supported currency codes (default: `usd`)
- `coinId` (string): CoinGecko coin ID (e.g., `bitcoin`)
- `topMarketCaps` (boolean): If true, returns top 5 coins by market cap

**Examples:**
- `/api/cryptoApi?currency=eur`
- `/api/cryptoApi?coinId=bitcoin&currency=usd`
- `/api/cryptoApi?topMarketCaps=true&currency=gbp`

---

## ⚡ Rate Limiting

- **Default:** 10 requests per minute per IP (in-memory, for local/dev)
- **Production:** Set `REDIS_URL` for distributed rate limiting

---

## 🎨 Styling

- Uses [Tailwind CSS](https://tailwindcss.com/) for rapid, modern UI development.
- Customize styles in `src/styles/globals.css` and `tailwind.config.js`.

---

## 🧩 Tech Stack

- **Next.js** (React, SSR, API routes)
- **Redux Toolkit** (state management)
- **Chart.js** & **react-chartjs-2** (charts)
- **TypeScript** (type safety)
- **Jest** & **Testing Library** (testing)
- **Tailwind CSS** (styling)
- **ioredis** (optional, for rate limiting)
- **CoinGecko API** (crypto data)

---

## 📂 Project Structure

```
src/
  components/      # Reusable UI components
  pages/           # Next.js pages & API routes
  store/           # Redux state management
  styles/          # Tailwind/global CSS
  types/           # TypeScript types/interfaces
  utils/           # Utilities (API, cache, rate limiter, etc.)
__tests__/         # Unit and integration tests
```

---

## 🛡️ Security & Best Practices

- **Secrets:** Never commit API keys or secrets. Use `.env.local`.
- **Rate limiting:** Protects against abuse.
- **Error handling:** No sensitive data is exposed to users.
- **Tests:** All major features are covered by tests.

---

## 📄 License

> _Add your license here (MIT, Apache, etc.)_

---

## 🙏 Acknowledgements

- [CoinGecko API](https://www.coingecko.com/en/api)
- [Next.js](https://nextjs.org/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---
