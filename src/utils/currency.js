// Currency conversion utility
const USD_TO_INR_RATE = 83;

export const convertToINR = (usdAmount) => {
  return usdAmount * USD_TO_INR_RATE;
};

export const formatINR = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPrice = (usdPrice) => {
  const inrPrice = convertToINR(usdPrice);
  return formatINR(inrPrice);
};