import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  getCountrySelector,
  getCountrySelectorDropdown,
  getCountrySelectorFlag,
  getDropdownArrow,
  getDropdownOption,
  mockScrollIntoView,
} from '../../utils/test-utils';
import { CountrySelector } from './CountrySelector';

describe('CountrySelector', () => {
  const user = userEvent.setup();

  beforeAll(() => {
    mockScrollIntoView();
  });

  test('render CountrySelector', () => {
    render(<CountrySelector selectedCountry="ua" />);
    expect(getCountrySelector()).toBeVisible();
  });

  test('render country flag', () => {
    const { rerender } = render(<CountrySelector selectedCountry="ua" />);
    expect(getCountrySelectorFlag()).toBeVisible();
    expect(getCountrySelectorFlag()).toHaveAttribute('data-country', 'ua');
    rerender(<CountrySelector selectedCountry="es" />);
    expect(getCountrySelectorFlag()).toHaveAttribute('data-country', 'es');
  });

  test('open dropdown on click', () => {
    render(<CountrySelector selectedCountry="ua" />);
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
    expect(getDropdownOption('ua')).toBeVisible();
    expect(getDropdownOption('pl')).toBeVisible();
    expect(getDropdownOption('us')).toBeVisible();
  });

  test('change country with dropdown option', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <CountrySelector selectedCountry="ua" onSelect={onSelect} />,
    );
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
    fireEvent.click(getDropdownOption('pl'));
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Poland' });

    rerender(<CountrySelector selectedCountry="ua" />);
    fireEvent.click(getCountrySelector());
    fireEvent.click(getDropdownOption('pl'));
    // should not break if onSelect is not passed
    expect(getCountrySelector()).toBeVisible();
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('contain active class when open', async () => {
    render(<CountrySelector selectedCountry="ua" />);
    await user.click(getCountrySelector());
    expect(getCountrySelector().className).toMatch(/active/);
    expect(getDropdownArrow()?.className).toMatch(/active/);

    await user.click(document.body);
    expect(getCountrySelector().className).not.toMatch(/active/);
    expect(getDropdownArrow()?.className).not.toMatch(/active/);
  });

  test('close dropdown on click outside', async () => {
    render(<CountrySelector selectedCountry="ua" />);
    await user.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();

    await user.click(document.body);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('close dropdown on click while dropdown is open', async () => {
    render(<CountrySelector selectedCountry="ua" />);
    await user.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();

    await user.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('close dropdown on escape press', () => {
    render(<CountrySelector selectedCountry="us" />);
    fireEvent.click(getCountrySelector());
    fireEvent.focus(getDropdownOption('ua'));
    expect(getCountrySelectorDropdown()).toBeVisible();
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('select country option on enter press', async () => {
    const onSelect = jest.fn();
    render(<CountrySelector selectedCountry="us" onSelect={onSelect} />);
    await user.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
    await user.keyboard('{arrowup}{arrowup}{arrowup}{enter}');
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });
  });

  test('should set button wrapper with renderButtonWrapper', () => {
    render(
      <CountrySelector
        selectedCountry="us"
        renderButtonWrapper={({ children, rootProps }) => (
          <button {...rootProps} className="custom-wrapper">
            {children}
          </button>
        )}
      />,
    );

    expect(getCountrySelector()).toHaveClass('custom-wrapper');

    const countrySelector = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'button' &&
        element.className === 'custom-wrapper'
      );
    });

    expect(countrySelector).not.toBe(null);
    fireEvent.click(countrySelector);
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  describe('accessibility', () => {
    test('should open selector using enter', async () => {
      render(<CountrySelector selectedCountry="us" />);
      expect(getCountrySelectorDropdown()).not.toBeVisible();

      await user.tab();
      expect(getCountrySelector()).toHaveFocus();

      await user.keyboard('{enter}');
      expect(getCountrySelectorDropdown()).toBeVisible();
    });

    test('should open selector using arrow keys', async () => {
      const { rerender } = render(<CountrySelector selectedCountry="us" />);
      expect(getCountrySelectorDropdown()).not.toBeVisible();

      await user.tab();
      expect(getCountrySelector()).toHaveFocus();

      await user.keyboard('{arrowUp}');
      expect(getCountrySelectorDropdown()).toBeVisible();

      // move focus back
      await user.tab({ shift: true });

      rerender(<CountrySelector selectedCountry="us" />);
      expect(getCountrySelector()).toHaveFocus();
      expect(getCountrySelectorDropdown()).not.toBeVisible();

      await user.keyboard('{arrowDown}');
      expect(getCountrySelectorDropdown()).toBeVisible();
    });
  });

  describe('buttons props', () => {
    test('should set button id', () => {
      render(
        <CountrySelector
          selectedCountry="us"
          buttonProps={{ id: 'country-selector-button' }}
        />,
      );
      expect(getCountrySelector()).toHaveAttribute(
        'id',
        'country-selector-button',
      );
    });
  });
});
