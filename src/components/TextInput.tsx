import React, { useMemo } from 'react';
import { ChangeEvent, ElementType } from 'react';

interface TextInputProps {
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
  const IconStartClasses = useMemo(
    () => (IconStart ? 'pl-12' : ''),
    [IconStart],
  );
  const IconEndClasses = useMemo(() => (IconEnd ? 'pr-12' : ''), [IconEnd]);
  return (
    <div className="relative w-full">
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
        className={`w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none ${IconStartClasses} ${IconEndClasses}`}
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
        <ul className="pl-4 mt-2 list-none text-white text-base">
          {errorsArray.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextInput;
