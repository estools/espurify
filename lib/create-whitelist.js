'use strict';

const defaultProps = require('./ast-properties');

module.exports = function createWhitelist (options) {
  const opts = options || {};
  let typeName, i, len;
  const keys = Object.keys(defaultProps);
  const result = {};
  for (i = 0, len = keys.length; i < len; i += 1) {
    typeName = keys[i];
    result[typeName] = defaultProps[typeName].concat(opts.extra || []);
  }
  return result;
};
