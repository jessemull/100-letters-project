import React, { useMemo } from 'react';
import { ButtonVariant } from '@ts-types/form';
import { Progress } from '@components/Form';

interface ButtonProps {
  disabled?: boolean;
  id: string;
  loading?: boolean;
  onClick: () => void;
  type?: 'round' | 'square';
  value: string;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  id,
  loading,
  onClick,
  value,
  variant = 'default',
}) => {
  const buttonClasses = useMemo(() => {
    if (disabled) {
      return 'bg-gray-500 cursor-not-allowed text-white border-white';
    }
    switch (variant) {
      case 'light':
        return 'bg-white text-black border-black hover:bg-gray-400 cursor-pointer';
      case 'outline':
        return 'bg-[#111827] text-white border-black hover:bg-[#293E6A] cursor-pointer';
      case 'default':
      default:
        return 'bg-[#111827] text-white border-white hover:bg-[#293E6A] cursor-pointer';
    }
  }, [disabled, variant]);

  const progressColor = useMemo(() => {
    switch (variant) {
      case 'light':
        return 'black';
      case 'outline':
        return '#111827';
      default:
        return 'white';
    }
  }, [variant]);

  return (
    <div className="relative w-full">
      <input
        aria-busy={loading ? 'true' : 'false'}
        aria-label={loading ? 'Submitting...' : value}
        className={`w-full h-12 text-base leading-[30px] rounded-[25px] border ${buttonClasses}`}
        data-testid="button"
        disabled={disabled || loading}
        id={id}
        onClick={disabled || loading ? undefined : onClick}
        type="submit"
        value={loading ? '' : value}
      />
      {loading && (
        <div
          aria-live="assertive"
          className="absolute inset-0 flex justify-center items-center"
        >
          <Progress color={progressColor} />
        </div>
      )}
    </div>
  );
};

export default Button;
