import React, {ChangeEvent} from "react";
import ErrorMessage from "./ErrorMessage";

interface FormInputProps {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  label: string;
  errorMessage: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  id,
  name,
  value,
  placeholder,
  label,
  errorMessage,
  onChange
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        aria-required="true"
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        aria-invalid={!!errorMessage}
      />
      {errorMessage && (
        <ErrorMessage id={`${id}-error`} message={errorMessage} />
      )}
    </div>
  );
};

export default FormInput;
