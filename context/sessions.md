# Sessions

## 2026-11-27 — Initial build and module refactor

### 1. Built the script
Created `index.js`: a Node script that fetches the top 5 cryptocurrencies by market
cap from CoinGecko and prints a box-drawn table (rank, name + symbol, price, 24h change).

- **No dependencies.** Uses Node's built-in `fetch` (Node 18+; developed on Node 24.15).
- **Endpoint:** `GET https://api.coingecko.com/api/v3/coins/markets`
  with `vs_currency=usd&order=market_cap_desc&per_page=5&page=1&price_change_percentage=24h`.
  The public API is used without a key.
- **Formatting:** prices of $1 or more show 2 decimals, sub-dollar prices show up to 6.
  The 24h change is signed and colored (green up, red down).
- **Color:** only used when stdout is a terminal and `NO_COLOR` is unset. Column widths
  are measured on plain text and color is added after padding, so alignment holds.
- **Errors:** 10 s timeout. Non-2xx responses (with a rate-limit hint for 429),
  timeouts and network failures print `Error: …` to stderr and exit with code 1.

### 2. Refactored into ES modules
Split the single file into focused modules without changing the output and without
adding dependencies.

```
coin-cli/
├── index.js        entry point: CONFIG (currency, limit, timeoutMs), main(), error handling
├── package.json    "type": "module", start script, engines >=18, no dependencies
└── src/
    ├── api.js      fetchTopCoins(): CoinGecko request, mapped to { name, symbol, price, change24h }
    ├── format.js   color helpers, identity, formatPrice(), formatChange()
    └── table.js    renderCoinTable() (coin columns) on top of a generic renderTable()
```

**Check that the output is identical:** ran the old and new scripts side by side with a
fake `fetch` and a frozen clock. Cases covered: normal data (including missing values, a
zero change, very small prices and a long name), an empty list, 429, 500, a timeout and
a network failure. Each case ran with colors on, off, and turned off by `NO_COLOR`.
All 24 combinations matched on stdout, stderr, exit code and the request URL. A live run
against the real API also succeeded.

### Known quirks (kept on purpose, to keep the output identical)
- A tiny positive change that rounds to zero shows as a green `+0.00%`.
- Sub-dollar prices drop trailing zeros (e.g. `$0.99963` instead of `$0.999630`).

### Possible next steps (suggested, not started)
- Command-line arguments for coin count and currency (e.g. `node index.js 10 eur`).
- A market cap column.
- A `--watch` mode that refreshes the table periodically.
- Fixing the two quirks above.
- A test script in the repo (the comparison script lived only in the session scratchpad).
