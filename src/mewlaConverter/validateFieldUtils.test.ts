import {validateField} from "./validateFieldUtils";

describe("validateField", () => {
  const maxAllowedAmount = 999;

  test('returns "Field is required" for empty value', () => {
    const result = validateField("");
    expect(result).toBe("Field is required");
  });

  test('returns "Please enter a valid number" for non-numeric value', () => {
    const result = validateField("abc");
    expect(result).toBe("Please enter a valid number");
  });

  test('returns "Please make sure the amount is a whole number" for non-integer value', () => {
    const result = validateField("99.99");
    expect(result).toBe("Please make sure the amount is a whole number");
  });

  test('returns "Please make sure the amount doesn\'t exceed maximum limit of 999" for value exceeding maxAllowedAmount', () => {
    const result = validateField("1000", maxAllowedAmount);
    expect(result).toBe(
      `Please make sure the amount doesn't exceed maximum limit of ${maxAllowedAmount}`
    );
  });

  test('returns "Please enter an amount greater than zero" for value less than or equal to 0', () => {
    const result = validateField("-1");
    expect(result).toBe("Please enter an amount greater than zero");
    const resultZero = validateField("0");
    expect(resultZero).toBe("Please enter an amount greater than zero");
  });

  test("returns an empty string for a valid value", () => {
    const result = validateField("500");
    expect(result).toBe("");
  });
});
