import { useEffect, useRef } from 'react';

interface InputProps<T> {
  label: string;
  name: string;
  value: T;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: 'text' | 'number' | 'checkbox' | 'select';
  options?: { value: string; text: string }[]; // For select input
  className?: string;
}

function Input<T>({
  label,
  name,
  value,
  onChange,
  type,
  options,
  className
}: InputProps<T>) {
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
  const style = `w-full px-3 py-2 border rounded-lg ${className}`;
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={String(value)}
          onChange={onChange}
          className={style}
        >
          {options?.map((option) => (
            <option key={`${name}-${option.value}`} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          ref={inputRef}
          value={type === 'checkbox' ? undefined : String(value)}
          checked={
            type === 'checkbox' ? value === 'true' || value === true : undefined
          }
          onChange={onChange}
          className={style}
        />
      )}
    </div>
  );
}

export default Input;
