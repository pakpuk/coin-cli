/**
 * CoinGecko API client.
 */

const MARKETS_URL = 'https://api.coingecko.com/api/v3/coins/markets';

/**
 * @typedef {object} Coin
 * @property {string} name
 * @property {string} symbol      Upper-cased ticker, e.g. "BTC".
 * @property {number|null} price  Current price in the requested currency.
 * @property {number|null} change24h  24h price change, in percent.
 */

/**
 * Fetches the top coins by market cap.
 *
 * @param {object} options
 * @param {string} options.currency   Quote currency, e.g. "usd".
 * @param {number} options.limit      Number of coins to return.
 * @param {number} options.timeoutMs  Abort the request after this long.
 * @returns {Promise<Coin[]>}
 */
export async function fetchTopCoins({ currency, limit, timeoutMs }) {
  const params = new URLSearchParams({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: String(limit),
    page: '1',
    price_change_percentage: '24h',
  });

  const response = await fetch(`${MARKETS_URL}?${params}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const hint = response.status === 429 ? ' (rate limited — try again in a minute)' : '';
    throw new Error(`CoinGecko responded with ${response.status} ${response.statusText}${hint}`);
  }

  const coins = await response.json();
  return coins.map(toCoin);
}

function toCoin(raw) {
  return {
    name: raw.name,
    symbol: raw.symbol.toUpperCase(),
    price: raw.current_price,
    change24h: raw.price_change_percentage_24h,
  };
}
