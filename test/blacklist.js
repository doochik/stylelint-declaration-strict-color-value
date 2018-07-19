'use strict';

const testRule = require('stylelint-test-rule-tape');
const rule = require('../index').find(rule => rule.ruleName === 'declaration-strict-color-value/blacklist');

// skip non-color declarations
testRule(rule.rule, {
    ruleName: rule.ruleName,
    config: [
        [ '#f00' ],
    ],

    accept: [
        { code: '.foo{ background: 50% no-repeat }' },
        { code: '.foo{ position: absolute }' },
    ],
});

// #hex check
testRule(rule.rule, {
    ruleName: rule.ruleName,
    config: [
        [ '#00f', '#ccc' ],
    ],

    accept: [
        { code: '.foo{ color: #f00 }' },
        { code: '.foo{ border: 1px solid #0f0 }' },
    ],

    reject: [
        {
            code: '.foo{ color: #00f }',
            message: 'Unexpected color "#00f" for property "color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ border: 1px solid #ccc }',
            message: 'Unexpected color "#ccc" for property "border" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
    ],
});

// rgb/rgba check
testRule(rule.rule, {
    ruleName: rule.ruleName,
    config: [
        [ 'rgb(0, 255, 0)', 'rgba(0, 255, 0, 0.1)' ],
    ],

    accept: [
        { code: '.foo{ color: rgb(255, 0, 0) }' },
        { code: '.foo{ border: 1px solid rgba(0, 0, 255, 0.5) }' },
    ],

    reject: [
        {
            code: '.foo{ border: 1px solid rgb(0, 255, 0) }',
            message: 'Unexpected color "rgb(0, 255, 0)" for property "border" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ border: 1px solid rgba(0, 255, 0, 0.1) }',
            message: 'Unexpected color "rgba(0, 255, 0, 0.1)" for property "border" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
    ],
});

// custom properties without pattern
testRule(rule.rule, {
    ruleName: rule.ruleName,
    config: [
        [ '--color-black', '--color-blue' ],
    ],

    accept: [
        { code: '.foo{ background-color: var(--color-red) }' },
        { code: '.foo{ border-color: 1px solid var(--color-green) }' },
        { code: '.foo{ color: var(--color-red) }' },

        // we should skip this declaration if colorCustomPropertyPattern is not defined
        { code: '.foo{ border: var(--my-px-value) solid var(--color-blue) }' },
    ],

    reject: [
        {
            code: '.foo{ background-color: 1px solid var(--color-blue) }',
            message: 'Unexpected color "--color-blue" for property "background-color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ border-color: 1px solid var(--color-black) }',
            message: 'Unexpected color "--color-black" for property "border-color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ color: var(--color-black) }',
            message: 'Unexpected color "--color-black" for property "color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
    ],
});

// custom properties with pattern
testRule(rule.rule, {
    ruleName: rule.ruleName,
    config: [
        [ '--color-black', '--color-blue' ],
        { colorCustomPropertyPattern: '/--color/' },
    ],

    accept: [
        { code: '.foo{ background-color: var(--color-red) }' },
        { code: '.foo{ border: var(--my-px-value) solid var(--color-red) }' },
        { code: '.foo{ border-color: 1px solid var(--color-green) }' },
        { code: '.foo{ border-color: 1px solid var(--green) }' }, // no pattern match
        { code: '.foo{ color: var(--color-red) }' },
    ],

    reject: [
        {
            code: '.foo{ background-color: 1px solid var(--color-blue) }',
            message: 'Unexpected color "--color-blue" for property "background-color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ border: var(--my-px-value) solid var(--color-blue) }',
            message: 'Unexpected color "--color-blue" for property "border" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ border-color: 1px solid var(--color-black) }',
            message: 'Unexpected color "--color-black" for property "border-color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ color: var(--color-black) }',
            message: 'Unexpected color "--color-black" for property "color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
    ],
});
