'use strict';

const stylelint = require('stylelint');

const colorsWalker = require('../utils/colorsWalker');
const namespace = require('../utils/namespace');
const validatePrimaryOption = require('../utils/validatePrimaryOption');
const validateSecondaryOption = require('../utils/validateSecondaryOption');

const ruleName = namespace('blacklist');
const messages =  stylelint.utils.ruleMessages(ruleName, {
    unexpected: (property, value) => `Unexpected color "${ value }" for property "${ property }"`,
});

const rule = (primaryOption, secondaryOption) => {
    return (root, result) => {
        const validOptions = stylelint.utils.validateOptions(
            result,
            ruleName,
            {
                actual: primaryOption,
                possible: validatePrimaryOption,
            },
            {
                actual: secondaryOption,
                possible: validateSecondaryOption,
                optional: true,
            }
        );

        if (!validOptions) {
            return;
        }

        colorsWalker(root, secondaryOption, (decl, colorValue) => {
            if (primaryOption.includes(colorValue)) {
                stylelint.utils.report({
                    message: messages.unexpected(decl.prop, colorValue),
                    node: decl,
                    result: result,
                    ruleName: ruleName,
                });
            }
        });
    };
};

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
