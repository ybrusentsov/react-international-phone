import RequiredMark from '@site/src/components/RequiredMark'
import PropDescription from '@site/src/components/PropDescription'

# FlagImage API

**FlagImage** is component for rendering country flag.
It's used in [`CountrySelector`](./01-CountrySelector.md) and [`CountrySelectorDropdown`](./02-CountrySelectorDropdown.md) components.

## Usage Example

Import component

```tsx
import { FlagImage } from 'react-international-phone';
```

Use by providing the _dialCode_ and _prefix_ properties.

```tsx
<FlagImage iso2="ua" size="30px" />
```

Output:

import { FlagImage } from 'react-international-phone';

<FlagImage iso2="ua" size="30px" />

## Properties

### `iso2` <RequiredMark/>

<PropDescription
type="string"
description="iso2 code of country flag"
/>

### `src`

<PropDescription
type="string"
description="Custom src of flag"
defaultValue="undefined"
/>

### `protocol`

<PropDescription
type={`"http" | "https"`}
description="Protocol to use with twemoji cnd"
defaultValue={`"https"`}
/>

### `disableLazyLoading`

<PropDescription
type="boolean"
description={<span>Disable lazy loading of flags (<code>loading="lazy"</code> attribute will not be set)</span>}
defaultValue={`"https"`}
/>

### Style properties

| Prop      | Type                     | Description                         |
| --------- | ------------------------ | ----------------------------------- |
| size      | `CSSProperties['width']` | Size of flag (set width and height) |
| style     | `CSSProperties`          | Custom styles prop                  |
| className | `string`                 | Custom className prop               |

### CSS variables

| Variable                                | Default value |
| --------------------------------------- | ------------- |
| --react-international-phone-flag-width  | 24px          |
| --react-international-phone-flag-height | 24px          |
