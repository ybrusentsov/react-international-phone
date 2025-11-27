import { defaultCountries } from '../../../data/countryData';
import { guessCountryByPartialNumber } from '../guessCountryByPartialNumber';

describe('guessCountryByPartialNumber', () => {
  test('should guess country by full number', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+380 (99) 999 99 99',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { iso2: 'ua' } });

    expect(
      guessCountryByPartialNumber({
        phone: '380999999999',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { iso2: 'ua' } });
  });

  test('should guess country by partial number', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+380 (99)',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { iso2: 'ua' } });
    expect(
      guessCountryByPartialNumber({
        phone: '3809',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { iso2: 'ua' } });
  });

  test('should guess country by partial dial code', () => {
    const shouldFindUkraine = guessCountryByPartialNumber({
      phone: '+38',
      countries: defaultCountries,
    });
    expect(shouldFindUkraine).toMatchObject({ country: { iso2: 'ua' } });

    const shouldFindGreece = guessCountryByPartialNumber({
      phone: '+3',
      countries: defaultCountries,
    });
    expect(shouldFindGreece).toMatchObject({ country: { iso2: 'gr' } });
    expect(shouldFindGreece).toMatchObject({ country: { dialCode: '30' } });
  });

  test('should find smallest number particle dial code', () => {
    const shouldFindGreece = guessCountryByPartialNumber({
      phone: '+3',
      countries: defaultCountries,
    });
    expect(shouldFindGreece).toMatchObject({ country: { dialCode: '30' } });

    const shouldFindPeru = guessCountryByPartialNumber({
      phone: '+5',
      countries: defaultCountries,
    });
    expect(shouldFindPeru).toMatchObject({ country: { dialCode: '51' } });

    const shouldFindJapan = guessCountryByPartialNumber({
      phone: '+8',
      countries: defaultCountries,
    });
    expect(shouldFindJapan).toMatchObject({ country: { dialCode: '81' } });

    const shouldFindPortugal = guessCountryByPartialNumber({
      phone: '+35',
      countries: defaultCountries,
    });
    expect(shouldFindPortugal).toMatchObject({ country: { dialCode: '351' } });
  });

  test('should respect priority value', () => {
    const shouldFindUS = guessCountryByPartialNumber({
      phone: '+1999',
      countries: defaultCountries,
    });
    expect(shouldFindUS).not.toMatchObject({
      country: { dialCode: '1', name: 'Canada' },
    });
    expect(shouldFindUS).toMatchObject({
      country: { dialCode: '1', name: 'United States' },
    });
  });

  test('should return undefined if code is not found', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+999',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: undefined });
    expect(
      guessCountryByPartialNumber({
        phone: '+000',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: undefined });
  });

  test('should return undefined if passed empty number', () => {
    expect(
      guessCountryByPartialNumber({ phone: '', countries: defaultCountries }),
    ).toMatchObject({ country: undefined });
    expect(
      guessCountryByPartialNumber({ phone: '+', countries: defaultCountries }),
    ).toMatchObject({ country: undefined });
  });

  test('should return full match if present', () => {
    expect(
      guessCountryByPartialNumber({ phone: '+1', countries: defaultCountries }),
    ).toMatchObject({ country: { dialCode: '1' } });
    expect(
      guessCountryByPartialNumber({
        phone: '+12',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { dialCode: '1' } });
    expect(
      guessCountryByPartialNumber({
        phone: '+1242',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { dialCode: '1242' } });
  });

  test('should support area codes', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+1201',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { dialCode: '1', iso2: 'us' } });
    expect(
      guessCountryByPartialNumber({
        phone: '+1204',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { dialCode: '1', iso2: 'ca' } });
    expect(
      guessCountryByPartialNumber({
        phone: '+7721',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { dialCode: '7', iso2: 'kz' } });
    expect(
      guessCountryByPartialNumber({
        phone: '+7921',
        countries: defaultCountries,
      }),
    ).toMatchObject({ country: { dialCode: '7', iso2: 'ru' } });
  });

  test('should return the current country if the dial code matches', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+39 1234567890',
        countries: defaultCountries,
        currentCountryIso2: 'it',
      }),
    ).toMatchObject({
      country: { dialCode: '39', iso2: 'it' },
    });

    expect(
      guessCountryByPartialNumber({
        phone: '+39 1234567890',
        countries: defaultCountries,
        currentCountryIso2: 'va',
      }),
    ).toMatchObject({
      country: { dialCode: '39', iso2: 'va' },
    });
  });
});
