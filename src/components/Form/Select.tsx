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
  size?: 'small' | 'large'; // <-- new prop
}

const Select: React.FC<Props> = ({
  className = '',
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
  size = 'large',
}) => {
  const errorsArray = useMemo(
    () => (Array.isArray(errors) ? errors : errors ? [errors] : []),
    [errors],
  );

  const isLarge = size === 'large';

  const paddingClasses = useMemo(() => {
    if (IconStart && IconEnd) return isLarge ? 'pl-12 pr-12' : 'pl-10 pr-10';
    if (IconStart) return isLarge ? 'pl-12 pr-4' : 'pl-10 pr-3';
    if (IconEnd) return isLarge ? 'pl-4 pr-12' : 'pl-3 pr-10';
    return isLarge ? 'px-4' : 'px-3';
  }, [IconStart, IconEnd, isLarge]);

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-white ${isLarge ? 'text-base' : 'text-md'} mb-2 ${className}`}
        >
          {label}
        </label>
      )}
      {IconStart && (
        <div
          className={`absolute ${isLarge ? 'left-5 top-3.5' : 'left-4 top-2'} text-white`}
        >
          <IconStart
            className={isLarge ? 'w-5 h-5' : 'w-4 h-4'}
            data-testid={`${id}-select-icon-start`}
            onClick={onIconStartClick}
          />
        </div>
      )}
      <select
        aria-label={label || placeholder || 'Select input'}
        className={`
          w-full 
          ${isLarge ? 'h-12 text-base' : 'h-9 text-sm'} 
          rounded-full 
          bg-white/25 
          border 
          border-white 
          text-white 
          placeholder-white/70 
          focus:outline-none 
          appearance-none 
          ${paddingClasses}
        `}
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
        <div
          className={`absolute ${isLarge ? 'right-5 top-3.5' : 'right-4 top-2'} text-white`}
        >
          <IconEnd
            className={isLarge ? 'w-5 h-5' : 'w-4 h-4'}
            data-testid={`${id}-select-icon-end`}
            onClick={onIconEndClick}
          />
        </div>
      )}
      {errorsArray.length > 0 && (
        <ul
          className={`pl-4 ${isLarge ? 'mt-2 text-base' : 'mt-1 text-sm'} list-none text-red-400`}
        >
          {errorsArray.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
