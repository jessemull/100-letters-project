'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Progress from './Progress';

interface Option {
  label: string;
  value: string;
}

interface AutoSelectProps {
  errors?: string | string[];
  id: string;
  label?: string;
  loading?: boolean;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  value: string;
}

const AutoSelect: React.FC<AutoSelectProps> = ({
  errors,
  id,
  label,
  loading = false,
  onChange,
  options,
  placeholder = '',
  value,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [value, options]);

  useEffect(() => {
    if (!isFocused && selectedOption) {
      setInputValue(selectedOption.label);
    }
  }, [selectedOption, isFocused]);

  const filteredOptions = useMemo(() => {
    if (!inputValue || inputValue === selectedOption?.label) return options;
    return options.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase()),
    );
  }, [inputValue, options, selectedOption]);

  const handleSelect = (val: string) => {
    const selected = options.find((option) => option.value === val);
    if (selected) {
      setInputValue(selected.label);
      onChange(val);
    }
    setIsFocused(false);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const errorsArray = useMemo(
    () => (Array.isArray(errors) ? errors : errors ? [errors] : []),
    [errors],
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="block text-white text-base mb-2">
          {label}
        </label>
      )}
      <input
        className="w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none px-4"
        data-testid={id}
        id={id}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        value={inputValue}
      />
      {isFocused && (
        <ul className="absolute z-10 w-full bg-white/90 mt-1 rounded-md text-black shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center w-full py-4">
              <Progress color="black" size={6} />
            </div>
          ) : (
            filteredOptions.map((option, idx) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2 hover:bg-black/10 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-white/60'
                  }`}
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
