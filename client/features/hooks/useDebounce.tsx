import { useState, useEffect } from 'react';

export default function useDebounce(value: string, delay: number): string {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value or delay changes
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only call effect if value or delay changes
  );

  return debouncedValue;
}
