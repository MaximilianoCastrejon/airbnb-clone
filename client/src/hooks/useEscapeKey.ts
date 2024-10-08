import { useEffect } from 'react';

function useEscapeKey(
  ref: React.RefObject<HTMLElement>,
  onEscapeKey: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscapeKey();
    };

    if (ref) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref]);
}

export default useEscapeKey;
