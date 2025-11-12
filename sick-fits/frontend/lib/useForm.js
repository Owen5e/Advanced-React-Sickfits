import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initialValues]);
  // create a function to handle changes
  function handleChange(e) {
    let { name, value, type } = e.target;
    if (type === 'number') {
      // Handle empty string and invalid numbers to prevent NaN
      value = value === '' ? '' : parseInt(value) || 0;
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }
  // return the inputs and the handleChange function
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
