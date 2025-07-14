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
   * @description Ignores masking for numbers longer than the mask
   * @example
   * value: "123456789"
   * mask: "(....) ...."
   * if true -> "123456789"
   * if false -> "(1234) 5678"
   */
  enableLongNumbers?: boolean;
}

export const applyMask = ({
  value,
  mask,
  maskSymbol,
  offset = 0,
  trimNonMaskCharsLeftover = false,
  enableLongNumbers = false,
}: ApplyMaskArgs): string => {
  if (value.length < offset) return value;
  if (enableLongNumbers && value.length > mask.split('.').length - 1)
    return value;

  const savedValuePart = value.slice(0, offset);
  const valueToMask = value.slice(offset);

  let result = savedValuePart;

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

  return result;
};
