import {
  defaultCountries,
  parseCountry,
  PhoneInput,
} from 'react-international-phone';

export const ModifiedCountriesExample: React.FC = () => {
  const countries = defaultCountries.filter((country) => {
    const { iso2 } = parseCountry(country);
    return ['us', 'ua', 'gb'].includes(iso2);
  });

  return <PhoneInput defaultCountry="ua" countries={countries} />;
};
