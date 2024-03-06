/*
    Validate individual input fields

    Param @maxAllowedAmount: Sets the upper limit for input
    This parameter would be set based on specification
    Otherwise we would use limit of the type (e.g. Number.MAX_SAFE_INTEGER)
*/
export const validateField = (
  value: string,
  maxAllowedAmount: number = 99999
): string => {
  if (value.trim() === "") return `Field is required`;

  const numValue = Number(value);

  if (isNaN(numValue)) return "Please enter a valid number";
  // Some currencies can historically use fractions of smallest denomination, here we assume it's not the case, but otherwise, we would round the number
  if (!Number.isInteger(numValue))
    return "Please make sure the amount is a whole number";
  if (numValue > maxAllowedAmount)
    return `Please make sure the amount doesn't exceed maximum limit of ${maxAllowedAmount}`;
  if (numValue <= 0) return "Please enter an amount greater than zero";

  return "";
};
