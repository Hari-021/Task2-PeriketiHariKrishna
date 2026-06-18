/**
 * Formats a numeric value as a currency string.
 * Supports multi-currency representation.
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The ISO 4217 currency code (e.g. 'USD', 'EUR', 'GBP')
 * @returns {string} Formatted currency text
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Normalizes multi-currency values to a base currency (USD) for chart aggregation
 * (Using static conversion rates for demonstration purposes)
 */
export const convertToUSD = (amount, currencyFrom) => {
  const num = Number(amount) || 0;
  const rates = {
    USD: 1.0,
    EUR: 1.08,
    GBP: 1.27,
    JPY: 0.0064,
    CAD: 0.73,
    INR: 0.012
  };
  const rate = rates[currencyFrom] || 1.0;
  return num * rate;
};
