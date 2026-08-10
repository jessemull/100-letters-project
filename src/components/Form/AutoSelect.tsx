'use client';

import Progress from './Progress';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Option } from '@ts-types/form';

interface Props {
  errors?: string | string[];
  id: string;
  label?: string;
  loading?: boolean;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  value: string;
}

const AutoSelect: React.FC<Props> = ({
  errors,
  id,
  label,
  loading = false,
  onChange,
  options,
  placeholder = '',
  value,
}) => {
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [value, options]);

  const selectedLabel = selectedOption?.label ?? '';
  const [inputValue, setInputValue] = useState(selectedLabel);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [syncedLabel, setSyncedLabel] = useState(selectedLabel);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listboxId = `${id}-listbox`;

  if (!isFocused && selectedOption && selectedLabel !== syncedLabel) {
    setSyncedLabel(selectedLabel);
    setInputValue(selectedLabel);
  }

  const filteredOptions = useMemo(() => {
    if (!inputValue || inputValue === selectedOption?.label) return options;
    return options.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase()),
    );
  }, [inputValue, options, selectedOption]);

  const activeIndex =
    filteredOptions.length === 0
      ? 0
      : Math.min(highlightedIndex, filteredOptions.length - 1);
  const activeOptionId =
    isFocused && filteredOptions[activeIndex]
      ? `${id}-option-${filteredOptions[activeIndex].value}`
      : undefined;

  const handleSelect = (val: string) => {
    const selected = options.find((option) => option.value === val);
    if (selected) {
      setInputValue(selected.label);
      setSyncedLabel(selected.label);
      onChange(val);
    }
    setIsFocused(false);
    setHighlightedIndex(0);
  };

  const openList = () => {
    setIsFocused(true);
    setHighlightedIndex(0);
  };

  const closeList = () => {
    setIsFocused(false);
    setInputValue(selectedLabel);
    setSyncedLabel(selectedLabel);
    setHighlightedIndex(0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setInputValue(selectedLabel);
        setSyncedLabel(selectedLabel);
        setHighlightedIndex(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [selectedLabel]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeList();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isFocused) {
        openList();
        return;
      }
      if (filteredOptions.length === 0) return;
      setHighlightedIndex((index) => (index + 1) % filteredOptions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isFocused) {
        openList();
        return;
      }
      if (filteredOptions.length === 0) return;
      setHighlightedIndex(
        (index) =>
          (index - 1 + filteredOptions.length) % filteredOptions.length,
      );
      return;
    }

    if (event.key === 'Enter') {
      if (!isFocused || filteredOptions.length === 0) return;
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) handleSelect(option.value);
    }
  };

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
        aria-activedescendant={activeOptionId}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isFocused}
        aria-haspopup="listbox"
        className="w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none px-4"
        data-testid={id}
        id={id}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsFocused(true);
          setHighlightedIndex(0);
        }}
        onFocus={openList}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        value={inputValue}
      />
      {isFocused && (
        <ul
          className="absolute z-10 w-full bg-white/90 mt-1 rounded-md text-black shadow-lg max-h-60 overflow-auto"
          id={listboxId}
          role="listbox"
        >
          {loading ? (
            <li
              className="flex justify-center items-center w-full py-4"
              role="presentation"
            >
              <Progress color="black" size={6} />
            </li>
          ) : filteredOptions.length === 0 ? (
            <li
              className="px-4 py-2 text-black/70"
              id={`${id}-option-empty`}
              role="option"
              aria-selected={false}
            >
              No matches
            </li>
          ) : (
            filteredOptions.map((option, idx) => (
              <li
                key={option.value}
                id={`${id}-option-${option.value}`}
                role="option"
                aria-selected={idx === activeIndex}
                tabIndex={-1}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full text-left px-4 py-2 hover:bg-black/10 cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-black/10'
                    : idx % 2 === 0
                      ? 'bg-white'
                      : 'bg-white/60'
                }`}
              >
                {option.label}
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
