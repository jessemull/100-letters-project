import React, { ChangeEvent, ElementType, useMemo } from 'react';
import { Option } from '@ts-types/form';

interface Props {
  className?: string;
  IconEnd?: ElementType;
  IconStart?: ElementType;
  errors?: string | string[];
  iconEndLabel?: string;
  iconStartLabel?: string;
  id: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onIconEndClick?: () => void;
  onIconStartClick?: () => void;
  options: Option[];
  placeholder?: string;
  value: string;
  size?: 'small' | 'large';
}

const Select: React.FC<Props> = ({
  className = '',
  IconEnd,
  IconStart,
  errors,
  iconEndLabel,
  iconStartLabel,
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

  const iconSizeClass = isLarge ? 'w-5 h-5' : 'w-4 h-4';
  const iconStartPosition = isLarge ? 'left-5 top-3.5' : 'left-4 top-2';
  const iconEndPosition = isLarge ? 'right-5 top-3.5' : 'right-4 top-2';

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
      {IconStart &&
        (onIconStartClick ? (
          <button
            aria-label={iconStartLabel ?? 'Select action'}
            className={`absolute ${iconStartPosition} text-white cursor-pointer`}
            data-testid={`${id}-select-icon-start`}
            onClick={onIconStartClick}
            type="button"
          >
            <IconStart aria-hidden className={iconSizeClass} />
          </button>
        ) : (
          <div
            aria-hidden
            className={`absolute ${iconStartPosition} pointer-events-none text-white`}
            data-testid={`${id}-select-icon-start`}
          >
            <IconStart className={iconSizeClass} />
          </div>
        ))}
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
          cursor-pointer
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
      {IconEnd &&
        (onIconEndClick ? (
          <button
            aria-label={iconEndLabel ?? 'Select action'}
            className={`absolute ${iconEndPosition} text-white cursor-pointer`}
            data-testid={`${id}-select-icon-end`}
            onClick={onIconEndClick}
            type="button"
          >
            <IconEnd aria-hidden className={iconSizeClass} />
          </button>
        ) : (
          <div
            aria-hidden
            className={`absolute ${iconEndPosition} pointer-events-none text-white`}
            data-testid={`${id}-select-icon-end`}
          >
            <IconEnd className={iconSizeClass} />
          </div>
        ))}
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
