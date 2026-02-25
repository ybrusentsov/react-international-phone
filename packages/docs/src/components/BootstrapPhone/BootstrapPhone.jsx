/**
 * This design requires the installation of the Bootstrap package.
 * To install, run the following command(s):
 *
 * Using npm:
 * $ npm install bootstrap@latest --save
 * $ npm install @popperjs/core --save
 *
 * Using yarn:
 * $ yarn add bootstrap@latest
 * $ yarn add @popperjs/core
 *
 * Additionally, you will need the 'react-international-phone' package.
 * To install, run the following command(s):
 *
 * Using npm:
 * $ npm install react-international-phone
 *
 * Using yarn:
 * $ yarn add react-international-phone
**/



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


