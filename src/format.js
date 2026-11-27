/**
 * Text formatting helpers: ANSI colors, prices and percentage changes.
 */

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

const ansi = (code) => (text) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);

export const identity = (text) => text;

export const color = {
  green: ansi(32),
  red: ansi(31),
  bold: ansi(1),
};

/**
 * Formats a price as currency. Sub-dollar values get extra precision
 * so they don't all read "$0.00".
 */
export function formatPrice(value, currency) {
  if (value == null) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value);
}

/**
 * Formats a percentage change as a table cell: signed text plus a
 * `paint` function that colors it green (up) or red (down).
 *
 * @returns {{ text: string, paint: (text: string) => string }}
 */
export function formatChange(value) {
  if (value == null) return { text: 'N/A', paint: identity };

  const sign = value > 0 ? '+' : '';
  const text = `${sign}${value.toFixed(2)}%`;
  const paint = value > 0 ? color.green : value < 0 ? color.red : identity;

  return { text, paint };
}
