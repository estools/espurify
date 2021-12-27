'use strict';

module.exports = function cloneWithWhitelist (astWhiteList) {
  const whitelist = Object.keys(astWhiteList).reduce(function (props, key) {
    const propNames = astWhiteList[key];
    const prepend = (propNames.indexOf('type') === -1) ? ['type'] : [];
    props[key] = prepend.concat(propNames || []);
    return props;
  }, {});

  function cloneNodeOrObject (clone, obj, seen) {
    const props = obj.type ? whitelist[obj.type] : null;
    if (props) {
      return cloneNode(clone, obj, props, seen);
    } else {
      return cloneObject(clone, obj, seen);
    }
  }

  function cloneArray (clone, ary, seen) {
    let i = ary.length;
    while (i--) {
      if (seen.has(ary[i])) {
        clone[i] = seen.get(ary[i]);
      } else {
        clone[i] = cloneOf(ary[i], seen);
      }
    }
    return clone;
  }

  function cloneNode (clone, node, props, seen) {
    let i, len, key;
    for (i = 0, len = props.length; i < len; i += 1) {
      key = props[i];
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        if (seen.has(node[key])) {
          clone[key] = seen.get(node[key]);
        } else {
          clone[key] = cloneOf(node[key], seen);
        }
      }
    }
    return clone;
  }

  function cloneObject (clone, obj, seen) {
    const props = Object.keys(obj);
    let i, len, key, value;
    for (i = 0, len = props.length; i < len; i += 1) {
      key = props[i];
      value = obj[key];
      if (seen.has(value)) {
        clone[key] = seen.get(value);
      } else {
        clone[key] = cloneOf(value, seen);
      }
    }
    return clone;
  }

  function cloneOf (val, seen) {
    if (typeof val === 'object' && val !== null) {
      if (val instanceof RegExp) {
        return new RegExp(val);
      } else if (Array.isArray(val)) {
        const clone = [];
        seen.set(val, clone);
        return cloneArray(clone, val, seen);
      } else {
        const clone = {};
        seen.set(val, clone);
        return cloneNodeOrObject(clone, val, seen);
      }
    } else {
      return val;
    }
  }

  function cloneRoot (obj) {
    const seen = new Map();
    const clone = {};
    seen.set(obj, clone);
    return cloneNodeOrObject(clone, obj, seen);
  }

  return cloneRoot;
};
