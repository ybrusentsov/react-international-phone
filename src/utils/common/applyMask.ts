interface ApplyMaskArgs {
  value: string;
  mask: string;
  maskSymbol: string;

  /**
   * Apply mask starting from provided char index
   * @example
   * value: "+12345678"
   * mask: "(....)"
   * offset === 2 -> "+1(2345)"
   * offset === 5 -> "+1234(5678)"
   */
  offset?: number;

  /**
   * @description Removes all non-maskSymbol chars from the result's ending if the value is shorter than the mask
   * @example
   * value: "1234"
   * mask: "(....) ...."
   * if true -> "(1234"
   * if false -> "(1234) "
   */
  trimNonMaskCharsLeftover?: boolean;

  /**
   * @description Allow input to exceed the mask length. When set to true, formatting mask will apply to the part that fits, and overflow digits will be appended at the end.
   * @example
   * value: "12345678"
   * mask: "(....)"
   * if true -> "(1234)5678" (formatted part + overflow)
   * if false -> "(1234" (formatted but truncated)
   */
  allowMaskOverflow?: boolean;
}

export const applyMask = ({
  value,
  mask,
  maskSymbol,
  offset = 0,
  trimNonMaskCharsLeftover = false,
  allowMaskOverflow = false,
}: ApplyMaskArgs): string => {
  if (value.length < offset) return value;

  const prefix = value.slice(0, offset);
  const valueToFormat = value.slice(offset);

  const maskLength = mask
    .split('')
    .filter((char) => char === maskSymbol).length;

  const valueToMask = valueToFormat.slice(0, maskLength);
  const overflow = allowMaskOverflow ? valueToFormat.slice(maskLength) : '';

  let result = prefix;
  let charsPlaced = 0;

  for (const maskChar of mask.split('')) {
    if (charsPlaced >= valueToMask.length) {
      if (!trimNonMaskCharsLeftover && maskChar !== maskSymbol) {
        result += maskChar;
        continue;
      }
      break;
    }
    if (maskChar === maskSymbol) {
      result += valueToMask[charsPlaced];
      charsPlaced += 1;
    } else {
      result += maskChar;
    }
  }

  return result + overflow;
};
