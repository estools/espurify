'use strict';

var isArray = require('isarray');
var objectKeys = Object.keys || require('object-keys');
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

    function cloneContainer (obj) {
        var props = obj.type ? whitelist[obj.type] : null;
        if (props) {
            return cloneProps(obj, props);
        } else {
            return cloneProps(obj, objectKeys(obj));
        }
    }

    function cloneArray (ary) {
        var i, len, collector = [];
        for (i = 0, len = ary.length; i < len; i += 1) {
            collector.push(cloneOf(ary[i]));
        }
        return collector;
    }

    function cloneProps (obj, props) {
        var i, len, collector = {};
        for (i = 0, len = props.length; i < len; i += 1) {
            cloneProperty(collector, obj, props[i]);
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
            } else if (isArray(val)) {
                return cloneArray(val);
            } else {
                return cloneContainer(val);
            }
        } else {
            return val;
        }
    }

    return cloneContainer;
};
