# Migrating from v2 to v3

:::caution Why is it important to update?

Version 2 becomes deprecated and unsupported since v3 is released. <br/>
New features and bug fixes will be pushed only to v3.

:::

## Validation has been removed in v3.

If you used the `usePhoneValidation` hook or the `validatePhone` function, you need to implement it on your own.

We recommend to use a [`google-libphonenumber`](https://www.npmjs.com/package/google-libphonenumber) library for number validation.<br/>
Check the [Phone Validation page](/docs/Usage/PhoneValidation) to get basic example of phone validation.

## Regions and subregions have been removed

If you used it (and really need it), please open an [issue](https://github.com/ybrusentsov/react-international-phone/issues) or [discussion](https://github.com/ybrusentsov/react-international-phone/discussions) and we will provide a basic solution on how to re-implement it.
