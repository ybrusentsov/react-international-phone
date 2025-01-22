import PropDescription from '@site/src/components/PropDescription'

# PhoneInput API

**PhoneInput** is a highly customizable phone input component.

## Usage Example

Import component

```tsx
import { PhoneInput } from 'react-international-phone';
```

Use by providing the _defaultCountry_, _value_ and _onChange_ callback.

```tsx
<PhoneInput
  defaultCountry="ua"
  value={phone}
  onChange={(phone) => setPhone(phone)}
/>
```

Output:

import {PhoneInput} from 'react-international-phone';

<PhoneInput defaultCountry="ua" />

## Properties

### `value`

<PropDescription
type="string"
description="Phone value."
defaultValue={'""'}
/>

### `onChange`

<PropDescription
type="(phone: string, meta: { country: ParsedCountry, inputValue: string }) => void"
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

### `preferredCountries`

<PropDescription
type="CountryIso2[]"
description="An array of countries to display at the top of the dropdown list"
defaultValue="[]"
/>

### `hideDropdown`

<PropDescription
type="boolean"
description="Hide the dropdown icon. Make country selection not accessible."
defaultValue="false"
/>

### `disabled`

<PropDescription
type="boolean"
description="Disable phone input and country selector."
defaultValue="false"
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
defaultValue={'" "'}
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

### `showDisabledDialCodeAndPrefix`

<PropDescription
type="boolean"
description={<span>Show prefix and dial code between country selector and phone input. Works only when <code>disableDialCodeAndPrefix</code> is <code>true</code></span>}
defaultValue="false"
/>

### `disableFocusAfterCountrySelect`

<PropDescription
type="boolean"
description="Disable auto focus on input field after country select."
defaultValue="false"
/>

### `disableFormatting`

<PropDescription
type="boolean"
description="Disable phone value mask formatting. All formatting characters will not be displayed, but the mask length will be preserved."
defaultValue="false"
/>

### `flags`

<PropDescription
type="CustomFlagImage[] | ComponentType"
description="Custom flag URLs array or a custom flag component"
defaultValue="undefined"
/>

### `inputProps`

<PropDescription
type="InputHTMLAttributes"
description="Default input component props"
defaultValue="undefined"
/>

:::note
Input props like `onFocus`, `onBlur`, `name`, `placeholder`, `disabled`, `required` and `autoFocus` also supported as top-level props.<br/>
If you want add some additional attributes to the input element, you can do it using `inputProps`
:::

## Style properties

| Prop                      | Type                                                                                | Description                                   |
| ------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| style                     | `CSSProperties`                                                                     | Custom styles for **PhoneInput container**    |
| className                 | `string`                                                                            | Custom className for **PhoneInput container** |
| inputStyle                | `CSSProperties`                                                                     | Custom styles for **input field**             |
| inputClassName            | `string`                                                                            | Custom className for **input field**          |
| countrySelectorStyleProps | [`CountrySelectorStyleProps`](/docs/Subcomponents%20API/CountrySelector#properties) | Style properties for **country selector**     |
| dialCodePreviewStyleProps | [`DialCodePreviewStyleProps`](/docs/Subcomponents%20API/DialCodePreview#properties) | Style properties for **dial code preview**    |

## CSS variables

| Variable                                              | Default value |
| ----------------------------------------------------- | ------------- |
| --react-international-phone-height                    | `36px`        |
| --react-international-phone-background-color          | `white`       |
| --react-international-phone-text-color                | `#222`        |
| --react-international-phone-font-size                 | `13px`        |
| --react-international-phone-border-radius             | `4px `        |
| --react-international-phone-border-color              | `gainsboro`   |
| --react-international-phone-disabled-background-color | `whitesmoke`  |
| --react-international-phone-disabled-text-color       | `#666`        |

:::info
You can find more styling properties and CSS variables in [Subcomponents](/docs/subcomponents%20API/)
:::

## Ref forwarding

You can pass ref to a PhoneInput component.<br/>
Ref object refers to inner **input element** with some additional properties.

```tsx
const PhoneWithRef = () => {
  const ref = useRef(null);
  return (
    <PhoneInput ref={ref}>;
  )
}
```

:::note
If you use typescript you should use `PhoneInputRefType` for as ref type:

```tsx
import { PhoneInputRefType } from 'react-international-phone';
// ...
const ref = useRef<PhoneInputRefType>(null);
```

:::

### Ref additional properties

In addition to the [HTMLInputElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement), ref also allows you to use these methods:

#### `setCountry`

<PropDescription
type="(iso2: CountryIso2, options?: { focusOnInput: boolean }) => void"
description="Set some country value (works same as country selector country item click handler)"
/>

#### `state`

<PropDescription
type="{ phone: string; inputValue: string; country: ParsedCountry }"
description="State of the phone input"
/>

## `ParsedCountry` type

`onChange` callback provides `country` object with `ParsedCountry` type:

```ts
interface ParsedCountry {
  name: string;
  iso2: CountryIso2;
  dialCode: string;
  format: FormatConfig | string | undefined;
  priority: number | undefined;
  areaCodes: string[] | undefined;
}
```

Parsed country object example:

```ts
{
  name: 'Ukraine';
  iso2: 'ua';
  dialCode: '380';
  format: '(..) ... .. ..';
  priority: undefined;
  areaCodes: undefined;
}
```
