import React, { ChangeEvent, ElementType, useMemo } from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  IconEnd?: ElementType;
  IconStart?: ElementType;
  errors?: string | string[];
  id: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onIconEndClick?: () => void;
  onIconStartClick?: () => void;
  options: Option[];
  placeholder?: string;
  value: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  IconEnd,
  IconStart,
  errors,
  id,
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
      {IconStart && (
        <div className="absolute left-5 top-3.5 text-white">
          <IconStart
            className="w-5 h-5"
            data-testid={`${id}-select-icon-start`}
            onClick={onIconStartClick}
          />
        </div>
      )}
      <select
        aria-label={label || placeholder || 'Select input'}
        className={`w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none appearance-none ${paddingClasses}`}
        id={id}
        onChange={onChange}
        value={value}
        data-testid="select-input"
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
        <div className="absolute right-5 top-3.5 text-white">
          <IconEnd
            className="w-5 h-5 cursor-pointer"
            data-testid={`${id}-select-icon-end`}
            onClick={onIconEndClick}
          />
        </div>
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

export default Select;
