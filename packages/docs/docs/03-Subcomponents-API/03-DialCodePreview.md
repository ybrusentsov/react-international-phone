import RequiredMark from '@site/src/components/RequiredMark'
import PropDescription from '@site/src/components/PropDescription'

# DialCodePreview API

**DialCodePreview** is component for preview selected country dial code.

## Usage Example

Import component

```tsx
import { DialCodePreview } from 'react-international-phone';
```

Use by providing the _dialCode_ and _prefix_ properties.

```tsx
<DialCodePreview dialCode="1" prefix="+" />
```

Output:

import { DialCodePreview } from 'react-international-phone';

<DialCodePreview dialCode="1" prefix="+" style={{ width: "40px", height: "36px" }} />

## Properties

### `dialCode` <RequiredMark/>

<PropDescription
type="string"
description="Country dial code (iso2)"
/>

### `prefix` <RequiredMark/>

<PropDescription
type="string"
description="Dial code prefix"
/>

### `disabled`

<PropDescription
type="boolean"
description="Is component disabled"
defaultValue="undefined"
/>

### Style properties (`DialCodePreviewStyleProps` type)

| Prop      | Type            | Description                                        |
| --------- | --------------- | -------------------------------------------------- |
| style     | `CSSProperties` | Custom styles for **DialCodePreview container**    |
| className | `string`        | Custom className for **DialCodePreview container** |

### CSS variables

| Variable                                                                | Default value                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| --react-international-phone-dial-code-preview-background-color          | --react-international-phone-background-color          |
| --react-international-phone-dial-code-preview-border-color              | --react-international-phone-border-color              |
| --react-international-phone-dial-code-preview-text-color                | --react-international-phone-text-color                |
| --react-international-phone-dial-code-preview-font-size                 | --react-international-phone-font-size                 |
| --react-international-phone-dial-code-preview-disabled-background-color | --react-international-phone-disabled-background-color |
| --react-international-phone-dial-code-preview-disabled-text-color       | --react-international-phone-disabled-text-color       |
