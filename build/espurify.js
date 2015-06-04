/**
 * Modules in this bundle
 * 
 * espurify:
 *   license: MIT
 *   author: Takuto Wada <takuto.wada@gmail.com>
 * 
 * isarray:
 *   license: MIT
 *   author: Julian Gruber <mail@juliangruber.com>
 *   maintainers: juliangruber <julian@juliangruber.com>
 * 
 * object-keys:
 *   license: MIT
 *   author: Jordan Harband
 *   maintainers: ljharb <ljharb@gmail.com>
 * 
 * xtend:
 *   licenses: MIT
 *   author: Raynos <raynos2@gmail.com>
 *   contributors: Jake Verbaten, Matt Esch
 * 
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.espurify = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = {
    ArrayExpression: ['type', 'elements'],
    ArrayPattern: ['type', 'elements'],
    ArrowFunctionExpression: ['type', 'id', 'params', 'body', 'generator', 'expression'],
    AssignmentExpression: ['type', 'operator', 'left', 'right'],
    AssignmentPattern: ['type', 'left', 'right'],
    BinaryExpression: ['type', 'operator', 'left', 'right'],
    BlockStatement: ['type', 'body'],
    BreakStatement: ['type', 'label'],
    CallExpression: ['type', 'callee', 'arguments'],
    CatchClause: ['type', 'param', 'guard', 'body'],
    ClassBody: ['type', 'body'],
    ClassDeclaration: ['type', 'id', 'superClass', 'body'],
    ClassExpression: ['type', 'id', 'superClass', 'body'],
    ConditionalExpression: ['type', 'test', 'alternate', 'consequent'],
    ContinueStatement: ['type', 'label'],
    DebuggerStatement: ['type'],
    DoWhileStatement: ['type', 'body', 'test'],
    EmptyStatement: ['type'],
    ExportAllDeclaration: ['type', 'source'],
    ExportDefaultDeclaration: ['type', 'declaration'],
    ExportNamedDeclaration: ['type', 'declaration', 'specifiers', 'source'],
    ExportSpecifier: ['type', 'exported', 'local'],
    ExpressionStatement: ['type', 'expression'],
    ForInStatement: ['type', 'left', 'right', 'body'],
    ForOfStatement: ['type', 'left', 'right', 'body'],
    ForStatement: ['type', 'init', 'test', 'update', 'body'],
    FunctionDeclaration: ['type', 'id', 'params', 'body', 'generator'],
    FunctionExpression: ['type', 'id', 'params', 'body', 'generator'],
    Identifier: ['type', 'name'],
    IfStatement: ['type', 'test', 'consequent', 'alternate'],
    ImportDeclaration: ['type', 'specifiers', 'source'],
    ImportDefaultSpecifier: ['type', 'local'],
    ImportNamespaceSpecifier: ['type', 'local'],
    ImportSpecifier: ['type', 'imported', 'local'],
    LabeledStatement: ['type', 'label', 'body'],
    Literal: ['type', 'value', 'regex'],
    LogicalExpression: ['type', 'operator', 'left', 'right'],
    MemberExpression: ['type', 'object', 'property', 'computed'],
    MetaProperty: ['type', 'meta', 'property'],
    MethodDefinition: ['type', 'key', 'value', 'kind', 'computed', 'static'],
    NewExpression: ['type', 'callee', 'arguments'],
    ObjectExpression: ['type', 'properties'],
    ObjectPattern: ['type', 'properties'],
    Program: ['type', 'body', 'sourceType'],
    Property: ['type', 'key', 'value', 'kind', 'method', 'shorthand', 'computed'],
    RestElement: ['type', 'argument'],
    ReturnStatement: ['type', 'argument'],
    SequenceExpression: ['type', 'expressions'],
    SpreadElement: ['type', 'argument'],
    Super: ['type'],
    SwitchCase: ['type', 'test', 'consequent'],
    SwitchStatement: ['type', 'discriminant', 'cases', 'lexical'],
    TaggedTemplateExpression: ['type', 'tag', 'quasi'],
    TemplateElement: ['type', 'tail', 'value'],
    TemplateLiteral: ['type', 'quasis', 'expressions'],
    ThisExpression: ['type'],
    ThrowStatement: ['type', 'argument'],
    TryStatement: ['type', 'block', 'handler', 'finalizer'],
    UnaryExpression: ['type', 'operator', 'prefix', 'argument'],
    UpdateExpression: ['type', 'operator', 'argument', 'prefix'],
    VariableDeclaration: ['type', 'declarations', 'kind'],
    VariableDeclarator: ['type', 'id', 'init'],
    WhileStatement: ['type', 'test', 'body'],
    WithStatement: ['type', 'object', 'body'],
    YieldExpression: ['type', 'argument', 'delegate']
};

},{}],2:[function(_dereq_,module,exports){
'use strict';

var isArray = _dereq_('isarray');

module.exports = function cloneWithWhitelist (whitelist) {

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

},{"isarray":4}],3:[function(_dereq_,module,exports){
'use strict';

var defaultProps = _dereq_('./ast-properties');
var objectKeys = _dereq_('object-keys');
var extend = _dereq_('xtend');

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

},{"./ast-properties":1,"object-keys":5,"xtend":7}],4:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],5:[function(_dereq_,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = _dereq_('./isArguments');
var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var ctor = object.constructor;
		var skipConstructor = ctor && ctor.prototype === object;

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (!Object.keys) {
		Object.keys = keysShim;
	} else {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":6}],6:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],7:[function(_dereq_,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],8:[function(_dereq_,module,exports){
/**
 * espurify - Clone new AST without extra properties
 * 
 * https://github.com/estools/espurify
 *
 * Copyright (c) 2014-2015 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/estools/espurify/blob/master/MIT-LICENSE.txt
 */
'use strict';

var createWhitelist = _dereq_('./lib/create-whitelist');
var cloneWithWhitelist = _dereq_('./lib/clone-ast');

function createCloneFunction (options) {
    return cloneWithWhitelist(createWhitelist(options));
}

var espurify = createCloneFunction();
espurify.customize = createCloneFunction;
module.exports = espurify;

},{"./lib/clone-ast":2,"./lib/create-whitelist":3}]},{},[8])(8)
});

