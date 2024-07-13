import React from 'react';

function IncreaseDecrementButton({
  updateFunction,
  operation
}: {
  updateFunction: () => void;
  operation: 'increment' | 'decrement';
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    updateFunction();
  };
  return (
    <button
      className="rounded-full border w-4 h-4 border-neutral-200 text-center flex justify-center items-center self-center text-neutral-400"
      onClick={handleClick}
    >
      <span className="flex items-center justify-center leading-none">
        {operation === 'increment' ? '+' : '-'}
      </span>{' '}
    </button>
  );
}

export default IncreaseDecrementButton;
