# Migrating from v3 to v4

:::caution Why is it important to update?

Version 3 becomes deprecated and unsupported since v4 is released. <br/>
New features and bug fixes will be pushed only to v4.

:::

## usePhoneInput return properties renamed

- `phone` is renamed to `inputValue`
- `e164Phone` is renamed to `phone`

Now `phone` stands for E.164 formatted phone, and `inputValue` stands for string that is rendered inside input element.

:::warning
The hook still returns the `phone` value, but its value purpose has been changed.<br/>
Please update values if you were using `usePhoneInput` hook.
:::

## Added support for multiple masks per country

Now country format mask can be dynamic, so country data type have been changed. You can check the new [Country Data Type](/docs/Usage/ModifyCountries#country-data-type).

## Switched to E.164 format

Now `onChange` callback returns phone in E.164 format by default. New `phone` return value was also provided to `usePhoneInput` hook.
E.164 format phone returned in callback even if `disabledDialCodeAndPrefix` was set to `true`.

## Second argument of onChange callback is now an object

`onChange` callback type is changed: <br/>
Before: `(phone: string, country: CountryIso2) => void`<br/>
After: `(phone: string, data: { country: ParsedCountry, inputValue: string }) => void`.

The second argument is now an object that contains additional information about the phone.

## usePhoneInput now returns country object

`usePhoneInput` returns a parsed [country object](/docs/Usage/PhoneInput#parsedcountry-type) instead of iso2 code.<br/>
Check updated `usePhoneInput` API reference [here](/docs/Advanced-Usage/usePhoneInput).

## CountrySelectorDropdown item id updated

Dropdown item ids are now prefixed with the library name to avoid id conflicts: `react-international-phone__${iso2}-option`<br/>
Before: `id="ua-option"`<br/>
After: `id="react-international-phone__ua-option"`

## `FlagEmoji` has been renamed to `FlagImage`

Since the flag component can render custom images, it is not necessarily an emoji.<br/>
Please update component name if you used it.
