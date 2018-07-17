'use strict';

const testRule = require('stylelint-test-rule-tape');
const rule = require('../index').find(rule => rule.ruleName === 'declaration-strict-color-value/whitelist');

testRule(rule.rule, {
    ruleName: rule.ruleName,
    config: [
        'var(--red)',
        'var(--green)',
    ],

    accept: [
        { code: '.foo{ color: var(--red) }' },
        { code: '.foo{ border: 1px solid var(--green) }' },
        { code: '.foo{ background: 50% no-repeat }' },
        { code: '.foo{ position: absolute }' },
    ],

    reject: [
        {
            code: '.foo{ color: #f00 }',
            message: 'Unexpected color "#f00" for property "color" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
        {
            code: '.foo{ border: 1px solid #0f0 }',
            message: 'Unexpected color "#0f0" for property "border" (' + rule.ruleName + ')',
            line: 1,
            column: 7,
        },
    ],
});
