/**
 * Formats a number into Indian Rupee (INR) representation with correct Indian comma separation
 * e.g., 84650 -> ₹84,650, 100000 -> ₹1,00,000
 */
export const formatINR = (amount, includeSymbol = true, decimalPlaces = 0) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return includeSymbol ? '₹0' : '0';
  }

  const num = Number(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
  }).format(num);

  return includeSymbol ? `₹${formatted}` : formatted;
};

export const formatCurrency = (amount) => formatINR(amount, true, 0);

export const formatCompactINR = (amount) => {
  if (!amount || isNaN(Number(amount))) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return formatINR(num);
};

export default formatCurrency;
