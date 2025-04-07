import React, { useMemo } from 'react';
import Progress from './Progress';

interface ButtonProps {
  disabled?: boolean;
  id: string;
  loading?: boolean;
  onClick: () => void;
  type?: 'round' | 'square';
  value: string;
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  id,
  loading,
  onClick,
  value,
}) => {
  const disabledClasses = useMemo(
    () =>
      disabled
        ? 'bg-gray-500 cursor-not-allowed'
        : 'bg-[#111827] hover:bg-[#293E6A] cursor-pointer',
    [disabled],
  );
  return (
    <div className="relative w-full">
      <input
        aria-busy={loading ? 'true' : 'false'}
        aria-label={loading ? 'Submitting...' : value}
        className={`w-full h-12 text-white text-base leading-[30px] bg-[#111827] border border-white rounded-[25px] ${disabledClasses}`}
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
          <Progress color="white" />
        </div>
      )}
    </div>
  );
};

export default Button;
