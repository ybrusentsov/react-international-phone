import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const AllowMaskOverflow: PhoneInputStory = {
  name: 'Allow Mask Overflow',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'us',
    allowMaskOverflow: true,
    placeholder: 'Enter your phone number',
  },
};
