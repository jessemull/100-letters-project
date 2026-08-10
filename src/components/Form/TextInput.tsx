import React, { useMemo, forwardRef } from 'react';
import { ChangeEvent, ElementType } from 'react';

interface Props {
  label?: string;
  IconEnd?: ElementType;
  IconStart?: ElementType;
  ariaLabel?: string;
  autocomplete?: string;
  errors?: string | string[];
  iconEndLabel?: string;
  iconStartLabel?: string;
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
      ariaLabel,
      autocomplete,
      errors,
      iconEndLabel,
      iconStartLabel,
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

    const errorId = `${id}-errors`;
    const hasErrors = errorsArray.length > 0;

    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={id} className="block text-white text-base mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {IconStart &&
            (onIconStartClick ? (
              <button
                aria-label={iconStartLabel ?? 'Input action'}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                data-testid={`${id}-icon-start`}
                onClick={onIconStartClick}
                type="button"
              >
                <IconStart aria-hidden className="w-5 h-5" />
              </button>
            ) : (
              <div
                aria-hidden
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white"
                data-testid={`${id}-icon-start`}
              >
                <IconStart className="w-5 h-5" />
              </div>
            ))}
          <input
            ref={ref}
            aria-describedby={hasErrors ? errorId : undefined}
            aria-invalid={hasErrors}
            aria-label={label ? undefined : (ariaLabel ?? placeholder)}
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
          {IconEnd &&
            (onIconEndClick ? (
              <button
                aria-label={iconEndLabel ?? 'Input action'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                data-testid={`${id}-icon-end`}
                onClick={onIconEndClick}
                type="button"
              >
                <IconEnd aria-hidden className="w-5 h-5" />
              </button>
            ) : (
              <div
                aria-hidden
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white"
                data-testid={`${id}-icon-end`}
              >
                <IconEnd className="w-5 h-5" />
              </div>
            ))}
        </div>
        {hasErrors && (
          <ul
            className="pl-4 mt-2 list-none text-red-400 text-base"
            id={errorId}
          >
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
