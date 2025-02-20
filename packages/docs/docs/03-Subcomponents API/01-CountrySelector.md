import PropDescription from '@site/src/components/PropDescription'

# CountrySelector API

**CountrySelector** is a button component for selecting a country.

## Usage Example

Import component

```tsx
import { CountrySelector } from 'react-international-phone';
```

Use by providing the _selectedCountry_ and _onSelect_ callback.

```tsx
<CountrySelector
  selectedCountry="ua"
  onSelect={({ iso2 }) => setCountry(iso2)}
/>
```

Output:

import { CountrySelector } from 'react-international-phone';

<CountrySelector selectedCountry="ua" />

## Properties

### `selectedCountry`

<PropDescription
type="CountryIso2"
description="Selected country (iso2)."
defaultValue="undefined"
/>

### `onSelect`

<PropDescription
type="(country: ParsedCountry) => void"
description="Callback that calls on country select"
defaultValue="undefined"
/>

### `disabled`

<PropDescription
type="boolean"
description="Is CountrySelector disabled"
defaultValue="undefined"
/>

### `hideDropdown`

<PropDescription
type="boolean"
description="Hide dropdown icon and make CountrySelector not clickable"
defaultValue="undefined"
/>

### `buttonProps`

<PropDescription
type="React.ButtonHTMLAttributes<HTMLButtonElement>"
description="Allows you to set props (such as id, disabled, aria-label, etc...) directly on the button element"
defaultValue="undefined"
/>


### `renderButtonWrapper`

<PropDescription
type="(props: { children: React.ReactNode; rootProps: React.ButtonHTMLAttributes<HTMLButtonElement>) => React.ReactNode"
description={<span>Render function for custom button wrapper. <code>children</code> and <code>rootProps</code> should be passed to button props. <code>rootProps</code> contains a click handler and properties that are required for accessibility. <code>rootProps</code> should be spread like <code>&lt;button &#123;...rootProps&#125; /&gt;</code></span>}
defaultValue="undefined"
/>

### Style properties (`CountrySelectorStyleProps` type)

| Prop                          | Type                                                                                                | Description                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| style                         | `CSSProperties`                                                                                     | Custom styles for **CountrySelector container**                 |
| className                     | `string`                                                                                            | Custom className for **CountrySelector container**              |
| buttonStyle                   | `CSSProperties`                                                                                     | Custom styles for **CountrySelector button**                    |
| buttonClassName               | `string`                                                                                            | Custom className for **CountrySelector button**                 |
| buttonContentWrapperStyle     | `CSSProperties`                                                                                     | Custom styles for **CountrySelector button content wrapper**    |
| buttonContentWrapperClassName | `string`                                                                                            | Custom className for **CountrySelector button content wrapper** |
| flagStyle                     | `dropdownStyleProps`                                                                                | Custom styles for **CountrySelector flag**                      |
| flagClassName                 | `string`                                                                                            | Custom className for **CountrySelector flag**                   |
| dropdownArrowStyle            | `dropdownStyleProps`                                                                                | Custom styles for **CountrySelector dropdown arrow**            |
| dropdownArrowClassName        | `string`                                                                                            | Custom className for **CountrySelector dropdown arrow**         |
| dropdownStyleProps            | [`CountrySelectorDropdownStyleProps`](/docs/Subcomponents%20API/CountrySelectorDropdown#properties) | Style properties for **CountrySelector dropdown**               |

### CSS variables

| Variable                                                               | Default value                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| --react-international-phone-country-selector-background-color          | --react-international-phone-background-color          |
| --react-international-phone-country-selector-background-color-hover    | `whitesmoke`                                          |
| --react-international-phone-disabled-country-selector-background-color | --react-international-phone-disabled-background-color |
| --react-international-phone-country-selector-border-color              | `gainsboro`                                           |
| --react-international-phone-country-selector-arrow-size                | `4px`                                                 |
| --react-international-phone-country-selector-arrow-color               | `#777`                                                |
| --react-international-phone-disabled-country-selector-arrow-color      | `#999`                                                |
