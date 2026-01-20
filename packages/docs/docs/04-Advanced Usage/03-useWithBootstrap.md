## Using with UI libraries


**Ant Design**, **Chakra UI**, **MUI** and **Bootstrap** examples can be found [on GitHub](https://github.com/goveo/react-international-phone/tree/master/src/stories/UiLibsExample/components) and demos for these code snippets can be found [on Storybook](https://react-international-phone-storybook.vercel.app/?path=/story/using-with-ui-libs).

# Bootstrap with React Example

Bootstrap is a powerful, feature-packed frontend toolkit. Now you can integrate bootstrap directly in your react application.    
Here is how you can use `react-international-phone` with bootstrap styling. 
First install bootstrap.
To install, run the following command(s):

**Using npm:**
```
npm install bootstrap@5.3.0 @popperjs/core --save

```

**Using yarn:**
```
yarn add bootstrap@@5.3.0
yarn add @popperjs/core
```

Additionally, you will need the `react-international-phone` package.
To install, run the following command(s):

**Using npm:**
```
npm install react-international-phone

```

**Using yarn:**
```
yarn add react-international-phone

```

### [codesandbox](https://codesandbox.io/s/bootstrap-phone-input-s9dwhq)
## [View Live](https://plusod.github.io/bootstrap-phone-input/)




### Properties

| Prop                          | Type                  | Description                                                                                                                                                                                                          | Default value               |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| defaultCountry                | `CountryIso2`         | Default country value (iso2).                                                                                                                                                                                        | `"bd"`                      |
| value                         | `string`              | Phone value.                                                                                                                                                                                                         | `""`                        |
| hideDropdown                  | `boolean`             | Hide the dropdown icon. Make country selection not accessible.                                                                                                                                                       | `false`                     |
| disabled                      | `boolean`             | Disable phone input and country selector.                                                                                                                                                                            | `false`                     |


<Tabs>

<TabItem value="jsx" label="BootstrapPhone JSX Implementation">

### BootstrapPhone JSX Implementation

```jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap' // required for dropdown
import { 
    FlagEmoji, 
    defaultCountries, 
    parseCountry, 
    usePhoneInput 
} from 'react-international-phone';
import 'react-international-phone/style.css';


const BootstrapPhone = ({ value, onChange, defaultCountry, hideDropdown, prefix, disabled, ...restProps }) => {
    const { phone, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
        value,
        disabled: disabled || false,
        defaultCountry: defaultCountry || 'bd',
        hideDropdown: hideDropdown || false,
        countries: defaultCountries,
        onChange: (data) => {
            if (typeof onChange === 'function') {
                onChange(data.phone);
            }
        },
    });

    return (
        <div className="input-group" style={{ maxWidth: '400px', ...(disabled ? { pointerEvents: 'none', opacity: 0.7} : {}) }}>
            <span className="input-group-text bg-white">
                <div className="dropdown">
                    {hideDropdown ? (
                        <span className="mx-2"><FlagEmoji iso2={country} size={32} /></span>
                    ) : (
                        <button
                            className="btn btn-light dropdown-toggle bg-white p-0 border-0 shadow-none outline-0"
                            type="button"
                            id="countryDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="mx-2"><FlagEmoji iso2={country} size={32} /></span>

                        </button>
                    )}

                    <ul className="dropdown-menu" aria-labelledby="countryDropdown" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        {defaultCountries.map((c) => {
                            const country = parseCountry(c);
                            return (
                                <li key={country.iso2}>
                                    <button className="dropdown-item" type="button" onClick={() => setCountry(country.iso2)}>
                                        <FlagEmoji iso2={country.iso2} size={24} /> {country.name} +{country.dialCode}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </span>
            <input
                type="tel"
                className="form-control"
                placeholder="Phone number"
                value={phone}
                onChange={handlePhoneValueChange}
                ref={inputRef}
                {...restProps}
            />
        </div>
    );
};

export default BootstrapPhone;
```

</TabItem>

<TabItem value="jsx" label="Use BootstrapPhone Component">

### Use BootstrapPhone component within other components

```jsx
import React, { useState } from 'react';
import BootstrapPhone from '@site/src/components/BootstrapPhone';

const UseBootstrapPhoneInput = ({ value, onChange, ...restProps }) => {

    const [phone, setPhone] = useState('');

    return (
        <div>
            <BootstrapPhone
                defaultCountry="bd"
                value={phone}
                onChange={(phone) => setPhone(phone)}
            />
        </div>
    );
};

export default UseBootstrapPhoneInput;
```

</TabItem>
</Tabs>
