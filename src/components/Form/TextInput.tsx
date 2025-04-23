import React, { useMemo } from 'react';
import { ChangeEvent, ElementType } from 'react';

interface TextInputProps {
  label?: string; // Optional label prop
  IconEnd?: ElementType;
  IconStart?: ElementType;
  autocomplete?: string;
  errors?: string | string[];
  id: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onIconEndClick?: () => void;
  onIconStartClick?: () => void;
  placeholder: string;
  type: string;
  value: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  IconEnd,
  IconStart,
  autocomplete,
  errors,
  id,
  onChange,
  onIconEndClick,
  onIconStartClick,
  placeholder,
  type,
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
            data-testid="password-text-input-icon-start"
            onClick={onIconStartClick}
          />
        </div>
      )}
      <input
        autoComplete={autocomplete}
        className={`w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none ${paddingClasses}`}
        data-testid="text-input"
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {IconEnd && (
        <div className="absolute right-5 top-3.5 text-white">
          <IconEnd
            className="w-5 h-5 cursor-pointer"
            data-testid="password-text-input-icon-end"
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

export default TextInput;
