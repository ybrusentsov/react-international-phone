import { useCallback, useMemo, useRef } from 'react';

export const useTimer = () => {
  const prevTimeRef = useRef<number>();
  const currentTimeRef = useRef<number>(Date.now());

  /**
   * @returns a milliseconds difference from the last check() call.
   * On first call returns undefined
   */
  const check = useCallback(() => {
    const newTime = Date.now();
    const difference = prevTimeRef.current
      ? newTime - currentTimeRef.current
      : undefined;

    prevTimeRef.current = currentTimeRef.current;
    currentTimeRef.current = newTime;

    return difference;
  }, []);

  return useMemo(
    () => ({
      check,
    }),
    [check],
  );
};
