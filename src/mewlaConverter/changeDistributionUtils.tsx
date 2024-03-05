/*
    Calculate change distribution

    Returns each denomination (key) and its count (val)
    { 100: 1, 33: 1, 21: 1, 7: 1, 3: 1, 1: 1 }
*/
export const calculateChangeDistribution = (
  amountCharged: number,
  amountTendered: number
): Record<number, number> => {
  // Since I have a validation in place in my form component, this is a bit redundant defensive validation
  if (amountCharged < 0 || amountTendered < 0) {
    throw new Error("Amounts cannot be negative");
  }

  let changeDue = amountTendered - amountCharged;
  const denominations = [100, 33, 21, 7, 3, 1];

  return denominations.reduce(
    (acc, denomination) => {
      const coinCount = Math.floor(changeDue / denomination);
      acc[denomination] = coinCount;
      changeDue -= coinCount * denomination;
      return acc;
    },
    {} as Record<number, number>
  );
};
