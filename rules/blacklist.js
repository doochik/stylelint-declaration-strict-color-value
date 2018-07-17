'use strict';

const stylelint = require('stylelint');
const valueParser = require('postcss-values-parser');

const namespace = require('../utils/namespace');

const ruleName = namespace('blacklist');
const messages =  stylelint.utils.ruleMessages(ruleName, {
    unexpected: (property, value) => `Unexpected color "${ value }" for property "${ property }"`,
});

const rule = (primaryOption) => {
    return (root, result) => {
        // TODO: check options
        // const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, { .. })
        // if (!validOptions) { return }
        // ... some logic ...
        // stylelint.utils.report({ .. })

        root.walkDecls(decl => {
            // const value = child.value;
            const valueAST = valueParser(decl.value, { loose: true }).parse();

            valueAST.walk(child => {
                if (child.type === 'word' && child.isColor) {
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

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
