import { useEffect, useRef, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const [touched, setTouched] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    // Only update inputs if the initial values have changed and the form hasn't been touched
    if (!touched && JSON.stringify(initial) !== JSON.stringify(initialRef.current)) {
      initialRef.current = initial;
      setInputs(initial);
    }
  }, [initial, touched]);

  // create a function to handle changes
  function handleChange(e) {
    if (!touched) setTouched(true);
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
      [name]: value
    });
  }
  function resetForm() {
    setTouched(false);
    setInputs(initial);
  }

  function clearForm() {
    setTouched(false);
    const blankState = Object.fromEntries(Object.entries(inputs).map(([key]) => [key, '']));
    setInputs(blankState);
  }
  // return the inputs and the handleChange function
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm
  };
}
