import './CountrySelectorDropdown.style.scss';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { defaultCountries } from '../../data/countryData';
import { buildClassNames } from '../../style/buildClassNames';
import {
  CountryData,
  CountryIso2,
  CustomFlagImage,
  ParsedCountry,
} from '../../types';
import { parseCountry, scrollToChild } from '../../utils';
import { FlagImage } from '../FlagImage/FlagImage';

const SEARCH_DEBOUNCE_MS = 1000;

export interface CountrySelectorDropdownStyleProps {
  style?: React.CSSProperties;
  className?: string;

  listItemStyle?: React.CSSProperties;
  listItemClassName?: string;

  listItemFlagStyle?: React.CSSProperties;
  listItemFlagClassName?: string;

  listItemCountryNameStyle?: React.CSSProperties;
  listItemCountryNameClassName?: string;

  listItemDialCodeStyle?: React.CSSProperties;
  listItemDialCodeClassName?: string;

  preferredListDividerStyle?: React.CSSProperties;
  preferredListDividerClassName?: string;

  searchContainerStyle?: React.CSSProperties;
  searchContainerClassName?: string;

  searchInputStyle?: React.CSSProperties;
  searchInputClassName?: string;
}

export interface CountrySelectorDropdownProps
  extends CountrySelectorDropdownStyleProps {
  show: boolean;
  dialCodePrefix?: string;
  selectedCountry: CountryIso2;
  countries?: CountryData[];
  preferredCountries?: CountryIso2[];
  flags?: CustomFlagImage[];
  onSelect?: (country: ParsedCountry) => void;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  noResultsMessage?: React.ReactNode;
  onClose?: () => void;
}

export const CountrySelectorDropdown: React.FC<
  CountrySelectorDropdownProps
> = ({
  show,
  dialCodePrefix = '+',
  selectedCountry,
  countries = defaultCountries,
  preferredCountries = [],
  flags,
  onSelect,
  enableSearch = true,
  searchPlaceholder = 'Search countries or dial codes...',
  noResultsMessage = 'No results found',
  onClose,
  ...styleProps
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const lastScrolledCountry = useRef<CountryIso2>();
  const [searchQuery, setSearchQuery] = useState('');

  const orderedCountries = useMemo<CountryData[]>(() => {
    if (!preferredCountries || !preferredCountries.length) {
      return countries;
    }

    const preferred: CountryData[] = [];
    const rest = [...countries];

    for (const iso2 of preferredCountries) {
      const index = rest.findIndex((c) => parseCountry(c).iso2 === iso2);

      if (index !== -1) {
        const preferredCountry = rest.splice(index, 1)[0];
        preferred.push(preferredCountry);
      }
    }

    return preferred.concat(rest);
  }, [countries, preferredCountries]);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return orderedCountries;

    return orderedCountries.filter((country) => {
      const parsedCountry = parseCountry(country);
      return (
        parsedCountry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsedCountry.dialCode.includes(searchQuery)
      );
    });
  }, [orderedCountries, searchQuery]);

  const searchRef = useRef<{
    updatedAt: Date | undefined;
    value: string;
  }>({ updatedAt: undefined, value: '' });

  const updateSearch = (newChar: string) => {
    const isSearchDelayPassed =
      searchRef.current.updatedAt &&
      new Date().getTime() - searchRef.current.updatedAt.getTime() >
        SEARCH_DEBOUNCE_MS;

    searchRef.current = {
      value: isSearchDelayPassed
        ? newChar
        : `${searchRef.current.value}${newChar}`,
      updatedAt: new Date(),
    };

    const searchedCountryIndex = filteredCountries.findIndex((c) =>
      parseCountry(c).name.toLowerCase().startsWith(searchRef.current.value),
    );

    // focus to searched country
    if (searchedCountryIndex !== -1) {
      setFocusedItemIndex(searchedCountryIndex);
    }
  };

  const getCountryIndex = useCallback(
    (country: CountryIso2) => {
      return filteredCountries.findIndex(
        (c) => parseCountry(c).iso2 === country,
      );
    },
    [filteredCountries],
  );

  const [focusedItemIndex, setFocusedItemIndex] = useState(
    getCountryIndex(selectedCountry),
  );

  const resetFocusedItemIndex = () => {
    if (lastScrolledCountry.current === selectedCountry) return;
    setFocusedItemIndex(getCountryIndex(selectedCountry));
  };

  const handleCountrySelect = useCallback(
    (country: ParsedCountry) => {
      setFocusedItemIndex(getCountryIndex(country.iso2));
      onSelect?.(country);
    },
    [onSelect, getCountryIndex],
  );

  const moveFocusedItem = (to: 'prev' | 'next' | 'first' | 'last') => {
    const lastPossibleIndex = filteredCountries.length - 1;

    const getNewIndex = (currentIndex: number) => {
      if (to === 'prev') return currentIndex - 1;
      if (to === 'next') return currentIndex + 1;
      if (to === 'last') return lastPossibleIndex;
      return 0;
    };

    setFocusedItemIndex((v) => {
      const newIndex = getNewIndex(v);
      if (newIndex < 0) return 0;
      if (newIndex > lastPossibleIndex) return lastPossibleIndex;
      return newIndex;
    });
  };

  // Input field keyboard event handler
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Escape key in search input
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose?.();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      // Transfer focus to the list and allow arrow navigation
      e.preventDefault();
      if (focusList()) {
        // Handle the current key press in the list
        if (e.key === 'ArrowDown') {
          moveFocusedItem('next');
        } else if (e.key === 'ArrowUp') {
          moveFocusedItem('prev');
        }
      }
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Handle regular Tab key to move focus to the list
      e.preventDefault();
      focusList();
    } else if (e.key === 'Tab' && e.shiftKey) {
      // close dropdown when shift+tab is pressed
      onClose?.();
    }
  };

  // List keyboard event handler
  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCountries.length > 0 && focusedItemIndex >= 0) {
        const focusedCountry = parseCountry(
          filteredCountries[focusedItemIndex],
        );
        handleCountrySelect(focusedCountry);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      // Pass close event to parent component
      onClose?.();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // If already at the first item and search is enabled, move focus back to search input
      if (focusedItemIndex <= 0 && enableSearch) {
        focusSearchInput();
        return;
      }
      moveFocusedItem('prev');
      return;
    }

    if (e.key === 'Tab') {
      // If search is enabled and Shift+Tab is pressed, move focus back to search input
      if (e.shiftKey && enableSearch) {
        e.preventDefault();
        focusSearchInput();
        return;
      } else if (!e.shiftKey) {
        // If Tab is pressed without Shift, close the dropdown
        e.preventDefault();
        onClose?.();
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocusedItem('next');
      return;
    }

    if (e.key === 'PageUp') {
      e.preventDefault();
      moveFocusedItem('first');
      return;
    }

    if (e.key === 'PageDown') {
      e.preventDefault();
      moveFocusedItem('last');
      return;
    }

    if (e.key === ' ') {
      // prevent scrolling with space
      e.preventDefault();
    }

    if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      updateSearch(e.key.toLocaleLowerCase());
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Reset focused item index when search query changes
    if (filteredCountries.length > 0) {
      setFocusedItemIndex(0);
    }
  };

  const scrollToFocusedCountry = useCallback(() => {
    if (
      !listRef.current ||
      focusedItemIndex === undefined ||
      filteredCountries.length === 0
    )
      return;

    const focusedCountry = parseCountry(
      filteredCountries[focusedItemIndex],
    ).iso2;
    if (focusedCountry === lastScrolledCountry.current) return;

    const element = listRef.current.querySelector(
      `[data-country="${focusedCountry}"]`,
    );
    if (!element) return;
    scrollToChild(listRef.current, element as HTMLElement);

    lastScrolledCountry.current = focusedCountry;
  }, [focusedItemIndex, filteredCountries]);

  // Scroll to focused item on change
  useEffect(() => {
    scrollToFocusedCountry();
  }, [focusedItemIndex, scrollToFocusedCountry]);

  // Focus and keyboard navigation management
  const focusSearchInput = useCallback(() => {
    const searchInput = document.querySelector(
      '.react-international-phone-country-selector-dropdown__search-input',
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      return true;
    }
    return false;
  }, []);

  const focusList = useCallback(() => {
    if (listRef.current) {
      listRef.current.focus();
      return true;
    }
    return false;
  }, []);

  // Dropdown show/hide effect
  useEffect(() => {
    if (!listRef.current) return;
    if (show) {
      focusList();
    } else {
      resetFocusedItemIndex();
      setSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, focusSearchInput, focusList]);

  // Update focusedItemIndex on selectedCountry prop change
  useEffect(() => {
    resetFocusedItemIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // Reset search state on dropdown hide
  useEffect(() => {
    if (!show) {
      searchRef.current = { updatedAt: undefined, value: '' };
    }
  }, [show]);

  const hasPreferredDivider =
    preferredCountries && preferredCountries.length > 0;

  const listItems = filteredCountries.map((c, index) => {
    const country = parseCountry(c);

    const isLastPreferred =
      hasPreferredDivider && index === preferredCountries.length - 1;
    const isFocused = index === focusedItemIndex;

    return (
      <React.Fragment key={country.iso2}>
        <li
          data-country={country.iso2}
          data-testid={`${country.name} ${dialCodePrefix}${country.dialCode}`}
          role="option"
          aria-selected={country.iso2 === selectedCountry}
          className={buildClassNames({
            addPrefix: [
              'country-selector-dropdown__list-item',
              isFocused && 'country-selector-dropdown__list-item--focused',
              country.iso2 === selectedCountry &&
                'country-selector-dropdown__list-item--selected',
            ],
            rawClassNames: [styleProps.listItemClassName],
          })}
          style={styleProps.listItemStyle}
          onClick={() => handleCountrySelect(country)}
        >
          <FlagImage
            iso2={country.iso2}
            src={flags?.find((f) => f.iso2 === country.iso2)?.src}
            className={buildClassNames({
              addPrefix: ['country-selector-dropdown__list-item-flag-emoji'],
              rawClassNames: [styleProps.listItemFlagClassName],
            })}
            style={styleProps.listItemFlagStyle}
          />
          <span
            className={buildClassNames({
              addPrefix: ['country-selector-dropdown__list-item-country-name'],
              rawClassNames: [styleProps.listItemCountryNameClassName],
            })}
            style={styleProps.listItemCountryNameStyle}
          >
            {country.name}
          </span>
          <span
            data-dialcode={country.dialCode}
            className={buildClassNames({
              addPrefix: ['country-selector-dropdown__list-item-dial-code'],
              rawClassNames: [styleProps.listItemDialCodeClassName],
            })}
            style={styleProps.listItemDialCodeStyle}
          >
            {dialCodePrefix + country.dialCode}
          </span>
        </li>
        {isLastPreferred && (
          <li
            role="separator"
            className={buildClassNames({
              addPrefix: ['country-selector-dropdown__list-divider'],
              rawClassNames: [styleProps.preferredListDividerClassName],
            })}
            style={styleProps.preferredListDividerStyle}
          />
        )}
      </React.Fragment>
    );
  });

  return (
    <div
      className={buildClassNames({
        addPrefix: ['country-selector-dropdown'],
        rawClassNames: [styleProps.className],
      })}
      style={{ ...styleProps.style, display: show ? 'flex' : 'none' }}
      onMouseDown={(e) => {
        // Prevent losing focus when clicking on dropdown
        e.stopPropagation();
      }}
      onClick={(e) => {
        // Prevent triggering external onClick events
        e.stopPropagation();
      }}
    >
      {enableSearch && (
        <div
          className={buildClassNames({
            addPrefix: ['country-selector-dropdown__search-container'],
            rawClassNames: [styleProps.searchContainerClassName],
          })}
          style={styleProps.searchContainerStyle}
        >
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchInputChange}
            className={buildClassNames({
              addPrefix: ['country-selector-dropdown__search-input'],
              rawClassNames: [styleProps.searchInputClassName],
            })}
            style={styleProps.searchInputStyle}
            onClick={(e) => {
              // Prevent event bubbling that could cause dropdown to close
              e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={handleInputKeyDown}
          />
        </div>
      )}
      <ul
        role="listbox"
        tabIndex={0}
        className={buildClassNames({
          addPrefix: ['country-selector-dropdown__list'],
          rawClassNames: [],
        })}
        ref={listRef}
        onKeyDown={handleListKeyDown}
        style={{ outline: 'none' }}
      >
        {filteredCountries.length > 0 ? (
          listItems
        ) : (
          <li
            className={buildClassNames({
              addPrefix: ['country-selector-dropdown__no-results'],
              rawClassNames: [],
            })}
          >
            {noResultsMessage}
          </li>
        )}
      </ul>
    </div>
  );
};
