import React, {useCallback, useState} from "react";
import useForm from "../hooks/useForm";
import ChangeOwed from "../ChangeOwed";
import FormInput from "../common/FormInput";
import ErrorMessage from "../common/ErrorMessage";
import {calculateChangeDistribution} from "./changeDistributionUtils";

const MewlaConverter = () => {
  const initialState = {amountCharged: "", amountTendered: ""};
  const initialErrors = {amountCharged: "", amountTendered: "", form: ""};
  const {formData, handleInputChange, errors, validateForm} = useForm(
    initialState,
    initialErrors
  );
  const [change, setChange] = useState({});

  const calculateChange = useCallback(
    (event) => {
      event.preventDefault();
      if (validateForm()) {
        const amountChargedNum = Number(formData.amountCharged);
        const amountTenderedNum = Number(formData.amountTendered);
        setChange(
          calculateChangeDistribution(amountChargedNum, amountTenderedNum)
        );
      }
    },
    [formData, validateForm]
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
            placeholder="We need"
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
            placeholder="You pay"
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
          <ChangeOwed change={change} />
        )}
      </div>
    </div>
  );
};

export default MewlaConverter;
