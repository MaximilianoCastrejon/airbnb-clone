import { useCallback, useEffect, useRef } from 'react';

export default function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);
  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );

  return debouncedFunction;
}

// Example
// const handleInput = debounce((event: Event) => {
//   const target = event.target as HTMLInputElement;
//   console.log('Input value:', target.value);
// }, 300);
