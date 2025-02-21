# Using with UI libraries

You can build phone input by combination of **input component** (that you want to be a phone input), [**usePhoneInput**](./usePhoneInput) hook and [**CountrySelector**](../Subcomponents%20API/CountrySelector).

**Ant Design** and **Chakra UI** examples can be found [on GitHub](https://github.com/ybrusentsov/react-international-phone/tree/master/src/stories/UiLibsExample/components) and demos for these code snippets can be found [on Storybook](https://react-international-phone-storybook.vercel.app/?path=/story/using-with-ui-libs).

## Material UI Example

import { MuiPhone } from '@site/src/components/MuiPhone'
import { useState } from 'react'

export const PhoneComponentWrapper = () => {
const [value, setValue] = useState('');
return <MuiPhone value={value} onChange={setValue}/>
};

<div style={{ margin: "3rem 0 2rem" }}>
  <PhoneComponentWrapper />
</div>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="jsx" label="JavaScript">

```jsx
import 'react-international-phone/style.css';

import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

export const MuiPhone = ({ value, onChange, ...restProps }) => {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value)}
              renderValue={(value) => (
                <FlagImage iso2={value} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};
```

  </TabItem>

  <TabItem value="tsx" label="TypeScript">

```tsx
import 'react-international-phone/style.css';

import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => (
                <FlagImage iso2={value} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};
```

  </TabItem>

</Tabs>

## Tailwind UI + Headless Example

import { TailwindHeadlessUIPhone } from '@site/src/components/Tailwind/TailwindHeadlessUIPhone.tsx'

export const PhoneTailwindComponentWrapper = () => {
const [value, setValue] = useState('');
return <TailwindHeadlessUIPhone value={value} onChange={setValue}/>
};

<div style={{ margin: "3rem 0 2rem" }}>
  <PhoneTailwindComponentWrapper />
</div>

```tsx
import { Menu } from '@headlessui/react';
import React from 'react';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import 'react-international-phone/style.css';

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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
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
```