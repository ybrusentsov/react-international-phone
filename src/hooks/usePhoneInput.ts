import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../data/countryData';
import { CountryData, CountryIso2, ParsedCountry } from '../types';
import { getCountry } from '../utils';
import { isMacOS } from '../utils/common/isMacOS';
import {
  handlePhoneChange,
  PhoneFormattingConfig,
} from '../utils/handlePhoneChange';
import { handleUserInput } from '../utils/handleUserInput';
import { useHistoryState } from './useHistoryState';

export const MASK_CHAR = '.';

export interface UsePhoneInputConfig {
  /**
   * @description Default country value (iso2).
   * @default "us"
   */
  defaultCountry?: CountryIso2;

  /**
   * @description phone value
   * @default ""
   */
  value?: string;

  /**
   * @description Array of available countries for guessing.
   * @default defaultCountries // full country list
   */
  countries?: CountryData[];

  /**
   * @description Countries to display at the top of the list of dropdown options.
   * @default []
   */
  preferredCountries?: CountryIso2[];

  /**
   * @description Prefix for phone value.
   * @default "+"
   */
  prefix?: string;

  /**
   * @description This mask will apply on countries that does not have specified mask.
   * @default "............" // 12 chars
   */
  defaultMask?: string;

  /**
   * @description Char that renders after country dial code.
   * @default " "
   */
  charAfterDialCode?: string;

  /**
   * @description
   * Save value to history if there were not any changes in provided milliseconds timeslot.
   * Undo/redo (ctrl+z/ctrl+shift+z) works only with values that are saved in history.
   * @default 200
   */
  historySaveDebounceMS?: number;

  /**
   * @description Disable country guess on value change.
   * @default false
   */
  disableCountryGuess?: boolean;

  /**
   * @description
   * Disable dial code prefill on initialization.
   * Dial code prefill works only when "empty" phone value have been provided.
   * @default false
   */
  disableDialCodePrefill?: boolean;

  /**
   * @description
   * Always display the dial code.
   * Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.
   * @default false
   */
  forceDialCode?: boolean;

  /**
   * @description Display phone value will not include passed *dialCode* and *prefix* if set to *true*.
   * @ignore *forceDialCode* value will be ignored.
   * @default false
   */
  disableDialCodeAndPrefix?: boolean;

  /**
   * @description Disable phone value mask formatting. All formatting characters will not be displayed, but the mask length will be preserved.
   * @default false
   */
  disableFormatting?: boolean;

  /**
   * @description Allow phone value to be longer than the mask.
   * @default false
   */
  enableLongNumbers?: boolean;

  /**
   * @description Callback that calls on phone change
   * @param data - New phone data.
   * @param data.phone - Phone in E164 format.
   * @param data.inputValue - Formatted phone string.
   * @param data.country - Current country object.
   * @default undefined
   */
  onChange?: (data: {
    phone: string;
    inputValue: string;
    country: ParsedCountry;
  }) => void;

  /**
   * @description Ref for the input element.
   * @default undefined
   */
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}

export const defaultConfig: Required<
  Omit<UsePhoneInputConfig, 'onChange' | 'inputRef'> // omit props with no default value
> = {
  defaultCountry: 'us',
  value: '',
  prefix: '+',
  defaultMask: '............', // 12 chars
  charAfterDialCode: ' ',
  historySaveDebounceMS: 200,
  disableCountryGuess: false,
  disableDialCodePrefill: false,
  forceDialCode: false,
  disableDialCodeAndPrefix: false,
  disableFormatting: false,
  enableLongNumbers: false,
  countries: defaultCountries,
  preferredCountries: [],
};

export const usePhoneInput = ({
  defaultCountry = defaultConfig.defaultCountry,
  value = defaultConfig.value,
  countries = defaultConfig.countries,
  prefix = defaultConfig.prefix,
  defaultMask = defaultConfig.defaultMask,
  charAfterDialCode = defaultConfig.charAfterDialCode,
  historySaveDebounceMS = defaultConfig.historySaveDebounceMS,
  disableCountryGuess = defaultConfig.disableCountryGuess,
  disableDialCodePrefill = defaultConfig.disableDialCodePrefill,
  forceDialCode: forceDialCodeConfig = defaultConfig.forceDialCode,
  disableDialCodeAndPrefix = defaultConfig.disableDialCodeAndPrefix,
  disableFormatting = defaultConfig.disableFormatting,
  enableLongNumbers = defaultConfig.enableLongNumbers,
  onChange,
  inputRef: inputRefProp,
}: UsePhoneInputConfig) => {
  const countryGuessingEnabled = !disableCountryGuess;
  const forceDialCode = disableDialCodeAndPrefix ? false : forceDialCodeConfig;

  const phoneFormattingConfig: PhoneFormattingConfig = {
    countries,
    prefix,
    charAfterDialCode,
    forceDialCode,
    disableDialCodeAndPrefix,
    defaultMask,
    countryGuessingEnabled,
    disableFormatting,
    enableLongNumbers,
  };

  const ref = useRef<HTMLInputElement | null>(null);
  const inputRef = inputRefProp || ref;

  const setCursorPosition = (cursorPosition: number) => {
    /**
     * HACK: should set cursor on the next tick to make sure that the phone value is updated
     * useTimeout with 0ms provides issues when two keys are pressed same time
     */
    Promise.resolve().then(() => {
      // workaround for safari autofocus bug:
      // Check if the input is focused before setting the cursor, otherwise safari sometimes autofocuses on setSelectionRange
      if (
        typeof window === 'undefined' ||
        inputRef.current !== document?.activeElement
      ) {
        return;
      }

      inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const getFullCountry = useCallback(
    (iso2: string) => {
      return getCountry({
        value: iso2,
        field: 'iso2',
        countries,
      }) as ParsedCountry;
    },
    [countries],
  );

  const onHistoryChange = useCallback(
    ({
      inputValue,
      phone,
      country,
    }: {
      inputValue: string;
      phone: string;
      country: CountryIso2;
    }) => {
      if (!onChange) return;

      const fullCountry = getFullCountry(country);
      onChange({
        phone,
        inputValue,
        country: fullCountry,
      });
    },
    [getFullCountry, onChange],
  );

  /**
   * phone - E.164 formatted phone
   * inputValue - value that should be rendered in the input element
   * country - current country code
   */
  const [{ phone, inputValue, country }, updateHistory, undo, redo] =
    useHistoryState(
      () => {
        const defaultCountryFull = getCountry({
          value: defaultCountry,
          field: 'iso2',
          countries,
        });

        if (!defaultCountryFull) {
          // default country is not passed, or iso code do not match
          console.error(
            `[react-international-phone]: can not find a country with "${defaultCountry}" iso2 code`,
          );
        }

        const initialCountry =
          defaultCountryFull || // fallback to "us" if user provided not valid country
          (getCountry({
            value: 'us',
            field: 'iso2',
            countries,
          }) as ParsedCountry);

        const {
          phone,
          inputValue,
          country: formatCountry,
        } = handlePhoneChange({
          value,
          country: initialCountry,
          insertDialCodeOnEmpty: !disableDialCodePrefill,
          ...phoneFormattingConfig,
        });

        setCursorPosition(inputValue.length);

        return {
          phone,
          inputValue,
          country: formatCountry.iso2,
        };
      },
      {
        overrideLastItemDebounceMS: historySaveDebounceMS,
        onChange: onHistoryChange,
      },
    );

  const fullCountry = useMemo(() => {
    return getFullCountry(country);
  }, [country, getFullCountry]);

  // Handle undo/redo events
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Keydown event without key property throws on autofill
      if (!e.key) return;

      const ctrlPressed = e.ctrlKey;
      const metaPressed = e.metaKey;
      const shiftPressed = e.shiftKey;
      const zPressed = e.key.toLowerCase() === 'z';

      if (!zPressed) return;

      if (isMacOS()) {
        // command+z on macOS
        if (!metaPressed) return;
      } else {
        // ctrl+z on non-macOS
        if (!ctrlPressed) return;
      }

      shiftPressed ? redo() : undo();
    };

    input.addEventListener('keydown', onKeyDown);
    return () => {
      input.removeEventListener('keydown', onKeyDown);
    };
  }, [inputRef, undo, redo]);

  const handlePhoneValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): string => {
    e.preventDefault();

    const {
      phone: newPhone,
      inputValue: newInputValue,
      country: newCountry,
      cursorPosition: newCursorPosition,
    } = handleUserInput(e, {
      country: fullCountry,
      phoneBeforeInput: inputValue,
      insertDialCodeOnEmpty: false, // allow user to clear input

      ...phoneFormattingConfig,
    });

    updateHistory({
      inputValue: newInputValue,
      phone: newPhone,
      country: newCountry.iso2,
    });

    setCursorPosition(newCursorPosition);

    return value;
  };

  const setCountry = useCallback(
    (countryIso2: CountryIso2, options = { focusOnInput: false }) => {
      const newCountry = getCountry({
        value: countryIso2,
        field: 'iso2',
        countries,
      });
      if (!newCountry) {
        console.error(
          `[react-international-phone]: can not find a country with "${countryIso2}" iso2 code`,
        );
        return;
      }

      const inputValue = disableDialCodeAndPrefix
        ? ''
        : `${prefix}${newCountry.dialCode}${charAfterDialCode}`;

      updateHistory({
        inputValue,
        phone: `${prefix}${newCountry.dialCode}`,
        country: newCountry.iso2,
      });

      if (options.focusOnInput) {
        // Next tick is used to support UI libraries (had an issue with MUI)
        Promise.resolve().then(() => {
          inputRef.current?.focus();
        });
      }
    },
    [
      countries,
      disableDialCodeAndPrefix,
      prefix,
      charAfterDialCode,
      updateHistory,
      inputRef,
    ],
  );

  const [initialized, setInitialized] = useState(false);

  // Handle value update
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);

      if (value !== phone) {
        // Can call onChange directly because phone value was formatted inside the useHistoryState setter
        onChange?.({
          inputValue,
          phone,
          country: fullCountry,
        });
      }

      // skip value handling on initial render
      return;
    }

    if (value === phone) return;

    // new value has been provided to the "value" prop (updated not via input field)

    const {
      phone: newPhone,
      inputValue: newInputValue,
      country: newCountry,
    } = handlePhoneChange({
      value,
      country: fullCountry,
      insertDialCodeOnEmpty: !disableDialCodePrefill,
      ...phoneFormattingConfig,
    });

    updateHistory({
      phone: newPhone,
      inputValue: newInputValue,
      country: newCountry.iso2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    phone, // Phone in E164 format
    inputValue, // Formatted phone string. Value that should be rendered inside input element.
    country: fullCountry, // Current country object.
    setCountry, // Country setter.
    handlePhoneValueChange, // Change handler for input component
    inputRef, // Ref object for input component (handles caret position, focus and undo/redo).
  };
};
