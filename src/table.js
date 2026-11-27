/**
 * Box-drawn table rendering.
 */

import { color, formatChange, formatPrice, identity } from './format.js';

const COIN_COLUMNS = [
  { header: '#', align: 'right' },
  { header: 'Name', align: 'left' },
  { header: 'Price', align: 'right' },
  { header: '24h Change', align: 'right' },
];

/**
 * Renders a list of coins as a table: rank, name, price, 24h change.
 *
 * @param {import('./api.js').Coin[]} coins
 * @param {string} currency
 * @returns {string}
 */
export function renderCoinTable(coins, currency) {
  const rows = coins.map((coin, index) => [
    { text: String(index + 1) },
    { text: `${coin.name} (${coin.symbol})` },
    { text: formatPrice(coin.price, currency) },
    formatChange(coin.change24h),
  ]);

  return renderTable(COIN_COLUMNS, rows);
}

/**
 * Renders a generic box-drawn table.
 *
 * Each cell is `{ text, paint? }`. Column widths are measured on the plain
 * text, and `paint` (e.g. an ANSI color) is applied after padding so that
 * escape codes don't break alignment.
 *
 * @param {{ header: string, align: 'left' | 'right' }[]} columns
 * @param {{ text: string, paint?: (text: string) => string }[][]} rows
 * @returns {string}
 */
export function renderTable(columns, rows) {
  const widths = columns.map((col, i) =>
    Math.max(col.header.length, ...rows.map((row) => row[i].text.length)),
  );

  const border = (left, mid, right) =>
    left + widths.map((w) => '─'.repeat(w + 2)).join(mid) + right;

  const row = (cells) =>
    '│' +
    cells
      .map(({ text, paint = identity }, i) => ` ${paint(pad(text, widths[i], columns[i].align))} `)
      .join('│') +
    '│';

  const header = row(columns.map((col) => ({ text: col.header, paint: color.bold })));

  return [
    border('┌', '┬', '┐'),
    header,
    border('├', '┼', '┤'),
    ...rows.map(row),
    border('└', '┴', '┘'),
  ].join('\n');
}

function pad(text, width, align) {
  return align === 'right' ? text.padStart(width) : text.padEnd(width);
}
