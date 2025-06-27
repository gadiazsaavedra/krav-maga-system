import { useState } from 'react';
import * as yup from 'yup';

interface UseFormValidationProps<T extends Record<string, any>> {
  schema: yup.ObjectSchema<any>;
  initialValues: T;
}

export function useFormValidation<T extends Record<string, any>>({ schema, initialValues }: UseFormValidationProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = async (field: keyof T, value: any) => {
    try {
      await schema.validateAt(field as string, { ...values, [field]: value });
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, [field]: (error as yup.ValidationError).message }));
      }
      return false;
    }
  };

  const validateAll = async () => {
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.inner.forEach(err => {
          if (err.path) {
            newErrors[err.path as keyof T] = err.message;
          }
        });
        setErrors(newErrors);
      }
      setIsValid(false);
      return false;
    }
  };

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const setAllValues = (newValues: T) => {
    setValues(newValues);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsValid(false);
  };

  return {
    values,
    errors,
    isValid,
    setValue,
    setAllValues,
    validateAll,
    reset
  };
}