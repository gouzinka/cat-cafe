import useCatFacts from "./hooks/useCatFacts";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import ChangeOwed from "./ChangeOwed";

jest.mock("./hooks/useCatFacts", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("ChangeOwed", () => {
  it("displays a cat fact when no change is due", async () => {
    (useCatFacts as jest.Mock).mockReturnValue({
      fact: "Cats are great!",
      isLoading: false
    });

    const change = {100: 0, 33: 0, 21: 0, 7: 0, 3: 0, 1: 0};
    const submitCount = 1;
    render(<ChangeOwed change={change} submitCount={submitCount} />);

    expect(screen.getByText("You paid the exact amount!")).toBeInTheDocument();
    expect(screen.getByText("Cats are great!")).toBeInTheDocument();
  });

  it("shows loading spinner while fetching a cat fact", () => {
    (useCatFacts as jest.Mock).mockReturnValue({fact: null, isLoading: true});

    const change = {100: 0, 33: 0, 21: 0, 7: 0, 3: 0, 1: 0};
    const submitCount = 1;
    render(<ChangeOwed change={change} submitCount={submitCount} />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
});
