type ReservationTypeInputProps = {
  onAdd: () => void;
  onSubstract: () => void;
  value: any;
  label: string;
  description?: string;
};

function ReservationTypeInput({
  onAdd,
  onSubstract,
  value,
  label,
  description
}: ReservationTypeInputProps) {
  return (
    <div className="mb-4 flex flex-row justify-center items-center align-middle">
      <div className="w-full">
        <label className="flex-1 text-gray-700 font-bold mb-2">{label}</label>
        {description && (
          <span className="block text-base font-light text-neutral-500">
            {description}{' '}
          </span>
        )}
      </div>
      {/* SUBTRACT BUTTON */}
      <button
        className="rounded-full border w-4 h-4 border-neutral-200 text-center flex justify-center items-center self-center text-neutral-400"
        onClick={() => onSubstract()}
      >
        <span className="flex items-center justify-center leading-none">-</span>{' '}
      </button>
      <span className="w-14 min-h-4 p-2 text-center mx-2 bg-transparent border-0 text-gray-700 font-bold">
        {String(value)}
      </span>
      {/* ADD BUTTON */}
      <button
        className="rounded-full border w-4 h-4 border-neutral-200 text-center flex justify-center items-center self-center text-neutral-400"
        onClick={() => onAdd()}
      >
        <span className="flex items-center justify-center leading-none">+</span>{' '}
      </button>
    </div>
  );
}

export default ReservationTypeInput;
