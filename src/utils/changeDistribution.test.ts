import {calculateChangeDistribution} from "./changeDistribution";

describe("utils/calculateChangeDistribution", () => {
  test("correctly calculates effective distribution", () => {
    const charged = 835;
    const tendered = 1000;
    const expectedDistribution = {100: 1, 33: 1, 21: 1, 7: 1, 3: 1, 1: 1};

    const distribution = calculateChangeDistribution(charged, tendered);

    expect(distribution).toEqual(expectedDistribution);
  });

  test("returns empty distribution for exact payment", () => {
    const charged = 1000;
    const tendered = 1000;
    const expectedDistribution = {100: 0, 33: 0, 21: 0, 7: 0, 3: 0, 1: 0};

    const distribution = calculateChangeDistribution(charged, tendered);

    expect(distribution).toEqual(expectedDistribution);
  });

  test("handles large differences correctly", () => {
    const charged = 50;
    const tendered = 10000;
    const expectedDistribution = {100: 99, 33: 1, 21: 0, 7: 2, 3: 1, 1: 0};

    const distribution = calculateChangeDistribution(charged, tendered);

    expect(distribution).toEqual(expectedDistribution);
  });

  test("handles non-standard amounts correctly", () => {
    const charged = 830;
    const tendered = 1000;
    const expectedDistribution = {100: 1, 33: 2, 21: 0, 7: 0, 3: 1, 1: 1};

    const distribution = calculateChangeDistribution(charged, tendered);

    expect(distribution).toEqual(expectedDistribution);
  });

  test("throws error for negative amounts", () => {
    const charged = -100;
    const tendered = 1000;

    expect(() => calculateChangeDistribution(charged, tendered)).toThrow(
      "Amounts cannot be negative"
    );
  });
});
