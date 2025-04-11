import React, { ChangeEvent } from 'react';

interface TextAreaProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  errors?: string | string[];
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  errors,
}) => {
  const errorsArray = Array.isArray(errors) ? errors : errors ? [errors] : [];

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        className="w-full h-48 p-4 rounded-xl bg-white/25 border border-white text-white text-base placeholder-white/70 focus:outline-none resize-none"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
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

export default TextArea;
