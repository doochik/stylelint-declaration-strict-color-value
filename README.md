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
        "declaration-strict-color-value/whitelist": [
            [
                "#000",
                "--color-red",
                "--color-green",
                "--color-blue"
            ],
            { colorCustomPropertyPattern: '/--color/' },
        ],
        "declaration-strict-color-value/blacklist": [
            [
                '#f00',
                '#0f0'
            ]
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

## Problem with custom properties

Plugin can't indestand which custom property is color in this case.

```css
.foo {
    border: var(--my-px-value) solid var(--color-blue)
}
```

As workaround for this problem you should define `colorCustomPropertyPattern` option.

Plugin behaviour:
* if `colorCustomPropertyPattern` is **NOT defined**: plugin checks custom properties at color declaration only (`background-color`, `border-color`, `color`, etc).
```css
/* "declaration-strict-color-value/whitelist": [ ["--color-red"] ] */
.foo {
    border: var(--my-px-value) solid var(--color-blue) /* this is valid */
    border-color: var(--color-red) /* this is valid */
    border-color: var(--color-blue) /* this is invalid */
}
```
* if `colorCustomPropertyPattern` is **defined**: plugin checks custom properties at every declaration but check property name by patterns.
```css
/* "declaration-strict-color-value/whitelist": [ ["--color-red"], { "colorCustomPropertyPattern": "/--color/" } ] */
.foo {
    border: var(--my-px-value) solid var(--color-blue) /* this is invalid */
    border: var(--my-px-value) solid var(--color-red) /* this is valid */
    border-color: var(--color-blue) /* this is invalid */
    border-color: var(--color-red) /* this is valid */
}
```
