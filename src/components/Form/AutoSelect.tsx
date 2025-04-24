'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Progress from './Progress';

interface Option {
  label: string;
  value: string;
}

interface AutoSelectProps {
  id: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string | string[];
  loading?: boolean;
}

const AutoSelect: React.FC<AutoSelectProps> = ({
  id,
  label,
  options,
  placeholder = '',
  value,
  onChange,
  errors,
  loading = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Find the label for the current value
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [value, options]);

  // Update input value to show the selected label
  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.label);
    }
  }, [selectedOption]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase()),
    );
  }, [inputValue, options]);

  const handleSelect = (val: string) => {
    const selected = options.find((option) => option.value === val);
    if (selected) {
      setInputValue(selected.label); // Set input field to display the selected label
      onChange(val); // Pass the value to the parent
    }
    setIsFocused(false);
  };

  const errorsArray = useMemo(
    () => (Array.isArray(errors) ? errors : errors ? [errors] : []),
    [errors],
  );

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-white text-base mb-2">
          {label}
        </label>
      )}

      <input
        id={id}
        value={inputValue}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none px-4"
      />

      {isFocused && (
        <ul className="absolute z-10 w-full bg-white/90 mt-1 rounded-md text-black shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center w-full py-4">
              <Progress color="black" size={6} />
            </div>
          ) : (
            filteredOptions.map((option) => (
              <li key={option.value} className="px-4 py-2">
                <button
                  type="button"
                  onMouseDown={() => handleSelect(option.value)}
                  className="w-full text-left hover:bg-white/70 cursor-pointer"
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {errorsArray.length > 0 && (
        <ul className="pl-4 mt-2 list-none text-red-400 text-base">
          {errorsArray.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoSelect;
