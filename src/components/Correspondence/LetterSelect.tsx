import React, { ChangeEvent, ElementType, useMemo } from 'react';
import { Option } from '@ts-types/form';

interface Props {
  className?: string;
  IconEnd?: ElementType;
  IconStart?: ElementType;
  errors?: string | string[];
  id: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onIconEndClick?: () => void;
  onIconStartClick?: () => void;
  options: Option[];
  placeholder?: string;
  value: string;
}

const Select: React.FC<Props> = ({
  className,
  IconEnd,
  IconStart,
  errors,
  id,
  label,
  onChange,
  onIconEndClick,
  onIconStartClick,
  options,
  placeholder,
  value,
}) => {
  const errorsArray = useMemo(
    () => (Array.isArray(errors) ? errors : errors ? [errors] : []),
    [errors],
  );

  const paddingClasses = useMemo(() => {
    if (IconStart && IconEnd) return 'pl-10 pr-10';
    if (IconStart) return 'pl-10 pr-3';
    if (IconEnd) return 'pl-3 pr-10';
    return 'px-3';
  }, [IconStart, IconEnd]);

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-white text-md mb-2 ${className}`}
        >
          {label}
        </label>
      )}
      {IconStart && (
        <div className="absolute left-4 top-2 text-white">
          <IconStart
            className="w-4 h-4"
            data-testid={`${id}-select-icon-start`}
            onClick={onIconStartClick}
          />
        </div>
      )}
      <select
        aria-label={label || placeholder || 'Select input'}
        className={`w-full h-9 rounded-full bg-white/25 border border-white text-white text-sm placeholder-white/70 focus:outline-none appearance-none ${paddingClasses}`}
        data-testid="select-input"
        id={id}
        onChange={onChange}
        value={value}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {IconEnd && (
        <div className="absolute right-4 top-2 text-white">
          <IconEnd
            className="w-4 h-4 cursor-pointer"
            data-testid={`${id}-select-icon-end`}
            onClick={onIconEndClick}
          />
        </div>
      )}
      {errorsArray.length > 0 && (
        <ul className="pl-4 mt-1 list-none text-red-400 text-sm">
          {errorsArray.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
