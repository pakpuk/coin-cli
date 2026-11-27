#!/usr/bin/env node

/**
 * Fetches the top cryptocurrencies by market cap from CoinGecko
 * and prints them as a table: name, current price, 24h change.
 *
 * Usage: node index.js [count]
 *   count  Number of coins to show (1–250, default 5).
 * Requires Node 18+ (built-in fetch).
 */

import { fetchTopCoins } from './src/api.js';
import { renderCoinTable } from './src/table.js';

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 250; // CoinGecko's maximum per_page value.

const CONFIG = {
  currency: 'usd',
  limit: DEFAULT_LIMIT,
  timeoutMs: 10_000,
};

/**
 * Parses the optional coin count argument.
 * Returns the default when it is absent; throws on anything that isn't 1–MAX_LIMIT.
 */
function parseLimit(arg) {
  if (arg === undefined) return DEFAULT_LIMIT;
  if (!/^\d+$/.test(arg) || Number(arg) < 1 || Number(arg) > MAX_LIMIT) {
    throw new Error(`Invalid count "${arg}": expected a whole number from 1 to ${MAX_LIMIT}.\nUsage: node index.js [count]`);
  }
  return Number(arg);
}

async function main() {
  try {
    CONFIG.limit = parseLimit(process.argv[2]);
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
