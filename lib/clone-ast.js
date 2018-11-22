'use strict';

module.exports = function cloneWithWhitelist (astWhiteList) {
  var whitelist = Object.keys(astWhiteList).reduce(function (props, key) {
    var propNames = astWhiteList[key];
    var prepend = (propNames.indexOf('type') === -1) ? ['type'] : [];
    props[key] = prepend.concat(propNames || []);
    return props;
  }, {});

  function cloneNodeOrObject (obj, seen) {
    var props = obj.type ? whitelist[obj.type] : null;
    if (props) {
      return cloneNode(obj, props, seen);
    } else {
      return cloneObject(obj, seen);
    }
  }

  function cloneArray (ary, seen) {
    var i = ary.length;
    var clone = [];
    while (i--) {
      clone[i] = cloneOf(ary[i], seen);
    }
    return clone;
  }

  function cloneNode (node, props, seen) {
    var i, len, key;
    var clone = {};
    for (i = 0, len = props.length; i < len; i += 1) {
      key = props[i];
      if (node.hasOwnProperty(key)) {
        clone[key] = cloneOf(node[key], seen);
      }
    }
    return clone;
  }

  function cloneObject (obj, seen) {
    var props = Object.keys(obj);
    var i, len, key, value;
    var clone = {};
    for (i = 0, len = props.length; i < len; i += 1) {
      key = props[i];
      value = obj[key];
      if (seen.has(value)) {
        continue;
      }
      clone[key] = cloneOf(value, seen);
    }
    return clone;
  }

  function cloneOf (val, seen) {
    if (typeof val === 'object' && val !== null) {
      seen.set(val, true);
      if (val instanceof RegExp) {
        return new RegExp(val);
      } else if (Array.isArray(val)) {
        return cloneArray(val, seen);
      } else {
        return cloneNodeOrObject(val, seen);
      }
    } else {
      return val;
    }
  }

  function cloneRoot (obj) {
    var seen = new Map();
    seen.set(obj, true);
    return cloneNodeOrObject(obj, seen);
  }

  return cloneRoot;
};
