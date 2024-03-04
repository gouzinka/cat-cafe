import React, {useCallback, useState, ChangeEvent, FormEvent} from "react";
import {debounce} from "lodash";
import ChangeOwed from "./ChangeOwed";
import FormInput from "./common/FormInput";
import ErrorMessage from "./common/ErrorMessage";

function MewlaConverter() {
  const [change, setChange] = useState({});
  const [formData, setFormData] = useState({
    amountCharged: "",
    amountTendered: "",
    errors: {}
  });
  const DEBOUNCE_TIME_MS = 200;
  // Set the upper limit for input
  // This would be set based on spec, if not, we use Number.MAX_SAFE_INTEGER, but it would challenge the UI display
  const MAX_ALLOWED_AMOUNT = 99999;

  function updateFormData(updateType, name, value) {
    setFormData((prevState) => {
      const newState = {...prevState};

      if (updateType === "input") {
        newState[name] = value;
      } else if (updateType === "error") {
        newState.errors = {...prevState.errors, [name]: value};
      }

      return newState;
    });
  }

  // Validate individual fields
  const validateField = useCallback((name: string, value: string): string => {
    if (value.trim() === "") return `Field is required`;

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }

    if (!Number.isInteger(numValue)) {
      return "Please make sure the amount is a whole number";
    }

    if (numValue > MAX_ALLOWED_AMOUNT) {
      return `Please make sure the amount doesn't exceed maximum limit of ${MAX_ALLOWED_AMOUNT}`;
    }

    if (numValue <= 0) {
      return "Please enter an amount greater than zero";
    }

    return "";
  }, []);

  // Debounce field validation to avoid excessive computations
  const debouncedValidateField = useCallback(
    debounce((name: string, value: string) => {
      const error = validateField(name, value);
      updateFormData("error", name, error);
    }, DEBOUNCE_TIME_MS),
    [validateField]
  );

  // Handle real-time input changes, updates state, and triggers debounced validation
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = event.target;
      updateFormData("input", name, value);
      debouncedValidateField(name, value);
    },
    [debouncedValidateField]
  );

  // Validate the entire form before submission
  const validateForm = useCallback(() => {
    let newErrors = {...formData.errors};

    // Reset any existing error messages to ensure fresh validation
    Object.keys(newErrors).forEach((key) => {
      newErrors[key] = "";
    });

    let fieldHasError = false;
    ["amountCharged", "amountTendered"].forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) fieldHasError = true;
    });

    // Perform cross-field validation only if individual fields have no errors
    if (!fieldHasError) {
      const amountChargedNum = Number(formData.amountCharged);
      const amountTenderedNum = Number(formData.amountTendered);

      if (amountTenderedNum < amountChargedNum) {
        newErrors.amountTendered =
          "The amount paid must be equal to or greater than the amount charged.";
      }
    }

    setFormData((prevState) => ({...prevState, errors: newErrors}));
  }, [formData, validateField]);

  const calculateChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      validateForm();

      if (
        Object.keys(formData.errors).every((key) => formData.errors[key] === "")
      ) {
        // todo
      }
    },
    [validateForm, formData.errors]
  );

  return (
    <div>
      <form
        id="cash-calculator"
        onSubmit={calculateChange}
        aria-describedby={formData.errors.form ? "form-error" : undefined}
      >
        <div className="cash-line">
          <FormInput
            id="amountCharged"
            name="amountCharged"
            value={formData.amountCharged}
            placeholder="We need"
            label="We need"
            errorMessage={formData.errors.amountCharged}
            onChange={handleInputChange}
          />
        </div>

        <div className="cash-line">
          <FormInput
            id="amountTendered"
            name="amountTendered"
            value={formData.amountTendered}
            placeholder="You pay"
            label="You pay"
            errorMessage={formData.errors.amountTendered}
            onChange={handleInputChange}
          />
        </div>

        {formData.errors.form && (
          <ErrorMessage id="form-error" message={formData.errors.form} />
        )}

        <button id="calculate" type="submit">
          Calculate Change
        </button>
      </form>

      <div id="results">
        <ChangeOwed change={change} />
      </div>
    </div>
  );
}

export default MewlaConverter;
