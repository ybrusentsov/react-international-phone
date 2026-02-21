import { ParsedCountry } from '../types';
import { isNumeric } from './common';
import { handlePhoneChange, PhoneFormattingConfig } from './handlePhoneChange';
import { getCursorPosition, toE164 } from './phoneUtils';

const getDeletionType = (inputType?: string) => {
  const isDeletion = inputType?.toLocaleLowerCase().includes('delete') ?? false;
  if (!isDeletion) return undefined;

  return inputType?.toLocaleLowerCase().includes('forward')
    ? 'forward'
    : 'backward';
};

interface HandleUserInputOptions extends PhoneFormattingConfig {
  country: ParsedCountry;
  insertDialCodeOnEmpty: boolean;
  phoneBeforeInput: string;
}

export const handleUserInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  {
    country,
    insertDialCodeOnEmpty,
    phoneBeforeInput,

    prefix,
    charAfterDialCode,
    forceDialCode,
    disableDialCodeAndPrefix,
    countryGuessingEnabled,
    defaultMask,
    disableFormatting,
    countries,
    allowMaskOverflow,
  }: HandleUserInputOptions,
): {
  phone: string;
  inputValue: string;
  cursorPosition: number;
  country: ParsedCountry;
} => {
  // Didn't find out how to properly type it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nativeEvent: any = e.nativeEvent;

  // Possible input types:
  // https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  const inputType: string | undefined = nativeEvent.inputType;

  const deletion = getDeletionType(inputType);

  const isInserted = !!inputType?.startsWith('insertFrom');
  const isTyped = inputType === 'insertText';

  const nativeEventData: string | null | undefined = nativeEvent?.data;
  // Last char that user typed on a keyboard
  const lastTypedChar = nativeEventData || undefined;

  const userInput = e.target.value;
  const cursorPositionAfterInput = e.target.selectionStart ?? 0;

  // ignore history events (history should be handled manually)
  // only possible way to trigger native history event is to press ctrl+z on empty input
  if (inputType?.includes('history')) {
    return {
      inputValue: phoneBeforeInput,
      phone: toE164({ phone: phoneBeforeInput, prefix }),
      cursorPosition: phoneBeforeInput.length,
      country,
    };
  }

  // ignore user input if typed non-digit character
  if (
    isTyped &&
    !isNumeric(lastTypedChar) &&
    // allow type prefix when input value is empty
    userInput !== prefix
  ) {
    return {
      inputValue: phoneBeforeInput,
      phone: toE164({
        phone: disableDialCodeAndPrefix
          ? `${country.dialCode}${phoneBeforeInput}`
          : phoneBeforeInput,
        prefix,
      }),
      cursorPosition: cursorPositionAfterInput - (lastTypedChar?.length ?? 0),
      country,
    };
  }

  // forceDialCode: ignore dial code change (only if prefixed phone was not inserted)
  if (
    forceDialCode &&
    // dial code has been changed
    !userInput.startsWith(`${prefix}${country.dialCode}`) &&
    // was not inserted with ctrl+v
    !isInserted
  ) {
    const inputValue = userInput
      ? phoneBeforeInput
      : `${prefix}${country.dialCode}${charAfterDialCode}`;

    return {
      inputValue,
      phone: toE164({ phone: inputValue, prefix }),
      cursorPosition:
        prefix.length + country.dialCode.length + charAfterDialCode.length, // set cursor position after dial code
      country,
    };
  }

  const {
    phone: newPhone,
    inputValue: newInputValue,
    country: newCountry,
  } = handlePhoneChange({
    value: userInput,
    country,

    trimNonDigitsEnd: deletion === 'backward', // trim values if user deleting chars (delete mask's whitespace and brackets)
    insertDialCodeOnEmpty,
    countryGuessingEnabled,

    countries,
    prefix,
    charAfterDialCode,
    forceDialCode,
    disableDialCodeAndPrefix,
    disableFormatting,
    defaultMask,
    allowMaskOverflow,
  });

  const newCursorPosition = getCursorPosition({
    cursorPositionAfterInput,
    phoneBeforeInput,
    phoneAfterInput: userInput,
    phoneAfterFormatted: newInputValue,
    leftOffset: forceDialCode
      ? prefix.length + country.dialCode.length + charAfterDialCode.length
      : 0,
    deletion,
  });

  return {
    phone: newPhone,
    inputValue: newInputValue,
    cursorPosition: newCursorPosition,
    country: newCountry,
  };
};
