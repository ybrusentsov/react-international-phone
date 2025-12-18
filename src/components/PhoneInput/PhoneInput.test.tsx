import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { defaultCountries } from '../../data/countryData';
import { CountryIso2 } from '../../types';
import { getCountry, parseCountry, removeNonDigits } from '../../utils';
import { buildCountryData } from '../../utils/countryUtils/buildCountryData';
import {
  getCountrySelector,
  getCountrySelectorDropdown,
  getCountrySelectorFlag,
  getDialCodePreview,
  getDropdownArrow,
  getDropdownOption,
  getInput,
  increaseSystemTime,
  mockScrollIntoView,
} from '../../utils/test-utils';
import { PhoneInput, PhoneInputRefType } from './PhoneInput';

export const fireChangeEvent = (
  value: string,
  {
    isDeletion,
    cursorPosition,
  }: {
    isDeletion?: boolean;
    cursorPosition?: number;
  } = {},
) => {
  fireEvent.change(getInput(), {
    target: {
      value,
      selectionStart: cursorPosition ?? value.length,
      selectionEnd: cursorPosition ?? value.length,
    },
    nativeEvent: { inputType: isDeletion ? 'delete' : 'another-type' },
  });
};

const setCursorPosition = (
  selectionStart: number,
  selectionEnd: number = selectionStart,
) => {
  getInput().selectionStart = selectionStart;
  getInput().selectionEnd = selectionEnd;
};

describe('PhoneInput', () => {
  beforeAll(() => {
    mockScrollIntoView();
  });

  describe('render value', () => {
    test('should set phone value', () => {
      render(<PhoneInput value="+38099109" defaultCountry="ua" />);
      expect(getInput().value).toBe('+380 (99) 109 ');
    });

    test('should call update input value on state change', () => {
      const { rerender } = render(<PhoneInput value="+12345" />);
      expect(getInput().value).toBe('+1 (234) 5');

      rerender(<PhoneInput value="+123456" />);
      expect(getInput().value).toBe('+1 (234) 56');
    });
  });

  describe('onChange', () => {
    test('should call onChange when input value is updated', async () => {
      const onChange = jest.fn();
      render(<PhoneInput value="+1" defaultCountry="us" onChange={onChange} />);
      expect(onChange.mock.calls.length).toBe(0);

      fireEvent.change(getInput(), { target: { value: '38099' } });
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+38099');
      expect(onChange.mock.calls[0][1].inputValue).toBe('+380 (99) ');

      fireEvent.change(getInput(), { target: { value: '+380 (99) 999' } });
      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+38099999');
      expect(onChange.mock.calls[1][1].inputValue).toBe('+380 (99) 999 ');

      fireEvent.change(getInput(), { target: { value: '' } });
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('');
      expect(onChange.mock.calls[2][1].inputValue).toBe('');

      fireEvent.change(getInput(), { target: { value: '+1 403 555-6666' } });
      expect(onChange.mock.calls.length).toBe(4);
      expect(onChange.mock.calls[3][0]).toBe('+14035556666');
      expect(onChange.mock.calls[3][1].inputValue).toBe('+1 (403) 555-6666');
    });

    test('should call onChange on initialization (value is not in e164 format)', () => {
      const onChange = jest.fn();
      render(
        <PhoneInput
          value="+1 (999) 999 9999"
          defaultCountry="us"
          onChange={onChange}
        />,
      );

      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+19999999999');
    });

    test('should call onChange on initialization (value is empty string)', () => {
      const onChange = jest.fn();
      render(<PhoneInput value="" defaultCountry="us" onChange={onChange} />);

      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');
    });

    test('should call onChange on initialization (value is not provided)', () => {
      const onChange = jest.fn();
      render(<PhoneInput defaultCountry="us" onChange={onChange} />);

      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');
    });

    test('should call onChange on country change', () => {
      const onChange = jest.fn();
      render(<PhoneInput defaultCountry="us" onChange={onChange} />);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ua'));
      });

      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+380');

      // set Canada
      fireEvent.change(getInput(), { target: { value: '+1 (204) ' } });
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('+1204');

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ca'));
      });
      expect(onChange.mock.calls.length).toBe(4);
      expect(onChange.mock.calls[3][0]).toBe('+1');

      // should fire change even if phone is not changed
      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('us'));
      });
      expect(onChange.mock.calls.length).toBe(5);
      expect(onChange.mock.calls[4][0]).toBe('+1');
    });

    test('should call onChange on undo/redo', () => {
      const onChange = jest.fn();
      render(
        <PhoneInput
          defaultCountry="us"
          onChange={onChange}
          // remove history save debounce
          historySaveDebounceMS={0}
        />,
      );
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');
      expect(onChange.mock.calls[0][1].inputValue).toBe('+1 ');
      expect(onChange.mock.calls[0][1].inputValue).toBe(getInput().value);

      fireEvent.change(getInput(), { target: { value: '+38099' } });
      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+38099');
      expect(onChange.mock.calls[1][1].inputValue).toBe('+380 (99) ');
      expect(onChange.mock.calls[1][1].inputValue).toBe(getInput().value);

      fireEvent.change(getInput(), { target: { value: '+38099 99' } });
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('+3809999');
      expect(onChange.mock.calls[2][1].inputValue).toBe('+380 (99) 99');
      expect(onChange.mock.calls[2][1].inputValue).toBe(getInput().value);

      // undo
      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: false,
      });
      expect(onChange.mock.calls.length).toBe(4);
      expect(onChange.mock.calls[3][0]).toBe('+38099');
      expect(onChange.mock.calls[3][1].inputValue).toBe('+380 (99) ');
      expect(onChange.mock.calls[3][1].inputValue).toBe(getInput().value);

      // redo
      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: true,
      });
      expect(onChange.mock.calls.length).toBe(5);
      expect(onChange.mock.calls[4][0]).toBe('+3809999');
      expect(onChange.mock.calls[4][1].inputValue).toBe('+380 (99) 99');
      expect(onChange.mock.calls[4][1].inputValue).toBe(getInput().value);
    });

    test('should return data object as second argument', () => {
      const onChange = jest.fn();
      render(<PhoneInput defaultCountry="us" onChange={onChange} />);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');
      expect(onChange.mock.calls[0][1]).toMatchObject({
        country: getCountry({ field: 'iso2', value: 'us' }),
        inputValue: '+1 ',
      });

      fireEvent.change(getInput(), { target: { value: '+1234' } });
      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+1234');
      expect(onChange.mock.calls[1][1]).toMatchObject({
        country: getCountry({ field: 'iso2', value: 'us' }),
        inputValue: '+1 (234) ',
      });

      fireEvent.change(getInput(), { target: { value: '+380991234567' } });
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('+380991234567');
      expect(onChange.mock.calls[2][1]).toMatchObject({
        country: getCountry({ field: 'iso2', value: 'ua' }),
        inputValue: '+380 (99) 123 45 67',
      });
    });
  });

  describe('country flag', () => {
    test('should set flag on initial render', () => {
      render(<PhoneInput value="+1" defaultCountry="ca" />);
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');
      expect(getCountrySelector()).toHaveAttribute('title', 'Canada');
    });

    test('should set flag on phone change', () => {
      render(<PhoneInput defaultCountry="us" />);
      expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

      fireEvent.change(getInput(), { target: { value: '+38099' } });
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ua');

      fireEvent.change(getInput(), { target: { value: '+1 204' } });
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');

      fireEvent.change(getInput(), { target: { value: '' } });
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');
    });
  });

  test('should format value', () => {
    render(<PhoneInput defaultCountry="ua" value="380" />);

    fireEvent.change(getInput(), { target: { value: '380991234567' } });
    expect(getInput().value).toBe('+380 (99) 123 45 67');

    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');
  });

  test('should update country on input', () => {
    render(<PhoneInput defaultCountry="ua" />);
    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
  });

  test('should not change the country when dial code or area-code is not changed', () => {
    // Canada and USA have "+1" as dial code
    render(<PhoneInput defaultCountry="ca" />);

    fireEvent.change(getInput(), { target: { value: '+12' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');

    fireEvent.change(getInput(), { target: { value: '+123' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');

    fireEvent.change(getInput(), { target: { value: '+1230' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

    fireEvent.change(getInput(), { target: { value: '+1203' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

    fireEvent.change(getInput(), { target: { value: '+1204' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');

    fireEvent.change(getInput(), { target: { value: '+1' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');
  });

  test('should open country selector dropdown', () => {
    render(<PhoneInput defaultCountry="ua" />);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    act(() => {
      fireEvent.click(getCountrySelector());
    });
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should select country from dropdown', () => {
    render(<PhoneInput defaultCountry="ua" />);
    act(() => {
      fireEvent.click(getCountrySelector());
      fireEvent.click(getDropdownOption('af'));
    });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'af');
    expect(getInput().value).toBe('+93 ');

    act(() => {
      fireEvent.click(getCountrySelector());
      fireEvent.click(getDropdownOption('us'));
    });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
    expect(getInput().value).toBe('+1 ');

    fireEvent.change(getInput(), { target: { value: '+1234' } });
    expect(getInput().value).toBe('+1 (234) ');
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

    act(() => {
      fireEvent.click(getCountrySelector());
      fireEvent.click(getDropdownOption('ca'));
    });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');
  });

  test('should support disabled state', () => {
    const { rerender } = render(<PhoneInput defaultCountry="ua" />);
    expect(getCountrySelector()).toHaveProperty('disabled', false);
    expect(getInput()).toHaveProperty('disabled', false);

    rerender(<PhoneInput defaultCountry="ua" disabled />);
    expect(getCountrySelector()).toHaveProperty('disabled', true);
    expect(getInput()).toHaveProperty('disabled', true);

    rerender(
      <PhoneInput
        defaultCountry="ua"
        disabled
        showDisabledDialCodeAndPrefix
        disableDialCodeAndPrefix
      />,
    );
    expect(getCountrySelector()).toHaveProperty('disabled', true);
    expect(getInput()).toHaveProperty('disabled', true);
    expect(getDialCodePreview()?.className).toMatch(/disabled/);
  });

  test('should hide dropdown icon when hideDropdown is true', () => {
    const { rerender } = render(<PhoneInput defaultCountry="ua" />);
    expect(getDropdownArrow()).toBeVisible();

    rerender(<PhoneInput defaultCountry="ua" hideDropdown />);
    expect(getDropdownArrow()).toBeNull();
  });

  describe('default country', () => {
    test('should set default country if value is not provided', () => {
      render(<PhoneInput defaultCountry="tw" />);
      expect(getCountrySelector()).toHaveAttribute('data-country', 'tw');
      expect(getInput().value).toBe('+886 ');
    });

    test('should parse country from value if it is provided (and ignore default country)', () => {
      render(<PhoneInput value="+1" defaultCountry="tw" />);
      expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
      expect(getInput().value).toBe('+1 ');
    });

    test('should set default country if multiple countries have provided dial code', () => {
      render(<PhoneInput value="+1" defaultCountry="ca" />);
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ca');
      expect(getInput().value).toBe('+1 ');
    });

    test('should set "us" if the default-country and value are not specified', () => {
      render(<PhoneInput />);
      expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
      expect(getInput().value).toBe('+1 ');
    });

    test('should set "us" if provided invalid default country', () => {
      const logSpy = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => null);

      render(<PhoneInput defaultCountry={'test' as CountryIso2} />);

      expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
      expect(getInput().value).toBe('+1 ');

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        '[react-international-phone]: can not find a country with "test" iso2 code',
      );

      logSpy.mockRestore();
    });
  });

  test('should render placeholder', () => {
    const { rerender } = render(
      <PhoneInput defaultCountry="us" placeholder="Phone input" />,
    );
    expect(getInput()).toHaveProperty('placeholder', 'Phone input');

    rerender(<PhoneInput defaultCountry="us" placeholder="Test placeholder" />);
    expect(getInput()).toHaveProperty('placeholder', 'Test placeholder');
  });

  test('should handle defaultMask value', () => {
    render(<PhoneInput defaultCountry="us" defaultMask="....-....-...." />);
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');

    // Albania does not have a defined mask
    fireEvent.change(getInput(), { target: { value: '+355123456789000' } });
    expect(getInput().value).toBe('+355 1234-5678-9000');
  });

  test('should handle charAfterDialCode', () => {
    const { rerender } = render(
      <PhoneInput defaultCountry="us" charAfterDialCode="" />,
    );
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1(234) 567-8900');
    fireEvent.change(getInput(), { target: { value: '380999' } });
    expect(getInput().value).toBe('+380(99) 9');

    rerender(<PhoneInput defaultCountry="us" charAfterDialCode="-" />);
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1-(234) 567-8900');
  });

  test('should handle disableCountryGuess', () => {
    render(<PhoneInput defaultCountry="us" disableCountryGuess />);
    fireEvent.change(getInput(), { target: { value: '38099123456' } });
    expect(getInput().value).toBe('+3 (809) 912-3456');
  });

  test('should handle disableDialCodePrefill', () => {
    render(<PhoneInput defaultCountry="us" disableDialCodePrefill />);
    expect(getInput().value).toBe('');
  });

  describe('forceDialCode', () => {
    test('should not call onChange when initial phone is in E164 format', () => {
      const onChange = jest.fn();
      render(
        <PhoneInput
          value="+12345678900"
          defaultCountry="us"
          forceDialCode
          onChange={onChange}
        />,
      );
      expect(getInput().value).toBe('+1 (234) 567-8900');
      expect(onChange.mock.calls.length).toBe(0);
    });

    test('should call onChange when initial phone is not in E164 format', () => {
      const onChange = jest.fn();
      render(
        <PhoneInput
          value="12345678900"
          defaultCountry="us"
          forceDialCode
          onChange={onChange}
        />,
      );
      expect(getInput().value).toBe('+1 (234) 567-8900');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+12345678900');
    });

    test('should not allow dial code change with input', () => {
      const onChange = jest.fn();
      render(
        <PhoneInput
          value="+12345678900"
          defaultCountry="us"
          forceDialCode
          onChange={onChange}
        />,
      );
      expect(getInput().value).toBe('+1 (234) 567-8900');
      expect(onChange.mock.calls.length).toBe(0);

      fireEvent.change(getInput(), { target: { value: '' } });
      expect(getInput().value).toBe('+1 ');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');

      fireEvent.change(getInput(), { target: { value: '+' } });
      expect(getInput().value).toBe('+1 ');
      expect(onChange.mock.calls.length).toBe(1); // not changed

      fireEvent.change(getInput(), { target: { value: '+21' } });
      expect(getInput().value).toBe('+1 ');
      expect(onChange.mock.calls.length).toBe(1); // not changed
    });

    test('should allow change dial code with country selector', () => {
      render(
        <PhoneInput value="12345678900" defaultCountry="us" forceDialCode />,
      );
      expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
      expect(getInput().value).toBe('+1 (234) 567-8900');

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ua'));
      });
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ua');
      expect(getInput().value).toBe('+380 ');
    });

    test('allow dial code change if a new phone was pasted', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(
        <PhoneInput defaultCountry="us" forceDialCode onChange={onChange} />,
      );
      expect(getInput().value).toBe('+1 ');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');

      setCursorPosition(0, getInput().value.length);
      getInput().focus();
      await user.paste('38099');
      expect(getInput().value).toBe('+380 (99) ');
      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+38099');

      setCursorPosition(0, getInput().value.length);
      getInput().focus();
      await user.paste('+38099');
      expect(getInput().value).toBe('+380 (99) ');
      expect(onChange.mock.calls.length).toBe(2); // not changed

      // insert after prefix
      setCursorPosition(1, getInput().value.length);
      getInput().focus();
      await user.paste('48 123-456-789');
      expect(getInput().value).toBe('+48 123-456-789');
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('+48123456789');
    });
  });

  describe('disableDialCodeAndPrefix', () => {
    test('should return valid phone in onChange callback', async () => {
      const onChange = jest.fn();

      render(
        <PhoneInput
          defaultCountry="us"
          disableDialCodeAndPrefix
          onChange={onChange}
        />,
      );

      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+1');
      expect(getInput().value).toBe('');

      fireEvent.change(getInput(), { target: { value: '2345' } });
      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+12345');
      expect(getInput().value).toBe('(234) 5');

      fireEvent.change(getInput(), { target: { value: '' } });
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('+1');
      expect(getInput().value).toBe('');

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ua'));
      });

      expect(onChange.mock.calls.length).toBe(4);
      expect(onChange.mock.calls[3][0]).toBe('+380');
      expect(getInput().value).toBe('');
    });

    test('should not include dial code inside input', () => {
      render(<PhoneInput defaultCountry="us" disableDialCodeAndPrefix />);
      fireEvent.change(getInput(), { target: { value: '+11234567890' } });
      expect(getInput().value).toBe('(123) 456-7890');

      fireEvent.change(getInput(), { target: { value: '' } });
      expect(getInput().value).toBe('');

      fireEvent.change(getInput(), { target: { value: '+123' } });
      expect(getInput().value).toBe('(23');
    });

    test('should ignore forceDialCode', () => {
      render(
        <PhoneInput
          defaultCountry="us"
          disableDialCodeAndPrefix
          forceDialCode
        />,
      );
      fireEvent.change(getInput(), { target: { value: '1234567890' } });
      expect(getInput().value).toBe('(123) 456-7890');
      fireEvent.change(getInput(), { target: { value: '' } });
      expect(getInput().value).toBe('');
      fireEvent.change(getInput(), { target: { value: '38099' } });
      expect(getInput().value).toBe('(380) 99');
    });

    test('should not guess country if typed value with prefix', async () => {
      const user = userEvent.setup();

      render(<PhoneInput defaultCountry="us" disableDialCodeAndPrefix />);
      await user.type(getInput(), '1234567890');
      expect(getInput().value).toBe('(123) 456-7890');

      await user.clear(getInput());
      expect(getInput().value).toBe('');

      await user.type(getInput(), '+38099');
      expect(getInput().value).toBe('(380) 99');
    });
  });

  describe('showDisabledDialCodeAndPrefix', () => {
    test('should show dial code preview', () => {
      const { rerender } = render(
        <PhoneInput defaultCountry="us" disableDialCodeAndPrefix />,
      );
      fireEvent.change(getInput(), { target: { value: '1234567890' } });
      expect(getDialCodePreview()).toBeNull();

      rerender(
        <PhoneInput
          defaultCountry="us"
          disableDialCodeAndPrefix
          showDisabledDialCodeAndPrefix
        />,
      );
      expect(getDialCodePreview()).toBeVisible();
      expect(getDialCodePreview()?.textContent).toBe('+1');
    });

    test('should not include dial code in input field', async () => {
      const user = userEvent.setup();

      render(
        <PhoneInput
          defaultCountry="us"
          disableDialCodeAndPrefix
          showDisabledDialCodeAndPrefix
        />,
      );

      expect(getDialCodePreview()).toBeVisible();
      expect(getDialCodePreview()?.textContent).toBe('+1');
      expect(getInput().value).toBe('');

      await user.type(getInput(), '234567');
      expect(getInput().value).toBe('(234) 567-');

      await user.keyboard('{Backspace>10/}');
      expect(getDialCodePreview()?.textContent).toBe('+1');
      expect(getInput().value).toBe('');
    });

    test('should change country with country-selector', async () => {
      render(
        <PhoneInput
          defaultCountry="us"
          disableDialCodeAndPrefix
          showDisabledDialCodeAndPrefix
        />,
      );

      expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
      expect(getDialCodePreview()?.textContent).toBe('+1');
      expect(getInput().value).toBe('');

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ua'));
      });
      expect(getCountrySelector()).toHaveAttribute('data-country', 'ua');
      expect(getDialCodePreview()?.textContent).toBe('+380');
      expect(getInput().value).toBe('');
    });

    test('should not work without disableDialCodeAndPrefix', async () => {
      const { rerender } = render(
        <PhoneInput defaultCountry="us" showDisabledDialCodeAndPrefix />,
      );

      expect(getDialCodePreview()).toBeNull();
      expect(getInput().value).toBe('+1 ');

      rerender(
        <PhoneInput
          defaultCountry="us"
          disableDialCodeAndPrefix
          showDisabledDialCodeAndPrefix
        />,
      );

      expect(getDialCodePreview()).toBeVisible();
    });
  });

  describe('undo/redo', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    test('should support undo on ctrl+z', () => {
      render(<PhoneInput defaultCountry="us" value="+1234" />);
      increaseSystemTime();

      fireChangeEvent('1234567890');
      increaseSystemTime();

      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: false,
      });

      expect(getInput().value).toBe('+1 (234) ');

      fireChangeEvent('123456');
      increaseSystemTime();

      fireChangeEvent('12345678');
      increaseSystemTime();

      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: false,
      });
      expect(getInput().value).toBe('+1 (234) 56');

      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: false,
      });
      expect(getInput().value).toBe('+1 (234) ');

      // not valid event
      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: false,
        shiftKey: false,
      });
      expect(getInput().value).toBe('+1 (234) ');
    });

    test('should support redo on ctrl+shift+z', () => {
      render(<PhoneInput defaultCountry="us" value="+1234" />);
      increaseSystemTime();

      fireChangeEvent('1234567890');
      increaseSystemTime();

      fireChangeEvent('12345678');
      increaseSystemTime();

      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: false,
      });
      expect(getInput().value).toBe('+1 (234) 567-890');

      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: true,
        shiftKey: true,
      });
      expect(getInput().value).toBe('+1 (234) 567-8');

      // not valid event
      fireEvent.keyDown(getInput(), {
        key: 'Z',
        code: 'KeyZ',
        ctrlKey: false,
        shiftKey: true,
      });
      expect(getInput().value).toBe('+1 (234) 567-8');
    });
  });

  describe('countries modification', () => {
    test('should support countries filtering', () => {
      const countries = defaultCountries.filter((country) => {
        const { iso2 } = parseCountry(country);
        return ['us', 'ua', 'cz'].includes(iso2);
      });

      const onChange = jest.fn();

      render(
        <PhoneInput
          defaultCountry="us"
          value="+1234"
          countries={countries}
          onChange={onChange}
        />,
      );

      expect(getCountrySelectorDropdown().childNodes.length).toBe(
        countries.length,
      );

      expect(onChange.mock.calls.length).toBe(0);

      fireChangeEvent('44444');

      // not supported country was not set (+44 should set uk by default)
      expect(getInput().value).toBe('+4 (444) 4');
      expect(getCountrySelector()).toHaveAttribute('title', 'United States');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toBe('+44444');
      expect(onChange.mock.calls[0][1].country.iso2).toBe('us');

      fireChangeEvent('+1 (204) 555-5555');
      expect(getInput().value).toBe('+1 (204) 555-5555');
      expect(getCountrySelector()).toHaveAttribute('title', 'United States'); // not change to canada
      expect(onChange.mock.calls.length).toBe(2);
      expect(onChange.mock.calls[1][0]).toBe('+12045555555');
      expect(onChange.mock.calls[1][1].country.iso2).toBe('us');

      fireChangeEvent('420123');
      expect(getInput().value).toBe('+420 123 ');
      expect(getCountrySelector()).toHaveAttribute('title', 'Czech Republic');
      expect(onChange.mock.calls.length).toBe(3);
      expect(onChange.mock.calls[2][0]).toBe('+420123');
      expect(onChange.mock.calls[2][1].country.iso2).toBe('cz');

      fireChangeEvent('555555');
      expect(getInput().value).toBe('+555 555 ');
      expect(getCountrySelector()).toHaveAttribute('title', 'Czech Republic');
      expect(onChange.mock.calls.length).toBe(4);
      expect(onChange.mock.calls[3][0]).toBe('+555555');
      expect(onChange.mock.calls[3][1].country.iso2).toBe('cz');
    });

    test('should support country change', () => {
      const countries = defaultCountries.map((country) => {
        const parsedCountry = parseCountry(country);
        if (parsedCountry.iso2 === 'ua') {
          return buildCountryData({
            ...parsedCountry,
            format: '(..) ... ....',
          });
        }
        return country;
      });

      render(
        <PhoneInput
          defaultCountry="ua"
          value="+380(99)9999999"
          countries={countries}
        />,
      );
      expect(getInput().value).toBe('+380 (99) 999 9999');
    });
  });

  describe('preferred countries', () => {
    test('should display preferred countries on top', () => {
      render(<PhoneInput preferredCountries={['us', 'gb']} />);

      expect(getCountrySelectorDropdown().childNodes[0]).toBe(
        getDropdownOption('us'),
      );
      expect(getCountrySelectorDropdown().childNodes[1]).toBe(
        getDropdownOption('gb'),
      );
      expect(getCountrySelectorDropdown().childNodes.length).toBe(
        defaultCountries.length + 1, // sections divider included
      );
    });

    test('should ignore invalid preferred countries', () => {
      render(<PhoneInput preferredCountries={['xxx', 'us']} />);

      expect(getCountrySelectorDropdown().childNodes[0]).toBe(
        getDropdownOption('us'),
      );
    });
  });

  describe('cursor position', () => {
    const user = userEvent.setup({ delay: null });

    const getCursorPosition = () => {
      return getInput().selectionStart;
    };

    test('should handle cursor when typing (end)', async () => {
      render(<PhoneInput value="+1" defaultCountry="us" />);
      expect(getInput().value).toBe('+1 ');
      expect(getCursorPosition()).toBe('+1 '.length);

      await user.type(getInput(), '2');
      expect(getInput().value).toBe('+1 (2');
      expect(getCursorPosition()).toBe('+1 (2'.length);

      await user.type(getInput(), '34');
      expect(getInput().value).toBe('+1 (234) ');
      expect(getCursorPosition()).toBe('+1 (234) '.length);
    });

    test('should handle cursor when typing (start)', async () => {
      render(<PhoneInput value="+1" defaultCountry="us" />);

      await user.type(getInput(), '1', { initialSelectionStart: '+'.length });
      expect(getInput().value).toBe('+1 (1');
      expect(getCursorPosition()).toBe('+1 ('.length);

      await user.type(getInput(), '3', { initialSelectionStart: '+'.length });
      expect(getInput().value).toBe('+31 1');
      expect(getCursorPosition()).toBe('+3'.length);

      await user.type(getInput(), '3', { initialSelectionStart: ''.length });
      expect(getInput().value).toBe('+33 1 1');
      expect(getCursorPosition()).toBe('+3'.length);
    });

    test('should handle cursor when typing (middle)', async () => {
      render(<PhoneInput value="+1 (234)" defaultCountry="us" />);

      await user.type(getInput(), '9', {
        initialSelectionStart: '+1 ('.length,
      });
      expect(getInput().value).toBe('+1 (923) 4');
      expect(getCursorPosition()).toBe('+1 (9'.length);

      await user.type(getInput(), '9', {
        initialSelectionStart: '+1 (923'.length,
      });
      expect(getInput().value).toBe('+1 (923) 94');
      expect(getCursorPosition()).toBe('+1 (923) 9'.length);
    });

    test('should handle cursor on insertion', async () => {
      render(<PhoneInput value="+1 (234)" defaultCountry="us" />);
      getInput().focus();

      setCursorPosition('+1'.length);
      await user.paste('9999');
      expect(getInput().value).toBe('+1 (999) 923-4');
      expect(getCursorPosition()).toBe('+1 (999) 9'.length);

      setCursorPosition(0, getInput().value.length);
      await user.paste('38099');
      expect(getInput().value).toBe('+380 (99) ');
      expect(getCursorPosition()).toBe('+380 (99) '.length);
    });

    test('should handle backspace key', async () => {
      render(<PhoneInput value="+1 (111) 111-11" defaultCountry="us" />);
      getInput().focus();

      await user.type(getInput(), '{backspace}', {
        initialSelectionStart: '+1 (111) 111-11'.length,
      });
      expect(getInput().value).toBe('+1 (111) 111-1');
      expect(getCursorPosition()).toBe('+1 (111) 111-1'.length);

      await user.type(getInput(), '{backspace}', {
        initialSelectionStart: '+1 (111) 111-1'.length,
      });
      expect(getInput().value).toBe('+1 (111) 111');
      expect(getCursorPosition()).toBe('+1 (111) 111'.length);

      await user.type(getInput(), '{backspace}', {
        initialSelectionStart: '+1 (111'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 (11'.length);

      // Should just move cursor when set on non-digit symbol
      await user.type(getInput(), '{backspace}', {
        initialSelectionStart: '+1 (111) '.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 (111'.length);

      await user.type(getInput(), '{backspace}', {
        initialSelectionStart: '+1 (111)'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 (111'.length);

      await user.type(getInput(), '{backspace}', {
        initialSelectionStart: '+'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+'.length);
    });

    test('should handle delete key', async () => {
      render(<PhoneInput value="+1 (111) 111-11" defaultCountry="us" />);
      getInput().focus();

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+'.length,
      });
      expect(getInput().value).toBe('+1 (111) 111-1');
      expect(getCursorPosition()).toBe('+'.length);

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+1 (111) 1'.length,
      });
      expect(getInput().value).toBe('+1 (111) 111-');
      expect(getCursorPosition()).toBe('+1 (111) 1'.length);

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+1 (111) 11'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 (111) 11'.length);

      // Should just move cursor when set on non-digit symbol
      await user.type(getInput(), '{delete}', {
        initialSelectionStart: ''.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+'.length);

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+1'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 ('.length);

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+1 '.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 ('.length);

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+1 (111'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 (111) '.length);

      await user.type(getInput(), '{delete}', {
        initialSelectionStart: '+1 (111)'.length,
      });
      expect(getInput().value).toBe('+1 (111) 11');
      expect(getCursorPosition()).toBe('+1 (111) '.length);
    });
  });

  describe('autofocus', () => {
    test('should set focus on input', () => {
      const { rerender } = render(
        <PhoneInput defaultCountry="us" inputProps={{ autoFocus: true }} />,
      );
      expect(getInput()).toHaveFocus();

      // unset focus
      getInput().blur();

      rerender(<PhoneInput defaultCountry="us" />);
      expect(getInput()).not.toHaveFocus();
    });

    test('should set cursor to the end', async () => {
      render(
        <PhoneInput
          value="+31 "
          defaultCountry="nl"
          inputProps={{ autoFocus: true }}
        />,
      );

      expect(getInput().selectionStart).toBe('+31 '.length);
      expect(getInput().selectionEnd).toBe('+31 '.length);

      // Need to check next tick because of realization
      await new Promise((r) => setTimeout(r, 0));
      expect(getInput().selectionStart).toBe('+31 '.length);
      expect(getInput().selectionEnd).toBe('+31 '.length);
    });
  });

  test('should use default mask if country data does not have mask', () => {
    // mask is undefined
    const { rerender } = render(<PhoneInput defaultCountry="af" />);
    fireChangeEvent('+93114567');
    expect(getInput().value).toBe('+93 114567');
    expect(getCountrySelector()).toHaveAttribute('data-country', 'af');

    // mask is empty string
    rerender(<PhoneInput defaultCountry="gr" />);
    fireChangeEvent('+301234567');
    expect(getInput().value).toBe('+30 1234567');
    expect(getCountrySelector()).toHaveAttribute('data-country', 'gr');
  });

  test('should display input value on every country', () => {
    render(
      <PhoneInput defaultCountry={parseCountry(defaultCountries[0]).iso2} />,
    );

    for (const c of defaultCountries) {
      const country = parseCountry(c);

      // change country using dropdown
      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption(country.iso2));
      });

      const userInput = '999999';
      const inputValue = `${country.dialCode}${userInput}`;
      fireChangeEvent(inputValue);

      expect(removeNonDigits(getInput().value)).toBe(inputValue);

      const countryInSelector = getCountry({
        field: 'iso2',
        value: getCountrySelector().getAttribute('data-country') || '',
        countries: defaultCountries,
      });

      expect(country.dialCode === countryInSelector?.dialCode).toBe(true);
    }
  });

  describe('custom flags', () => {
    test('should render custom flag-images from flags prop', () => {
      const flagSrc = 'test/flag.svg';
      render(<PhoneInput flags={[{ iso2: 'us', src: flagSrc }]} />);

      expect(getCountrySelectorFlag()).toHaveAttribute('src', flagSrc);
    });
  });

  describe('custom flag component', () => {
    test('should render custom flag component from flags prop', () => {
      const flagComponent = () => <span>custom-flag</span>;
      render(<PhoneInput flags={flagComponent} />);

      const element = screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'span' &&
          element?.parentElement?.tagName.toLowerCase() === 'div' &&
          element?.parentElement?.parentElement?.tagName.toLowerCase() === 'button'
        );
      }) as HTMLLIElement;

      expect(element).toHaveTextContent('custom-flag');
    });
  });

  describe('disableFormatting', () => {
    test('should remove mask chars from input if disableFormatting is set to true', async () => {
      const user = userEvent.setup({ delay: null });

      render(<PhoneInput disableFormatting />);
      expect(getInput().value).toBe('+1 ');

      await user.type(getInput(), '1234');
      expect(getInput().value).toBe('+1 1234');
      await user.type(getInput(), '5678');
      expect(getInput().value).toBe('+1 12345678');
      await user.type(getInput(), '9000');
      expect(getInput().value).toBe('+1 1234567890');

      await user.clear(getInput());
      expect(getInput().value).toBe('');
      await user.type(getInput(), '+1 (123) 456-7890');
      expect(getInput().value).toBe('+1 1234567890');
    });

    test('should handle default mask', async () => {
      const user = userEvent.setup({ delay: null });

      render(<PhoneInput disableFormatting defaultMask="(...) ... ... ..." />);

      await user.clear(getInput());

      await user.type(getInput(), '+355123456789000');
      expect(getInput().value).toBe('+355 123456789000');
    });

    test('should work with charAfterDialCode prop', async () => {
      const user = userEvent.setup({ delay: null });

      render(<PhoneInput disableFormatting charAfterDialCode="" />);
      expect(getInput().value).toBe('+1');

      await user.type(getInput(), '1234567890');
      expect(getInput().value).toBe('+11234567890');

      await user.clear(getInput());
      expect(getInput().value).toBe('');

      await user.type(getInput(), '+1 (123) 456-7890');
      expect(getInput().value).toBe('+11234567890');
    });
  });

  describe('ref forwarding', () => {
    test('should forward ref to input element', async () => {
      const ref = React.createRef<PhoneInputRefType>();

      expect(ref.current).toBeNull();
      render(<PhoneInput ref={ref} />);
      expect(ref.current).not.toBeNull();
      expect(ref.current?.value).toBe(getInput().value);
      expect(ref.current?.tagName.toLowerCase()).toBe('input');
    });

    test('should support custom setCountry method', async () => {
      const logSpy = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => null);

      const ref = React.createRef<PhoneInputRefType>();

      render(<PhoneInput ref={ref} />);
      expect(getInput().value).toBe('+1 ');

      act(() => ref.current?.setCountry('ua'));
      expect(getInput().value).toBe('+380 ');

      // should log error if not valid country code provided
      act(() => ref.current?.setCountry('test-country'));
      expect(getInput().value).toBe('+380 ');

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        '[react-international-phone]: can not find a country with "test-country" iso2 code',
      );
      logSpy.mockRestore();
    });

    test('should support custom state property', async () => {
      const ref = React.createRef<PhoneInputRefType>();

      render(<PhoneInput ref={ref} />);
      expect(getInput().value).toBe('+1 ');

      expect(ref.current?.state).toMatchObject({
        phone: '+1',
        inputValue: '+1 ',
        country: getCountry({ field: 'iso2', value: 'us' }),
      });

      act(() => ref.current?.setCountry('ua'));
      expect(ref.current?.state).toMatchObject({
        phone: '+380',
        inputValue: '+380 ',
        country: getCountry({ field: 'iso2', value: 'ua' }),
      });

      fireChangeEvent('+1 (204) 555-5555');
      expect(ref.current?.state).toMatchObject({
        phone: '+12045555555',
        inputValue: '+1 (204) 555-5555',
        country: getCountry({ field: 'iso2', value: 'ca' }),
      });
    });
  });

  describe('disableFocusAfterCountrySelect', () => {
    test('should focus on input if disableFocusAfterCountrySelect is not provided', async () => {
      render(<PhoneInput />);

      expect(getInput().value).toBe('+1 ');

      getInput().focus();
      expect(getInput()).toHaveFocus();

      // remove focus from input
      (document.activeElement as HTMLElement).blur();

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ua'));
      });

      await Promise.resolve();

      expect(getInput()).toHaveFocus();
    });

    test('should not focus on input if disableFocusAfterCountrySelect is true', async () => {
      render(<PhoneInput disableFocusAfterCountrySelect />);

      expect(getInput().value).toBe('+1 ');

      getInput().focus();
      expect(getInput()).toHaveFocus();

      // remove focus from input
      (document.activeElement as HTMLElement)?.blur();

      act(() => {
        fireEvent.click(getCountrySelector());
        fireEvent.click(getDropdownOption('ua'));
      });

      await Promise.resolve();

      expect(getInput()).not.toHaveFocus();
    });
  });
});
