import {renderHook, act, waitFor} from "@testing-library/react";
import useForm from "./useForm";
import * as validateFieldUtils from "../mewlaConverter/validateFieldUtils";
import {mocked} from "jest-mock";

jest.mock("../mewlaConverter/validateFieldUtils", () => ({
  validateField: jest.fn()
}));

describe("useForm", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const mockedValidateField = mocked(validateFieldUtils.validateField);
    mockedValidateField.mockClear();
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
    const mockedValidateField = mocked(validateFieldUtils.validateField);
    mockedValidateField.mockImplementation(() => "");
    const {result} = renderHook(() =>
      useForm({testField: ""}, {testField: ""})
    );

    act(() => {
      result.current.handleInputChange({
        target: {name: "testField", value: "newValue"}
      });
    });

    // Fast-forward to skip debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.formData).toEqual({testField: "newValue"});
    expect(mockedValidateField).toHaveBeenCalledWith("newValue");
  });

  it("prevents form submission if there are validation errors", async () => {
    const initialState = {testField: ""};
    const initialErrors = {testField: ""};
    const mockedValidateField = mocked(validateFieldUtils.validateField);
    mockedValidateField.mockImplementation((value) =>
      value ? "" : "Field is required"
    );

    const {result} = renderHook(() => useForm(initialState, initialErrors));

    act(() => {
      result.current.handleInputChange({
        target: {name: "testField", value: ""}
      });
    });

    await waitFor(() => {
      expect(result.current.errors.testField).toBe("Field is required");
    });

    let isFormValid;
    act(() => {
      isFormValid = result.current.validateForm();
    });

    expect(isFormValid).toBeFalsy();
    expect(result.current.errors.testField).toBe("Field is required");
  });
});
