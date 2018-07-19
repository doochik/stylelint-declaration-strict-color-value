'use strict';

const valueParser = require('postcss-values-parser');

const COLOR_DECL_RE = /color/;

module.exports = (root, secondaryOption = {}, callback) => {
    const colorCustomPropertyPattern = prepareColorCustomPropertyPattern(secondaryOption.colorCustomPropertyPattern);
    root.walkDecls(decl => {
        const valueAST = valueParser(decl.value, { loose: true }).parse();

        valueAST.walk(child => {
            if (child.type === 'word' && child.isColor) {
                callback(decl, child.value);

            } else if (child.type === 'func') {
                if (child.value === 'rgb' || child.value === 'rgba') {
                    callback(decl, child.toString().trim());

                } else if (child.value === 'var') {
                    // check only color prop if colorCustomPropertyPattern is not defined
                    // check every prop if colorCustomPropertyPattern is defined
                    if (COLOR_DECL_RE.test(decl.prop) || colorCustomPropertyPattern) {
                        child.walkType('word', word => {
                            const customPropertyName = word.value;

                            if (colorCustomPropertyPattern) {
                                if (colorCustomPropertyPattern.some(pattern => pattern.test(customPropertyName))) {
                                    callback(decl, customPropertyName);
                                }

                            } else {
                                callback(decl, customPropertyName);
                            }
                        });
                    }
                }
            }

        });
    });
};

function prepareColorCustomPropertyPattern(patterns) {
    if (!patterns) {
        return null;
    }

    if (!Array.isArray(patterns)) {
        patterns = [ patterns ];
    }

    return patterns.map(pattern => {
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            return new RegExp(pattern.slice(1, -1));
        } else {
            return new RegExp(`^${ pattern }$`);
        }
    });
}
