import './PhoneInput.style.scss';

import React, { forwardRef, useCallback, useImperativeHandle } from 'react';

import { defaultCountries } from '../../data/countryData';
import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { buildClassNames } from '../../style/buildClassNames';
import { ParsedCountry } from '../../types';
import {
  CountrySelector,
  CountrySelectorProps,
  CountrySelectorStyleProps,
} from '../CountrySelector/CountrySelector';
import {
  DialCodePreview,
  DialCodePreviewStyleProps,
} from '../DialCodePreview/DialCodePreview';

export interface PhoneInputStyleProps {
  style?: React.CSSProperties;
  className?: string;

  inputStyle?: React.CSSProperties;
  inputClassName?: string;

  countrySelectorStyleProps?: CountrySelectorStyleProps;
  dialCodePreviewStyleProps?: DialCodePreviewStyleProps;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface PhoneInputProps
  extends Omit<UsePhoneInputConfig, 'onChange'>,
    PhoneInputStyleProps {
  /**
   * @description Hide the dropdown icon. Make country selection not accessible.
   * @default false
   */
  hideDropdown?: CountrySelectorProps['hideDropdown'];

  /**
   * @description
   * Show prefix and dial code between country selector and phone input.
   * Works only when *disableDialCodeAndPrefix* is *true*
   * @default false
   */
  showDisabledDialCodeAndPrefix?: boolean;

  /**
   * @description Disable auto focus on input field after country select.
   * @default false
   */
  disableFocusAfterCountrySelect?: boolean;

  /**
   * @description Custom flag URLs array
   * @default undefined
   */
  flags?: CountrySelectorProps['flags'];

  /**
   * @description Callback that calls on phone change
   * @param phone - New phone value in E.164 format.
   * @param meta - Additional information about the phone.
   * @param data.country - New phone country object.
   * @param data.inputValue - Value that is displayed in input element.
   * @default undefined
   */
  onChange?: (
    phone: string,
    meta: {
      country: ParsedCountry;
      inputValue: string;
    },
  ) => void;

  /**
   * @description Default input component props
   * @default undefined
   */
  inputProps?: InputProps;

  // pass most used input props as top level props for easy integration
  onFocus?: InputProps['onFocus'];
  onBlur?: InputProps['onBlur'];
  name?: InputProps['name'];
  required?: InputProps['required'];
  autoFocus?: InputProps['autoFocus'];
  disabled?: InputProps['disabled'];
  placeholder?: InputProps['placeholder'];
}

export type PhoneInputRefType =
  | null
  | (HTMLInputElement & {
      setCountry: ReturnType<typeof usePhoneInput>['setCountry'];
      state: {
        phone: string;
        inputValue: string;
        country: ParsedCountry;
      };
    });

export const PhoneInput = forwardRef<PhoneInputRefType, PhoneInputProps>(
  (
    {
      value,
      onChange,
      countries = defaultCountries,
      preferredCountries,
      hideDropdown,
      showDisabledDialCodeAndPrefix,
      disableFocusAfterCountrySelect,
      flags,

      style,
      className,
      inputStyle,
      inputClassName,
      countrySelectorStyleProps,
      dialCodePreviewStyleProps,

      inputProps,
      placeholder,
      disabled,
      name,
      onFocus,
      onBlur,
      required,
      autoFocus,

      ...usePhoneInputConfig
    },
    ref,
  ) => {
    const handlePhoneInputChange = useCallback(
      (data: { phone: string; inputValue: string; country: ParsedCountry }) => {
        onChange?.(data.phone, {
          country: data.country,
          inputValue: data.inputValue,
        });
      },
      [onChange],
    );

    const {
      phone,
      inputValue,
      inputRef,
      country,
      setCountry,
      handlePhoneValueChange,
    } = usePhoneInput({
      value,
      countries,
      ...usePhoneInputConfig,
      onChange: handlePhoneInputChange,
    });

    const showDialCodePreview =
      usePhoneInputConfig.disableDialCodeAndPrefix &&
      showDisabledDialCodeAndPrefix &&
      country?.dialCode;

    const handleCountrySelect = useCallback(
      (country: ParsedCountry) => {
        setCountry(country.iso2, {
          focusOnInput: !disableFocusAfterCountrySelect,
        });
      },
      [setCountry, disableFocusAfterCountrySelect],
    );

    useImperativeHandle<PhoneInputRefType, PhoneInputRefType>(
      ref,
      () => {
        if (!inputRef.current) return null;

        return Object.assign(inputRef.current, {
          // extend input ref with additional properties
          setCountry,
          state: {
            phone,
            inputValue,
            country,
          },
        });
      },
      [inputRef, setCountry, phone, inputValue, country],
    );

    return (
      <div
        ref={ref}
        className={buildClassNames({
          addPrefix: ['input-container'],
          rawClassNames: [className],
        })}
        style={style}
      >
        <CountrySelector
          onSelect={handleCountrySelect}
          flags={flags}
          selectedCountry={country?.iso2}
          countries={countries}
          preferredCountries={preferredCountries}
          disabled={disabled}
          hideDropdown={hideDropdown}
          {...countrySelectorStyleProps}
        />

        {showDialCodePreview && (
          <DialCodePreview
            dialCode={country.dialCode}
            prefix={usePhoneInputConfig.prefix ?? '+'}
            disabled={disabled}
            {...dialCodePreviewStyleProps}
          />
        )}

        <input
          onChange={handlePhoneValueChange}
          value={inputValue}
          type="tel"
          ref={inputRef}
          className={buildClassNames({
            addPrefix: ['input', disabled && 'input--disabled'],
            rawClassNames: [inputClassName],
          })}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          required={required}
          {...inputProps}
        />
      </div>
    );
  },
);
