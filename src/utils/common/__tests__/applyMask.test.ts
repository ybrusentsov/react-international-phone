import { applyMask } from '../applyMask';

describe('applyMask', () => {
  test('should apply mask', () => {
    expect(
      applyMask({ value: '12345678', mask: '.. .. ....', maskSymbol: '.' }),
    ).toBe('12 34 5678');
    expect(
      applyMask({ value: '12345678', mask: '.... ....', maskSymbol: '.' }),
    ).toBe('1234 5678');
    expect(
      applyMask({ value: '12345678', mask: '## ## ## ##', maskSymbol: '#' }),
    ).toBe('12 34 56 78');
    expect(
      applyMask({ value: '12345678', mask: '.. (..) .. ..', maskSymbol: '.' }),
    ).toBe('12 (34) 56 78');
    expect(applyMask({ value: '1234', mask: '(..) ..', maskSymbol: '.' })).toBe(
      '(12) 34',
    );
  });

  test('should trim values that bigger than mask', () => {
    expect(
      applyMask({ value: '1234567890', mask: '.. .. ....', maskSymbol: '.' }),
    ).toBe('12 34 5678');
    expect(
      applyMask({ value: '1234567890', mask: '.... ....', maskSymbol: '.' }),
    ).toBe('1234 5678');
  });

  test('should apply mask on value that shorter that mask', () => {
    expect(
      applyMask({ value: '1234', mask: '.. .. ....', maskSymbol: '.' }),
    ).toBe('12 34 ');
    expect(
      applyMask({ value: '1234', mask: '.... ....', maskSymbol: '.' }),
    ).toBe('1234 ');
    expect(applyMask({ value: '1', mask: '.... ....', maskSymbol: '.' })).toBe(
      '1',
    );
    expect(applyMask({ value: '', mask: '.... ....', maskSymbol: '.' })).toBe(
      '',
    );
  });

  test('should accept all symbols', () => {
    expect(
      applyMask({ value: 'abcdefgh', mask: '.. .. ....', maskSymbol: '.' }),
    ).toBe('ab cd efgh');
    expect(
      applyMask({ value: 'sometest', mask: '.... ....', maskSymbol: '.' }),
    ).toBe('some test');
    expect(
      applyMask({ value: '+12345678', mask: '.... ....', maskSymbol: '.' }),
    ).toBe('+123 4567');
    expect(
      applyMask({ value: '+1a', mask: '.... ....', maskSymbol: '.' }),
    ).toBe('+1a');
  });

  test('should handle offset', () => {
    expect(
      applyMask({
        value: '+380991234567',
        mask: '(..) ... .. ..',
        maskSymbol: '.',
        offset: 4,
      }),
    ).toBe('+380(99) 123 45 67');
    expect(
      applyMask({
        value: '+380 991234567',
        mask: '(..) ... .. ..',
        maskSymbol: '.',
        offset: 5,
      }),
    ).toBe('+380 (99) 123 45 67');
    expect(
      applyMask({
        value: '+12345678',
        mask: '(....)',
        maskSymbol: '.',
        offset: 2,
      }),
    ).toBe('+1(2345)');
    expect(
      applyMask({
        value: '+12345678',
        mask: '(....)',
        maskSymbol: '.',
        offset: 5,
      }),
    ).toBe('+1234(5678)');

    expect(
      applyMask({
        value: '+38',
        mask: '(..) ... .. ..',
        maskSymbol: '.',
        offset: 4,
      }),
    ).toBe('+38');
  });

  test('should handle trimNonMaskCharsLeftover option', () => {
    const maskConfig = {
      value: '1234',
      mask: '(....) .. ..',
      maskSymbol: '.',
    };

    expect(applyMask(maskConfig)).toBe('(1234) ');
    expect(applyMask({ ...maskConfig, trimNonMaskCharsLeftover: true })).toBe(
      '(1234',
    );
  });

  test('should handle allowMaskOverflow option', () => {
    // format the part that fits, append overflow at the end
    expect(
      applyMask({
        value: '1234567890123',
        mask: '.. .. ....',
        maskSymbol: '.',
        allowMaskOverflow: true,
      }),
    ).toBe('12 34 567890123');

    expect(
      applyMask({
        value: '123456789',
        mask: '.... ....',
        maskSymbol: '.',
        allowMaskOverflow: true,
      }),
    ).toBe('1234 56789');

    expect(
      applyMask({
        value: '23456789012',
        mask: '(...) ...-....',
        maskSymbol: '.',
        allowMaskOverflow: true,
      }),
    ).toBe('(234) 567-89012');

    // with offset
    expect(
      applyMask({
        value: '+1234567890123',
        mask: '.. .. ....',
        maskSymbol: '.',
        offset: 2,
        allowMaskOverflow: true,
      }),
    ).toBe('+123 45 67890123');

    // apply formatting on mask not overflow (normal behavior)
    expect(
      applyMask({
        value: '1234567',
        mask: '.. .. ....',
        maskSymbol: '.',
        allowMaskOverflow: true,
      }),
    ).toBe('12 34 567');

    expect(
      applyMask({
        value: '1234',
        mask: '.... ....',
        maskSymbol: '.',
        allowMaskOverflow: true,
      }),
    ).toBe('1234 ');

    expect(
      applyMask({
        value: '+1234567',
        mask: '.. .. ....',
        maskSymbol: '.',
        offset: 2,
        allowMaskOverflow: true,
      }),
    ).toBe('+123 45 67');
  });
});
