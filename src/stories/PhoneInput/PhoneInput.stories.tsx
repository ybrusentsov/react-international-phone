import type { Meta, StoryObj } from '@storybook/react';

import { PhoneInput } from '../../index';

const meta: Meta<typeof PhoneInput> = {
  title: 'PhoneInput',
  component: PhoneInput,
};

export default meta;
export type PhoneInputStory = StoryObj<typeof PhoneInput>;

/* eslint-disable simple-import-sort/imports */
import { Default } from './stories/Default.story';
import { WithInitialValue } from './stories/WithInitialValue.story';
import { ForcedDialCode } from './stories/ForcedDialCode.story';
import { DisabledPrefill } from './stories/DisabledPrefill.story';
import { DisabledCountryGuess } from './stories/DisabledCountryGuess.story';
import { WithoutDropdown } from './stories/WithoutDropdown.story';
import { HiddenDialCode } from './stories/HiddenDialCode.story';
import { WithCodePreview } from './stories/WithCodePreview.story';
import { CustomStyles } from './stories/CustomStyles.story';
import { OnlyBalticCountries } from './stories/OnlyBalticCountries.story';
import { PreferredCountries } from './stories/PreferredCountries.story';
import { WithAutofocus } from './stories/WithAutofocus.story';
import { DisableFormatting } from './stories/DisableFormatting.story';
import { ControlledMode } from './stories/ControlledMode.story';
import { CustomFlags } from './stories/CustomFlags.story';
import { CustomFlagComponent } from './stories/CustomFlagComponent.story';

export const _Default = Default;
export const _WithInitialValue = WithInitialValue;
export const _ForcedDialCode = ForcedDialCode;
export const _DisabledPrefill = DisabledPrefill;
export const _DisabledCountryGuess = DisabledCountryGuess;
export const _WithoutDropdown = WithoutDropdown;
export const _HiddenDialCode = HiddenDialCode;
export const _WithCodePreview = WithCodePreview;
export const _CustomStyles = CustomStyles;
export const _OnlyBalticCountries = OnlyBalticCountries;
export const _PreferredCountries = PreferredCountries;
export const _WithAutofocus = WithAutofocus;
export const _DisableFormatting = DisableFormatting;
export const _ControlledMode = ControlledMode;
export const _CustomFlags = CustomFlags;
export const _CustomFlagComponent = CustomFlagComponent;
