'use strict';

module.exports = (primaryOption) => {
    if (!Array.isArray(primaryOption)) {
        return false;
    }

    return primaryOption.every(item => Boolean(item && typeof item === 'string'));
};
