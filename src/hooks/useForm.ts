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

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = Object.keys(formData).reduce((acc, key) => {
      const error = validateField(formData[key]);
      acc[key] = error;
      if (error) isValid = false;
      return acc;
    }, {});

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  return {formData, handleInputChange, errors, validateForm};
};

export default useForm;
