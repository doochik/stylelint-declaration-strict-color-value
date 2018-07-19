'use strict';

module.exports = (secondaryOption) => {
    if (!secondaryOption) {
        return true;
    }

    const colorCustomPropertyPattern = secondaryOption.colorCustomPropertyPattern;
    if (colorCustomPropertyPattern) {
        return (
            (typeof colorCustomPropertyPattern === 'string') ||
            (Array.isArray(colorCustomPropertyPattern) && colorCustomPropertyPattern.every(item => typeof item === 'string'))
        );
    }

    return true;
};
