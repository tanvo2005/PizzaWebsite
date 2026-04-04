export const SHIPPING_FEE = 40000;

export const toNumber = (value) => {
  const parsedValue = Number.parseFloat(value || 0);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const formatCurrency = (value) => (
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(toNumber(value))
);
