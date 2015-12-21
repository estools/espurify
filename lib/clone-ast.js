'use strict';

var isArray = require('isarray');
var objectKeys = require('object-keys');
var indexOf = require('indexof');
var reduce = require('array-reduce');

module.exports = function cloneWithWhitelist (astWhiteList) {
    var whitelist = reduce(objectKeys(astWhiteList), function (props, key) {
        var currentProps = astWhiteList[key];
        var prepend = [];
        if (indexOf(currentProps, 'type') === -1) {
            prepend.push('type');
        }
        props[key] = prepend.concat(currentProps);
        return props;
    }, {});

    function cloneRoot (ast) {
        return cloneContainer({}, ast);
    }

    function cloneContainer (collector, obj) {
        if (isArray(obj)) {
            return cloneArray(collector, obj);
        } else if (obj.type && whitelist[obj.type]) {
            return cloneNode(collector, obj);
        } else {
            return cloneObj(collector, obj);
        }
    }

    function cloneArray (collector, ary) {
        var i, len;
        for (i = 0, len = ary.length; i < len; i += 1) {
            collector.push(cloneOf(ary[i]));
        }
        return collector;
    }

    function cloneNode (collector, obj) {
        var i, len, props = whitelist[obj.type];
        for (i = 0, len = props.length; i < len; i += 1) {
            cloneProperty(collector, obj, props[i]);
        }
        return collector;
    }

    function cloneObj (collector, obj) {
        var key;
        for (key in obj) {
            cloneProperty(collector, obj, key);
        }
        return collector;
    }

    function cloneProperty (collector, obj, key) {
        if (obj.hasOwnProperty(key)) {
            collector[key] = cloneOf(obj[key]);
        }
    }

    function cloneOf (val) {
        if (typeof val === 'object' && val !== null) {
            if (val instanceof RegExp) {
                return new RegExp(val);
            } else {
                return cloneContainer(isArray(val) ? [] : {}, val);
            }
        } else {
            return val;
        }
    }

    return cloneRoot;
};
