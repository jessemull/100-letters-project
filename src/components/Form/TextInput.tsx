import React, { useMemo, forwardRef } from 'react';
import { ChangeEvent, ElementType } from 'react';

interface Props {
  label?: string;
  IconEnd?: ElementType;
  IconStart?: ElementType;
  autocomplete?: string;
  errors?: string | string[];
  id: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onIconEndClick?: () => void;
  onIconStartClick?: () => void;
  placeholder: string;
  type: string;
  value: string;
}

const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      IconEnd,
      IconStart,
      autocomplete,
      errors,
      id,
      onChange,
      onClick,
      onIconEndClick,
      onIconStartClick,
      placeholder,
      type,
      value,
    },
    ref,
  ) => {
    const errorsArray = useMemo(
      () => (Array.isArray(errors) ? errors : errors ? [errors] : []),
      [errors],
    );

    const paddingClasses = useMemo(() => {
      if (IconStart && IconEnd) return 'pl-12 pr-12';
      if (IconStart) return 'pl-12 pr-4';
      if (IconEnd) return 'pl-4 pr-12';
      return 'px-4';
    }, [IconStart, IconEnd]);

    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={id} className="block text-white text-base mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {IconStart && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
              <IconStart
                className="w-5 h-5"
                data-testid="password-text-input-icon-start"
                onClick={onIconStartClick}
              />
            </div>
          )}
          <input
            ref={ref}
            autoComplete={autocomplete}
            className={`w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none ${paddingClasses}`}
            data-testid="text-input"
            id={id}
            onChange={onChange}
            onClick={onClick}
            placeholder={placeholder}
            type={type}
            value={value}
          />
          {IconEnd && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
              <IconEnd
                className="w-5 h-5 cursor-pointer"
                data-testid="password-text-input-icon-end"
                onClick={onIconEndClick}
              />
            </div>
          )}
        </div>
        {errorsArray.length > 0 && (
          <ul className="pl-4 mt-2 list-none text-red-400 text-base">
            {errorsArray.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
