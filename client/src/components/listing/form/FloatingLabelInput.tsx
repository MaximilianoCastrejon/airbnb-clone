import React, { useCallback, useEffect, useRef, useState } from 'react';

interface FloatingLabelInputProps {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange
}) => {
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input && input.type === 'number') {
      const noWheelScrollFn = (e: WheelEvent) => {
        if (document.activeElement === input) {
          e.preventDefault(); // Stop the wheel event from reaching the input field
        }
      };
      input.addEventListener('wheel', noWheelScrollFn);
      return () => {
        input.removeEventListener('wheel', noWheelScrollFn);
      };
    }
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div className={`relative min-h-[56px] w-full flex flex-col`}>
      <div className=" flex-1 h-full flex items-end">
        <label htmlFor={id} className="flex-1 flex flex-col">
          <div
            className={`absolute left-3 right-3 top-4 transition-all transform origin-left leading-5 text-neutral-400 select-none ${
              focused || !!value
                ? '-translate-y-3 scale-75 '
                : ' translate-y-0 scale-100 cursor-text'
            }`}
          >
            {label}
          </div>
          <input
            id={id}
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            className={`outline-none pl-3 mb-2 w-full rounded-md `}
          />
        </label>
      </div>
      <div
        className={`absolute inset-0 bg-transparent pointer-events-none ${
          focused && 'border-2 border-black rounded-md '
        } `}
      ></div>
    </div>
  );
};

export default FloatingLabelInput;
