import { useCallback, useRef, useState } from 'react';

import { isShallowEqualObjects } from '../utils/common/isShallowEqualObjects';
import { useTimer } from './useTimer';

interface UseHistoryStateConfig<T> {
  size?: number;
  overrideLastItemDebounceMS?: number;
  onChange?: (data: T) => void;
}

const defaultConfig = {
  size: 20,
  overrideLastItemDebounceMS: -1, // overriding is disabled by default
};

interface SetStateConfig {
  /**
   * Update last history element (not create new one)
   */
  overrideLastItem?: boolean;
}

type HistoryActionResult<T> = { success: false } | { success: true; value: T };

export function useHistoryState<T extends Record<string, unknown> | string>(
  initialValue: T | (() => T),
  config?: UseHistoryStateConfig<T>,
) {
  const { size, overrideLastItemDebounceMS, onChange } = {
    ...defaultConfig,
    ...config,
  };

  const [state, _setState] = useState(initialValue);

  const historyRef = useRef<T[]>([state]);
  const pointerRef = useRef<number>(0);

  const timer = useTimer();

  const setState = useCallback(
    (value: T, config?: SetStateConfig) => {
      const lastState = historyRef.current[pointerRef.current];

      if (
        value === lastState ||
        // compare entries if passed value is object
        (typeof value === 'object' &&
          typeof lastState === 'object' &&
          isShallowEqualObjects(value, lastState))
      ) {
        return;
      }

      const isOverridingEnabled = overrideLastItemDebounceMS > 0;

      const timePassedSinceLastChange = timer.check();
      const debounceTimePassed =
        isOverridingEnabled && timePassedSinceLastChange !== undefined
          ? timePassedSinceLastChange > overrideLastItemDebounceMS
          : true;

      const shouldOverrideLastItem =
        // use value of config.overrideLastItem if passed
        config?.overrideLastItem !== undefined
          ? config.overrideLastItem
          : !debounceTimePassed;

      if (shouldOverrideLastItem) {
        // do not update pointer
        historyRef.current = [
          ...historyRef.current.slice(0, pointerRef.current),
          value,
        ];
      } else {
        const isSizeOverflow = historyRef.current.length >= size;
        historyRef.current = [
          ...historyRef.current.slice(
            isSizeOverflow ? 1 : 0,
            pointerRef.current + 1,
          ),
          value,
        ];

        if (!isSizeOverflow) {
          pointerRef.current += 1;
        }
      }
      _setState(value);
      onChange?.(value);
    },
    [onChange, overrideLastItemDebounceMS, size, timer],
  );

  const undo = useCallback((): HistoryActionResult<T> => {
    if (pointerRef.current <= 0) {
      return { success: false };
    }

    const value = historyRef.current[pointerRef.current - 1];
    _setState(value);
    pointerRef.current -= 1;

    onChange?.(value);
    return { success: true, value };
  }, [onChange]);

  const redo = useCallback((): HistoryActionResult<T> => {
    if (pointerRef.current + 1 >= historyRef.current.length) {
      return { success: false };
    }

    const value = historyRef.current[pointerRef.current + 1];
    _setState(value);
    pointerRef.current += 1;

    onChange?.(value);
    return { success: true, value };
  }, [onChange]);

  return [state, setState, undo, redo] as const;
}
