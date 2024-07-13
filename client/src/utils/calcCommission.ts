const calculateHostServiceFee = (subtotal: number) => {
  const hostServiceFeeRate = 0.03; // 3%
  return subtotal * hostServiceFeeRate;
};

const calculateGuestServiceFee = (subtotal: number) => {
  const lowTotalsRate = 0.2;
  const midTotalsRate = 0.15;
  const highTotalsRate = 0.1;

  const lowTotalCeiling = 250;
  const midTotalCeiling = 750;
  let guestServiceFeeRate;

  if (subtotal < lowTotalCeiling) {
    guestServiceFeeRate = lowTotalsRate;
  } else if (subtotal >= lowTotalCeiling && subtotal < midTotalCeiling) {
    guestServiceFeeRate = midTotalsRate;
  } else {
    guestServiceFeeRate = highTotalsRate;
  }

  return subtotal * guestServiceFeeRate;
};

const calculateServiceFees = (
  reservatino_cost: number,
  cleaningFee: number,
  additionalGuestFees: number
) => {
  const subtotal = reservatino_cost + cleaningFee + additionalGuestFees;

  const hostServiceFee = calculateHostServiceFee(subtotal);
  const guestServiceFee = calculateGuestServiceFee(subtotal);

  return {
    subtotal,
    hostServiceFee,
    guestServiceFee,
    total: subtotal + guestServiceFee
  };
};

export default calculateServiceFees;
