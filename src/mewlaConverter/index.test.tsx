import React from "react";
import "@testing-library/jest-dom";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MewlaConverter from "./index";
import useForm from "../hooks/useForm";
import useCatFacts from "../hooks/useCatFacts";

jest.mock("../hooks/useForm", () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock("../hooks/useCatFacts", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("MewlaConverter", () => {
  beforeEach(() => {
    (useForm as jest.Mock).mockImplementation(() => ({
      formData: {amountCharged: "", amountTendered: ""},
      handleInputChange: jest.fn(),
      errors: {},
      validateForm: jest.fn()
    }));

    (useCatFacts as jest.Mock).mockReturnValue({
      fact: "A fun cat fact",
      isLoading: false
    });
  });

  it("calculates and displays change correctly for valid input", async () => {
    const validateFormMock = jest.fn().mockReturnValue(true);
    (useForm as jest.Mock).mockImplementation(() => ({
      formData: {amountCharged: "10", amountTendered: "15"},
      handleInputChange: jest.fn(),
      errors: {},
      validateForm: validateFormMock
    }));

    render(<MewlaConverter />);

    userEvent.type(screen.getByLabelText(/We need/i), "10");
    userEvent.type(screen.getByLabelText(/You pay/i), "15");
    userEvent.click(screen.getByText(/Calculate Change/i));

    await waitFor(() => {
      expect(screen.getByText("Customer change")).toBeInTheDocument();
    });
  });

  it("shows an error message for invalid input", async () => {
    const validateFormMock = jest.fn().mockReturnValue(false);
    (useForm as jest.Mock).mockImplementation(() => ({
      formData: {amountCharged: "10", amountTendered: "5"},
      handleInputChange: jest.fn(),
      errors: {
        form: "The amount paid must be equal to or greater than the amount charged."
      },
      validateForm: validateFormMock
    }));

    render(<MewlaConverter />);

    userEvent.type(screen.getByLabelText(/We need/i), "10");
    userEvent.type(screen.getByLabelText(/You pay/i), "5");
    userEvent.click(screen.getByText(/Calculate Change/i));

    expect(
      screen.getByText(
        "The amount paid must be equal to or greater than the amount charged."
      )
    ).toBeInTheDocument();
  });
});
