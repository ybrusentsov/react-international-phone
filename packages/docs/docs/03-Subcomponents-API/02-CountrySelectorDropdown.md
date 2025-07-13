import RequiredMark from '@site/src/components/RequiredMark'
import PropDescription from '@site/src/components/PropDescription'

# CountrySelectorDropdown API

**CountrySelectorDropdown** is a dropdown component for selecting a country that opens after click on _CountrySelector_.

## Usage Example

Import component

```tsx
import { CountrySelectorDropdown } from 'react-international-phone';
```

Use by providing the _show_, _selectedCountry_ and _onSelect_ properties.

```tsx
<CountrySelectorDropdown
  show={true}
  selectedCountry="al"
  onSelect={handleSelect}
  onClose={handleClose}
/>
```

Output:

import { CountrySelectorDropdown } from 'react-international-phone';

<CountrySelectorDropdown show={true} selectedCountry="al" style={{ position: 'relative', top: '0' }} />

## Properties

### `show` <RequiredMark/>

<PropDescription
type="boolean"
description="Show dropdown"
/>

### `dialCodePrefix`

<PropDescription
type="string"
description="Prefix for country code"
defaultValue={`"+"`}
/>

### `selectedCountry`

<PropDescription
type="CountryIso2"
description="Selected option country code (iso2)"
defaultValue="undefined"
/>

### `onSelect`

<PropDescription
type="(country: ParsedCountry) => void"
description="Callback that calls on option select"
defaultValue="undefined"
/>

### `onClose`

<PropDescription
type="() => void"
description="Callback that calls on dropdown close without select any item (usually by keyboard events)"
defaultValue="undefined"
/>

### Style properties (`CountrySelectorDropdownStyleProps` type)

| Prop                         | Type            | Description                                                                  |
| ---------------------------- | --------------- | ---------------------------------------------------------------------------- |
| style                        | `CSSProperties` | Custom styles for **CountrySelectorDropdown container**                      |
| className                    | `string`        | Custom className for **CountrySelectorDropdown container**                   |
| listItemStyle                | `CSSProperties` | Custom styles for **CountrySelectorDropdown list-item container**            |
| listItemClassName            | `string`        | Custom className for **CountrySelectorDropdown list-item container**         |
| listItemFlagStyle            | `CSSProperties` | Custom styles for **CountrySelectorDropdown list-item flag**                 |
| listItemFlagClassName        | `string`        | Custom className for **CountrySelectorDropdown list-item flag**              |
| listItemCountryNameStyle     | `CSSProperties` | Custom styles for **CountrySelectorDropdown list-item country name**         |
| listItemCountryNameClassName | `string`        | Custom className for **CountrySelectorDropdown list-item country name**      |
| listItemDialCodeStyle        | `CSSProperties` | Custom styles for **CountrySelectorDropdown list-item country dial code**    |
| listItemDialCodeClassName    | `string`        | Custom className for **CountrySelectorDropdown list-item country dial code** |

### CSS variables

| Variable                                                            | Default value                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| --react-international-phone-dropdown-item-font-size                 | `14px`                                                              |
| --react-international-phone-dropdown-item-text-color                | --react-international-phone-text-color                              |
| --react-international-phone-dropdown-item-height                    | `28px`                                                              |
| --react-international-phone-dropdown-item-background-color          | --react-international-phone-background-color                        |
| --react-international-phone-dropdown-item-dial-code-color           | `gray`                                                              |
| --react-international-phone-selected-dropdown-item-text-color       | --react-international-phone-text-color                              |
| --react-international-phone-selected-dropdown-item-background-color | `whitesmoke`                                                        |
| --react-international-phone-selected-dropdown-item-dial-code-color  | --react-international-phone-dropdown-item-dial-code-color           |
| --react-international-phone-focused-dropdown-item-background-color  | --react-international-phone-selected-dropdown-item-background-color |
| --react-international-phone-dropdown-shadow                         | `2px 2px 16px rgb(0 0 0 / 25%)`                                     |
| --react-international-phone-dropdown-left                           | `0`                                                                 |
| --react-international-phone-dropdown-top                            | `44px`                                                              |
| --react-international-phone-dropdown-preferred-list-divider-color   | --react-international-phone-border-color                            |
| --react-international-phone-dropdown-preferred-list-divider-margin  | `0`                                                                 |
