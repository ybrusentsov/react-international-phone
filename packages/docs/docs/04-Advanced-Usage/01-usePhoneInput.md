import RequiredMark from '@site/src/components/RequiredMark'
import PropDescription from '@site/src/components/PropDescription'

# usePhoneInput

**usePhoneInput** is a hook for providing phone formatting to existing input components.

Use `phone` (as value), `handlePhoneValueChange` (as onChange callback) and `inputRef` (as passed ref) to handle input.

## Usage Example

```ts
// import { usePhoneInput } from 'react-international-phone';

const {
  inputValue,
  phone,
  country,
  setCountry,
  handlePhoneValueChange,
  inputRef,
} = usePhoneInput({
  defaultCountry: 'us',
  value: '+1 (234)',
  onChange: ({ phone, inputValue, country }) => {
    // make something on change
  },
});
```

## Hook arguments

### `value`

<PropDescription
type="string"
description="Phone value."
defaultValue={'""'}
/>

### `onChange`

<PropDescription
type="(data: { phone: string; inputValue: string; country: ParsedCountry }) => void"
description="Callback that calls on phone change"
defaultValue="undefined"
/>

### `defaultCountry`

<PropDescription
type="CountryIso2"
description="Default country value (iso2)."
defaultValue={'"us"'}
/>

### `countries`

<PropDescription
type="CountryData[]"
description="An array of available countries to select (and guess)"
defaultValue="defaultCountries"
/>

### `prefix`

<PropDescription
type="string"
description="Prefix for phone value."
defaultValue={'"+"'}
/>

### `defaultMask`

<PropDescription
type="string"
description="This mask will apply on countries that does not have specified mask."
defaultValue={'"............"'}
/>

### `charAfterDialCode`

<PropDescription
type="string"
description="Char that renders after country dial code."
defaultValue={<span>"&nbsp;"</span>}
/>

### `historySaveDebounceMS`

<PropDescription
type="number"
description="Save value to history if there were not any changes in provided milliseconds timeslot. Undo/redo (ctrl+z/ctrl+shift+z) works only with values that are saved in history"
defaultValue="200"
/>

### `disableCountryGuess`

<PropDescription
type="boolean"
description={<span>Disable country guess on value change. <code>onCountryGuess</code> callback would not be called.</span>}
defaultValue="false"
/>

### `disableDialCodePrefill`

<PropDescription
type="boolean"
description="Disable dial code prefill on initialization. Dial code prefill works only when empty phone value have been provided."
defaultValue="false"
/>

### `forceDialCode`

<PropDescription
type="boolean"
description="Always display the dial code. Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value."
defaultValue="false"
/>

### `disableDialCodeAndPrefix`

<PropDescription
type="boolean"
description={<span>Display phone value will not include passed <code>dialCode</code> and <code>prefix</code> if set to <code>true</code>. <code>forceDialCode</code> value will be ignored.</span>}
defaultValue="false"
/>

### `disableFormatting`

<PropDescription
type="boolean"
description="Disable phone value mask formatting. All formatting characters will not be displayed, but the mask length will be preserved."
defaultValue="false"
/>

### `inputRef`

<PropDescription
type="React.MutableRefObject<HTMLInputElement | null>"
description="Ref for the input element."
defaultValue="undefined"
/>

## Returned values

### `inputValue`

<PropDescription
type="string"
description="Formatted phone string. Value that should be rendered inside input element."
/>

### `phone`

<PropDescription
type="string"
description="Phone in E164 format."
/>

### `handlePhoneValueChange`

<PropDescription
type="(e: React.ChangeEvent<HTMLInputElement>) => string"
description="Change handler for input component."
/>

### `inputRef`

<PropDescription
type="React.RefObject<HTMLInputElement>"
description="Ref object for input component (handles caret position, focus and undo/redo)."
/>

### `country`

<PropDescription
type="ParsedCountry"
description="Current country object."
/>

### `setCountry`

<PropDescription
type="(country: CountryIso2, options?: { focusOnInput: boolean })) => void"
description="Country setter."
/>
