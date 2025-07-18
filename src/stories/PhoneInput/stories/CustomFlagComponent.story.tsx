import React from 'react';

import {
  CountryIso2,
  defaultCountries,
  parseCountry,
  PhoneInput,
} from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

const CustomFlag = ({
  iso2,
  style,
  className,
}: {
  iso2?: CountryIso2;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <img
      src={`/flags/${iso2}.svg`}
      style={{ ...style, width: '24px', height: '24px' }}
      className={className}
    />
  );
};

const countries = defaultCountries.filter((c) => {
  const country = parseCountry(c);
  return ['fr', 'jp', 'pl', 'ua'].includes(country.iso2);
});

export const CustomFlagComponent: PhoneInputStory = {
  name: 'Custom Flag Component',
  render: (args) => <PhoneInput {...args} />,
  args: {
    flags: CustomFlag,
    countries,
    defaultCountry: 'jp',
    placeholder: 'Phone number',
  },
};
