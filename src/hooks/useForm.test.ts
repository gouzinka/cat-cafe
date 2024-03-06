import {renderHook, act, waitFor} from "@testing-library/react";
import useForm from "./useForm";
import * as validateFieldUtils from "../mewlaConverter/validateFieldUtils";

jest.mock("../mewlaConverter/validateFieldUtils");

describe('useForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (validateFieldUtils.validateField as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes formData and errors correctly', () => {
    const initialState = { testField: '' };
    const initialErrors = { testField: 'Initial error' };
    const { result } = renderHook(() => useForm(initialState, initialErrors));

    expect(result.current.formData).toEqual(initialState);
    expect(result.current.errors).toEqual(initialErrors);
  });

  it('updates formData on input change and validates field', async () => {
    const { result } = renderHook(() =>
      useForm({ testField: '' }, { testField: '' })
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: 'testField', value: 'newValue' }
      });

      // Fast-forward to skip debounce
      jest.advanceTimersByTime(200);
    });

    waitFor(() => {
      expect(result.current.formData).toEqual({ testField: 'newValue' });
      expect(validateFieldUtils.validateField).toHaveBeenCalledWith('newValue');
    });
  });

  it('prevents form submission if there are validation errors', async () => {
    (validateFieldUtils.validateField as jest.Mock).mockImplementation((value) =>
      value ? '' : 'Field is required'
    );

    const { result } = renderHook(() =>
      useForm({ testField: '' }, { testField: '' })
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: 'testField', value: '' },
      });
    });

    // Fast-forward to skip debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });

    await act(async () => {
      result.current.validateForm();
    });

    expect(result.current.errors.testField).toBe('Field is required');
  });
});
