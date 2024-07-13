import React, { useEffect, useState } from 'react';

interface FloatingLabelInputProps {
  label: string;
  id: string;
  type?: string;
  value: string | number | undefined | null;
  onChange: (id: string, value: string | number) => void;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange
}) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState<
    string | number | undefined | null
  >(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue =
      type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setInputValue(newValue);
    onChange(id, newValue);
  };

  return (
    <div
      className={`relative min-h-[56px] w-full border-b border-l border-r border-neutral-300 ${
        id === 'street_name'
          ? 'rounded-t-lg border-t'
          : id === 'country'
          ? 'rounded-b-lg'
          : ''
      }
      focus-within:border-t-white focus-within:border-b-white
      flex flex-col
      `}
    >
      <div className=" flex-1 h-full flex items-end">
        <label
          htmlFor={id}
          className="flex-1 h-full w-full flex flex-col justify-end"
        >
          <div
            className={`absolute left-3 right-3 top-4 transition-all transform origin-left leading-5 text-neutral-400 ${
              focused || inputValue
                ? '-translate-y-3 scale-75 '
                : ' translate-y-0 scale-100 cursor-text'
            }
          `}
          >
            {label}
          </div>
          <input
            id={id}
            type={type}
            value={inputValue ?? ''}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            className={`outline-none pl-3 mb-2 w-full rounded-md ${
              !focused && !inputValue && 'cursor-default'
            }`}
          />
        </label>
      </div>
      <div
        className={`absolute top-0 bottom-0 left-0 right-0 bg-transparent pointer-events-none ${
          focused && 'border-2 border-black rounded-md '
        } `}
      ></div>
    </div>
  );
};

export default FloatingLabelInput;
