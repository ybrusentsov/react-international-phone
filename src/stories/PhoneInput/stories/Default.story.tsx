import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const Default: PhoneInputStory = {
  render: (args) => <PhoneInput {...args} />,
  args: {
    enableCountrySearch: true,
  },
};
