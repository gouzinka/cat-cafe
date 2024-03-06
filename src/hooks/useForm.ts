import {useState, useCallback} from "react";
import {debounce} from "lodash";
import {validateField} from "../mewlaConverter/validateFieldUtils";

const useForm = (initialState, initialErrors, debounceMs = 200) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  const handleInputChange = useCallback(
    (event) => {
      const {name, value} = event.target;
      setFormData((currentFormData) => ({...currentFormData, [name]: value}));

      debounce((name, value) => {
        const error = validateField(value);
        setErrors((currentErrors) => ({...currentErrors, [name]: error}));
      }, debounceMs)(name, value);
    },
    [debounceMs]
  );

  const validateForm = useCallback((): boolean => {
    let isValid = true;

    let newErrors = Object.keys(formData).reduce((acc, key) => {
      const error = validateField(formData[key]);
      acc[key] = error;
      if (error) isValid = false;
      return acc;
    }, {});

    // Perform cross-field validation (only if individual fields have no errors)
    if (isValid) {
      const amountChargedNum = Number(formData.amountCharged);
      const amountTenderedNum = Number(formData.amountTendered);

      if (amountTenderedNum < amountChargedNum) {
        isValid = false;
        newErrors = {
          ...newErrors,
          form: "The amount paid must be equal to or greater than the amount charged."
        };
      }
    }

    setErrors(newErrors);

    return isValid;
  }, [formData]);

  return {formData, handleInputChange, errors, validateForm};
};

export default useForm;
