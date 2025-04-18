import { queries, userEvent, within } from '@storybook/testing-library';

import { CountryIso2, getCountry } from '../../index';

export class StorybookTestUtils {
  canvas: ReturnType<typeof within<typeof queries>>;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  getPhoneInput = () => {
    const phoneInput: HTMLInputElement = this.canvas.getByRole('phone-input');
    return phoneInput;
  };

  getByPlaceholder = (placeholder: string) => {
    return this.canvas.getByPlaceholderText(placeholder);
  };

  getCountrySelector = () => {
    return this.canvas.getByRole('combobox');
  };

  getCountryDropdownOption = (country: CountryIso2) => {
    const fullCountry = getCountry({ field: 'iso2', value: country });
    // `${fullCountry?.name} +${fullCountry?.dialCode}`,
    return this.canvas.getByTestId(
      `${fullCountry?.name} +${fullCountry?.dialCode}`,
    );
  };

  getSelectedCountry = () => {
    const countrySelector = this.getCountrySelector();
    return countrySelector.getAttribute('data-country');
  };

  selectCountry = async (country: CountryIso2) => {
    const countrySelector = this.getCountrySelector();
    await userEvent.click(countrySelector);

    const option = this.getCountryDropdownOption(country);

    await userEvent.click(option);
  };

  getCursorSelection = () => {
    const phoneInput = this.getPhoneInput();
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;

    return {
      start,
      end,
    };
  };

  getCursorPosition = () => {
    const { start, end } = this.getCursorSelection();
    return start === end ? start : undefined;
  };

  setCursorSelection = (start: number, end: number) => {
    const phoneInput = this.getPhoneInput();
    phoneInput.selectionStart = start;
    phoneInput.selectionEnd = end;
  };

  setCursorPosition = (cursorPosition: number) => {
    const phoneInput = this.getPhoneInput();
    phoneInput.selectionStart = cursorPosition;
    phoneInput.selectionEnd = cursorPosition;
  };

  selectAll = () => {
    const phoneInput = this.getPhoneInput();
    this.setCursorSelection(0, phoneInput.value.length);
  };

  pressBackspace = async (times = 1) => {
    return userEvent.keyboard(`{Backspace>${times}/}`);
  };

  pressDelete = async (times = 1) => {
    return userEvent.keyboard(`{Delete>${times}/}`);
  };
}
