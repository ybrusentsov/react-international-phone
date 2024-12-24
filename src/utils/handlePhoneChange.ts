import { MASK_CHAR } from '../hooks/usePhoneInput';
import { CountryData, ParsedCountry } from '../types';
import {
  getActiveFormattingMask,
  guessCountryByPartialNumber,
} from './countryUtils';
import { formatPhone, toE164 } from './phoneUtils';

export interface PhoneFormattingConfig {
  countries: CountryData[];
  prefix: string;
  charAfterDialCode: string;
  forceDialCode: boolean;
  disableDialCodeAndPrefix: boolean;
  defaultMask: string;
  countryGuessingEnabled: boolean;
  disableFormatting: boolean;
  enableLongNumbers: boolean;
}

interface HandlePhoneChangeProps extends PhoneFormattingConfig {
  value: string;
  country: ParsedCountry;
  insertDialCodeOnEmpty: boolean;
  trimNonDigitsEnd?: boolean;
}

export function handlePhoneChange({
  value,
  country,
  insertDialCodeOnEmpty,
  trimNonDigitsEnd,

  countries,
  prefix,
  charAfterDialCode,
  forceDialCode,
  disableDialCodeAndPrefix,
  defaultMask,
  countryGuessingEnabled,
  disableFormatting,
}: HandlePhoneChangeProps): {
  phone: string;
  inputValue: string;
  country: ParsedCountry;
} {
  let inputPhone = value;

  // make sure that inputPhone starts with dial code when dial code is disabled
  if (disableDialCodeAndPrefix) {
    inputPhone = inputPhone.startsWith(`${prefix}`)
      ? inputPhone
      : `${prefix}${country.dialCode}${inputPhone}`;
  }

  const countryGuessResult = countryGuessingEnabled
    ? guessCountryByPartialNumber({
        phone: inputPhone,
        countries,
        currentCountryIso2: country?.iso2,
      }) // FIXME: should not guess country on every change
    : undefined;

  const formatCountry = countryGuessResult?.country ?? country;

  const inputValue = formatPhone(inputPhone, {
    prefix,
    mask: getActiveFormattingMask({
      phone: inputPhone,
      country: formatCountry,
      defaultMask,
      disableFormatting,
    }),
    maskChar: MASK_CHAR,
    dialCode: formatCountry.dialCode,
    trimNonDigitsEnd,
    charAfterDialCode,
    forceDialCode,
    insertDialCodeOnEmpty,
    disableDialCodeAndPrefix,
  });

  const resultCountry =
    countryGuessingEnabled && !countryGuessResult?.fullDialCodeMatch
      ? country
      : formatCountry;

  const phone = toE164({
    phone: disableDialCodeAndPrefix
      ? `${resultCountry.dialCode}${inputValue}`
      : inputValue,
    prefix,
  });

  return {
    phone,
    inputValue,
    country: resultCountry,
  };
}
