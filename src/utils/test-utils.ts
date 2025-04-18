import { screen } from '@testing-library/react';

import { buildClassNames } from '../style/buildClassNames';
import { CountryIso2 } from '../types';

export const getInput = () => {
  return screen.getByRole('phone-input') as HTMLInputElement;
};

export const getSearchInput = () =>
  screen.getByText(
    (content, element) =>
      element?.tagName.toLowerCase() === 'input' &&
      element?.className.includes('search-input'),
  ) as HTMLInputElement;

export const getCountrySelector = () => screen.getByRole('combobox');

export const getCountrySelectorDropdown = () => {
  return document.querySelector(
    '.' +
      buildClassNames({
        addPrefix: ['country-selector-dropdown'],
        rawClassNames: [],
      }),
  ) as HTMLDivElement;
};

export const getCountrySelectorDropdownUl = () =>
  screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'ul';
  }) as HTMLUListElement;

export const getDropdownOption = (country: CountryIso2) =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'li' &&
      element.getAttribute('data-country') === country
    );
  }) as HTMLLIElement;

export const getCountrySelectorFlag = () =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'img' &&
      element?.parentElement?.tagName.toLowerCase() === 'div' &&
      element?.parentElement?.parentElement?.tagName.toLowerCase() === 'button'
    );
  }) as HTMLLIElement;

export const getDropdownArrow = () => {
  try {
    return screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element?.className.includes('dropdown-arrow')
      );
    }) as HTMLDivElement;
  } catch (error) {
    return null;
  }
};

export const getDialCodePreview = () => {
  try {
    return screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element?.className.includes('dial-code-preview')
      );
    }) as HTMLDivElement;
  } catch (error) {
    return null;
  }
};

export const getCountryFlag = (country: CountryIso2) =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'img' &&
      element.getAttribute('data-country') === country
    );
  }) as HTMLLIElement;

export const mockScrollIntoView = () => {
  const mock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = mock;

  return mock;
};

/**
 * Make sure that `jest.useFakeTimers()` is called before use
 */
export const increaseSystemTime = (ms = 1000) => jest.advanceTimersByTime(ms);
