interface InputProps {
  label: string;
  name: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  value: string | number | boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  className?: string;
  select_options?: { value: string; text: string }[];
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  className,
  select_options
}) => {
  return (
    <>
      {(type === 'text' || type === 'number') && (
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">{label}</label>
          <input
            name={name}
            type={type}
            value={String(value)}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-lg ${className}`}
          />
        </div>
      )}
      {type === 'checkbox' && typeof value == 'boolean' && (
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">{label}</label>
          <input
            name={name}
            type={type}
            checked={value}
            onChange={onChange}
            className="w-4 h-4 p-2 border rounded-lg"
          />
        </div>
      )}
      {type === 'select' &&
        typeof value == 'string' &&
        select_options &&
        select_options.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              {label}
            </label>
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {select_options.map((option) => (
                <option
                  key={`${type}-${name}-${option.value}`}
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        )}
    </>
  );
};

export default Input;
