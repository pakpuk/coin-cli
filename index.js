#!/usr/bin/env node

/**
 * Fetches the top cryptocurrencies by market cap from CoinGecko
 * and prints them as a table: name, current price, 24h change.
 *
 * Usage: node index.js
 * Requires Node 18+ (built-in fetch).
 */

import { fetchTopCoins } from './src/api.js';
import { renderCoinTable } from './src/table.js';

const CONFIG = {
  currency: 'usd',
  limit: 5,
  timeoutMs: 10_000,
};

async function main() {
  try {
    const coins = await fetchTopCoins(CONFIG);
    const currency = CONFIG.currency.toUpperCase();

    console.log(`\nTop ${coins.length} cryptocurrencies by market cap (${currency})\n`);
    console.log(renderCoinTable(coins, CONFIG.currency));
    console.log(`\nUpdated: ${new Date().toLocaleString()} · Data: CoinGecko\n`);
  } catch (error) {
    const message = error.name === 'TimeoutError' ? 'Request to CoinGecko timed out.' : error.message;
    console.error(`Error: ${message}`);
    process.exitCode = 1;
  }
}

main();
