import React, { useMemo } from 'react';

interface ProgressProps {
  color?: string;
  size?: number;
}

const Progress: React.FC<ProgressProps> = ({ color = 'black', size = 6 }) => {
  const spinnerSize = useMemo(() => size * 4, [size]);
  const borderWidth = useMemo(() => Math.round(size / 4), [size]);
  return (
    <div
      data-testid="progress"
      className="flex justify-center items-center"
      style={{ width: `${spinnerSize}px`, height: `${spinnerSize}px` }}
    >
      <div
        className="border-t-transparent rounded-full animate-spin"
        style={{
          borderColor: `${color} transparent transparent transparent`,
          height: `${spinnerSize}px`,
          width: `${spinnerSize}px`,
          borderWidth: `${borderWidth}px`,
        }}
      ></div>
    </div>
  );
};

export default Progress;
