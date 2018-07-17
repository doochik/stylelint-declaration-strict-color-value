[![Build Status](https://travis-ci.org/doochik/stylelint-declaration-strict-color-value.svg?branch=master)](https://travis-ci.org/doochik/stylelint-declaration-strict-color-value)

# stylelint-declaration-strict-color-value

A stylelint plugin that check whitelist or blacklist color values.

`npm install --save-dev stylelint-declaration-strict-color-value`

```
// .stylelintrc
{
  "plugins": [
    "stylelint-declaration-strict-color-value"
  ],
  "rules": {
    // ...
    "stylelint-declaration-strict-color-value/whitelist": [
      'var(--color-red)',
      'var(--color-green)',
      'var(--color-blue)'
    ],
    "stylelint-declaration-strict-color-value/blacklist": [
      '#f00',
      '#0f0',
    ],
    // ...
  }
}
```

## Examples

```
stylelint-declaration-strict-color-value/blacklist: [ '#f00' ]

.foo {
  color: #f00; // BAD
  background-color: #f00; // BAD
  border: 1px solid #f00; // BAD
  
  border: 1px solid #00f; // GOOD
}
```
