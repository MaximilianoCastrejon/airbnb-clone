import IncreaseDecrementButton from './IncreaseDecrementButton';
// TODO: Make a reusable component that takes a field of the state
type CategoryInputProps<T> = {
  field: keyof T;
  updateFunction: (field: any, operation: 'increment' | 'decrement') => void;
  value: T;
  label: string;
  description?: string;
};

function CategoryInput<T>({
  field,
  updateFunction,
  value,
  label,
  description
}: CategoryInputProps<T>) {
  return (
    <div className="mb-4 flex flex-row justify-center items-center align-middle">
      <div className="w-full">
        <label
          htmlFor={String(field)}
          className="flex-1 text-gray-700 font-bold mb-2"
        >
          {label}
        </label>
        {description && (
          <span className="block text-base font-light text-neutral-500">
            {description}{' '}
          </span>
        )}
      </div>
      <IncreaseDecrementButton
        updateFunction={() => updateFunction(field, 'decrement')}
        operation="decrement"
      />
      <span className="w-14 min-h-4 p-2 text-center mx-2 bg-transparent border-0 text-gray-700 font-bold">
        {String(value[field])}
      </span>
      <IncreaseDecrementButton
        updateFunction={() => updateFunction(field, 'increment')}
        operation="increment"
      />
    </div>
  );
}

export default CategoryInput;
