import {renderHook, act, waitFor} from "@testing-library/react";
import useForm from "./useForm";
import * as validateField from "../utils/validateField";

jest.mock("../utils/validateField");

describe("hooks/useForm", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (validateField.validateField as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("initializes formData and errors correctly", () => {
    const initialState = {testField: ""};
    const initialErrors = {testField: "Initial error"};
    const {result} = renderHook(() => useForm(initialState, initialErrors));

    expect(result.current.formData).toEqual(initialState);
    expect(result.current.errors).toEqual(initialErrors);
  });

  it("updates formData on input change and validates field", async () => {
    const {result} = renderHook(() =>
      useForm({testField: ""}, {testField: ""})
    );

    act(() => {
      result.current.handleInputChange({
        target: {name: "testField", value: "newValue"}
      });

      // Fast-forward to skip debounce
      jest.advanceTimersByTime(200);
    });

    waitFor(() => {
      expect(result.current.formData).toEqual({testField: "newValue"});
      expect(validateField.validateField).toHaveBeenCalledWith("newValue");
    });
  });

  it("prevents form submission if there are validation errors", async () => {
    (validateField.validateField as jest.Mock).mockImplementation((value) =>
      value ? "" : "Field is required"
    );

    const {result} = renderHook(() =>
      useForm({testField: ""}, {testField: ""})
    );

    act(() => {
      result.current.handleInputChange({
        target: {name: "testField", value: ""}
      });
    });

    // Fast-forward to skip debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });

    await act(async () => {
      result.current.validateForm();
    });

    expect(result.current.errors.testField).toBe("Field is required");
  });

  it("clears form-wide errors on input change", async () => {
    const {result} = renderHook(() =>
      useForm({amountCharged: "", amountTendered: ""}, {form: "Error message"})
    );

    act(() => {
      result.current.handleInputChange({
        target: {name: "amountCharged", value: "100"}
      });

      // Fast-forward to skip debounce
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => expect(result.current.errors.form).toBe(""));
  });
});
