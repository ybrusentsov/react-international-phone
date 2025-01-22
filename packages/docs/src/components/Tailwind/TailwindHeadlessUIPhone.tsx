/**
 * ! MuiPhone component is a copypaste of component -> src/stories/UiLibsExample/components/Tailwind
 * Make sure that the original component is updated if wanna make changes here
 */


import 'react-international-phone/style.css';

import { Menu } from '@headlessui/react';
import React from 'react';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';


export interface TailwindHeadlessUIPhoneProps  {
  value: string;
  onChange: (phone: string) => void;
}

export const TailwindHeadlessUIPhone: React.FC<TailwindHeadlessUIPhoneProps> = ({
  value,
  onChange,
}) => {

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <div className="flex items-start">
      <div className="flex flex-col">
        <Menu>
          <Menu.Button
            data-dropdown-toggle="dropdown-phone"
            className="z-10 inline-flex flex-shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
          >
            {({ open }) => (
              <>
                <FlagImage iso2={country.iso2} />
                {open && (
                  <span className="ml-1.5 text-left">
                    {country.name} (+{country.dialCode})
                  </span>
                )}
                <svg
                  className="ms-2.5 h-2.5 w-2.5 ml-1.5 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </>
            )}
          </Menu.Button>
          <Menu.Items className="z-10 h-48 w-52 divide-y divide-gray-100 overflow-y-auto rounded-lg bg-white shadow dark:bg-gray-700">
            {defaultCountries.map((c) => {
              const country = parseCountry(c);
              return (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className="inline-flex w-full px-4 py-2 "
                      role="menuitem"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setCountry(country.iso2);
                      }}
                    >
                      <div className="inline-flex items-center">
                        <FlagImage
                          iso2={country.iso2}
                          style={{ marginRight: '8px' }}
                        />
                        <span className="text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                        {country.name} (+{country.dialCode})
                        </span>
                      </div>
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>
      <label
        htmlFor="phone-input"
        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Phone number:
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="phone-input"
          className="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          placeholder="123-456-7890"
          value={inputValue}
          onChange={handlePhoneValueChange}
          ref={inputRef}
          required
        />
      </div>
    </div>
  );
};
