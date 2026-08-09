import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      return item
        ? JSON.parse(item)
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (
    valueOrFunction: T | ((prev: T) => T)
  ) => {
    setValue((prev) => {
      const newValue =
        valueOrFunction instanceof Function
          ? valueOrFunction(prev)
          : valueOrFunction;

      try {
        localStorage.setItem(
          key,
          JSON.stringify(newValue)
        );
      } catch {
        console.log(
          "Unable to save data to localStorage"
        );
      }

      return newValue;
    });
  };

  return [value, setStoredValue] as const;
}