'use strict';

var defaultProps = require('./ast-properties');
var objectKeys = require('object-keys');
var extend = require('xtend');

module.exports = function createWhitelist (options) {
    var opts = extend({}, options);
    var typeName, i, len;
    var keys = objectKeys(defaultProps);
    var result = {};
    for (i = 0, len = keys.length; i < len; i += 1) {
        typeName = keys[i];
        result[typeName] = [].concat(defaultProps[typeName]).concat(opts.extra);
    }
    return result;
};
