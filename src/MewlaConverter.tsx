import React, {useCallback, useRef, useState} from "react";
import useForm from "./hooks/useForm";
import ChangeOwed from "./ChangeOwed";
import FormInput from "./common/FormInput";
import ErrorMessage from "./common/ErrorMessage";
import {calculateChangeDistribution} from "./utils/changeDistribution";

const MewlaConverter = () => {
  const initialState = {amountCharged: "", amountTendered: ""};
  const initialErrors = {amountCharged: "", amountTendered: "", form: ""};
  const {formData, handleInputChange, errors, validateForm} = useForm(
    initialState,
    initialErrors
  );
  const [change, setChange] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const calculatedChange = useRef({charged: null, tendered: null, result: {}});

  const calculateChange = useCallback(
    (event) => {
      event.preventDefault();
      const isFormValid = validateForm();

      if (isFormValid) {
        const charged = Number(formData.amountCharged);
        const tendered = Number(formData.amountTendered);

        // Calculate change and memoize result
        if (
          charged === calculatedChange.current.charged &&
          tendered === calculatedChange.current.tendered
        ) {
          setChange(calculatedChange.current.result);
        } else {
          const newChange = calculateChangeDistribution(charged, tendered);
          setChange(newChange);
          calculatedChange.current = {charged, tendered, result: newChange};
        }

        // Re-fetch the fact even when amounts don't change and condition is met
        setFetchTrigger((t) => !t);
      } else {
        setChange({});
      }
    },
    [formData.amountCharged, formData.amountTendered, validateForm]
  );

  return (
    <div>
      <form
        id="cash-calculator"
        onSubmit={calculateChange}
        aria-describedby={errors.form ? "form-error" : undefined}
      >
        <div className="cash-line">
          <FormInput
            id="amountCharged"
            name="amountCharged"
            value={formData.amountCharged}
            label="We need"
            errorMessage={errors.amountCharged}
            onChange={handleInputChange}
          />
        </div>

        <div className="cash-line">
          <FormInput
            id="amountTendered"
            name="amountTendered"
            value={formData.amountTendered}
            label="You pay"
            errorMessage={errors.amountTendered}
            onChange={handleInputChange}
          />
        </div>

        {errors.form && <ErrorMessage id="form-error" message={errors.form} />}

        <button id="calculate" type="submit">
          Calculate Change
        </button>
      </form>

      <div id="results">
        {change && Object.keys(change).length > 0 && (
          <ChangeOwed change={change} fetchTrigger={fetchTrigger} />
        )}
      </div>
    </div>
  );
};

export default MewlaConverter;
