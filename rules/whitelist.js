'use strict';

const stylelint = require('stylelint');
const valueParser = require('postcss-values-parser');

const namespace = require('../utils/namespace');
const validatePrimaryOption = require('../utils/validatePrimaryOption');

const ruleName = namespace('whitelist');
const messages =  stylelint.utils.ruleMessages(ruleName, {
    unexpected: (property, value) => `Unexpected color "${ value }" for property "${ property }"`,
});

const rule = (primaryOption) => {
    return (root, result) => {
        const validOptions = stylelint.utils.validateOptions(
            result,
            ruleName,
            {
                actual: primaryOption,
                possible: validatePrimaryOption,
            }
        );

        if (!validOptions) {
            return;
        }

        root.walkDecls(decl => {
            const valueAST = valueParser(decl.value, { loose: true }).parse();

            valueAST.walkType('word', child => {
                if (child.isColor) {
                    if (!primaryOption.includes(child.value)) {
                        stylelint.utils.report({
                            message: messages.unexpected(decl.prop, child.value),
                            node: decl,
                            result: result,
                            ruleName: ruleName,
                        });
                    }
                }
            });
        });
    };
};

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
