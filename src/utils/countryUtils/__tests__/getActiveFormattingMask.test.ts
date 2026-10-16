import { CountryIso2 } from '../../../types';
import { getActiveFormattingMask } from '../getActiveFormattingMask';
import { getCountry } from '../getCountry';

const getCountryByIso2 = (iso2: CountryIso2) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return getCountry({ value: iso2, field: 'iso2' })!;
};

describe('getActiveFormattingMask', () => {
  test('should return active formatting mask (format is a string)', () => {
    expect(
      getActiveFormattingMask({
        phone: '+1 (203) 555-5555',
        country: getCountryByIso2('us'),
      }),
    ).toBe('(...) ...-....');

    expect(
      getActiveFormattingMask({
        phone: '+12045555555',
        country: getCountryByIso2('ca'),
      }),
    ).toBe('(...) ...-....');

    expect(
      getActiveFormattingMask({
        phone: '+380 (99) 123 45 67',
        country: getCountryByIso2('ua'),
      }),
    ).toBe('(..) ... .. ..');

    expect(
      getActiveFormattingMask({
        phone: '',
        country: getCountryByIso2('ua'),
      }),
    ).toBe('(..) ... .. ..');
  });

  test('should return active formatting mask (format is an object)', () => {
    expect(
      getActiveFormattingMask({
        phone: '+61512345678',
        country: getCountryByIso2('au'),
      }),
    ).toBe('... ... ...');

    expect(
      getActiveFormattingMask({
        phone: '+61312345678',
        country: getCountryByIso2('au'),
      }),
    ).toBe('. .... ....');

    expect(
      getActiveFormattingMask({
        phone: '+61131234',
        country: getCountryByIso2('au'),
      }),
    ).toBe('.. .. ..');

    expect(
      getActiveFormattingMask({
        phone: '+611300123456',
        country: getCountryByIso2('au'),
      }),
    ).toBe('.... ... ...');

    expect(
      getActiveFormattingMask({
        phone: '+611801234',
        country: getCountryByIso2('au'),
      }),
    ).toBe('... ....');

    expect(
      getActiveFormattingMask({
        phone: '+611800123456',
        country: getCountryByIso2('au'),
      }),
    ).toBe('.... ... ...');

    // Argentina: 10 national digits, 11 for mobiles (9 + area code + number)
    expect(
      getActiveFormattingMask({
        phone: '+541123456789',
        country: getCountryByIso2('ar'),
      }),
    ).toBe('(..) .... ....');

    expect(
      getActiveFormattingMask({
        phone: '+542211234567',
        country: getCountryByIso2('ar'),
      }),
    ).toBe('(...) ... ....');

    expect(
      getActiveFormattingMask({
        phone: '+5491123456789',
        country: getCountryByIso2('ar'),
      }),
    ).toBe('. (..) .... ....');

    expect(
      getActiveFormattingMask({
        phone: '+5492211234567',
        country: getCountryByIso2('ar'),
      }),
    ).toBe('. (...) ... ....');

    // should return default mask if provided phone is empty
    expect(
      getActiveFormattingMask({
        phone: '',
        country: getCountryByIso2('au'),
      }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    ).toBe(getCountryByIso2('au').format?.default);
  });

  test('should handle disableFormatting prop', () => {
    expect(
      getActiveFormattingMask({
        phone: '+1 2035555555',
        country: getCountryByIso2('us'),
        disableFormatting: true,
      }),
    ).toBe('..........');

    expect(
      getActiveFormattingMask({
        phone: '+380 991234567',
        country: getCountryByIso2('ua'),
        disableFormatting: true,
      }),
    ).toBe('.........');

    expect(
      getActiveFormattingMask({
        phone: '',
        country: getCountryByIso2('ua'),
        disableFormatting: true,
      }),
    ).toBe('.........');
  });

  test('should return defaultMask if country does not have format mask', () => {
    expect(
      getActiveFormattingMask({
        phone: '+88699999999',
        country: getCountryByIso2('tw'), // Taiwan does not have format mask
        defaultMask: '....-....-....',
      }),
    ).toBe('....-....-....');

    expect(
      getActiveFormattingMask({
        phone: '+99999999999',
        country: getCountryByIso2('tw'),
        defaultMask: '....-....-....',
      }),
    ).toBe('....-....-....');
  });
});
