/*
    Calculate change distribution

    Returns each denomination (key) and its count (val)
    {1: 1, 3: 1, 7: 1, 21: 1, 33: 1, 100: 1}
*/
export const calculateChangeDistribution = (
  amountCharged: number,
  amountTendered: number
): Record<number, number> => {
  // Since I have a validation in place in my form component, this is a bit redundant defensive validation
  if (amountCharged < 0 || amountTendered < 0) {
    console.error("Amount cannot be negative");
    return {};
  }

  let changeDue = amountTendered - amountCharged;
  // It's important to keep order from highest to smallest to minimize notes to make up change
  // Denominations don't change very often, but if needed, we could add sort, which would be a small computational step
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
