(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.espurify = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

var traverse = _dereq_('traverse'),
    indexOf = _dereq_('indexof'),
    deepCopy = _dereq_('./lib/ast-deepcopy'),
    astProps = _dereq_('./lib/ast-properties'),
    hasOwn = Object.prototype.hasOwnProperty;

function espurify (node) {
    var result = deepCopy(node);
    traverse(result).forEach(function (x) {
        if (this.parent &&
            this.parent.node &&
            this.parent.node.type &&
            isSupportedNodeType(this.parent.node.type) &&
            !isSupportedKey(this.parent.node.type, this.key))
        {
            this.remove(true);
        }
    });
    return result;
}

function isSupportedNodeType (type) {
    return hasOwn.call(astProps, type);
}

function isSupportedKey (type, key) {
    return indexOf(astProps[type], key) !== -1;
}

module.exports = espurify;

},{"./lib/ast-deepcopy":2,"./lib/ast-properties":3,"indexof":4,"traverse":5}],2:[function(_dereq_,module,exports){
/**
 * Copyright (C) 2012 Yusuke Suzuki (twitter: @Constellation) and other contributors.
 * Released under the BSD license.
 * https://github.com/Constellation/esmangle/blob/master/LICENSE.BSD
 */
'use strict';

var isArray = Array.isArray || function isArray (array) {
    return Object.prototype.toString.call(array) === '[object Array]';
};

function deepCopyInternal (obj, result) {
    var key, val;
    for (key in obj) {
        if (key.lastIndexOf('__', 0) === 0) {
            continue;
        }
        if (obj.hasOwnProperty(key)) {
            val = obj[key];
            if (typeof val === 'object' && val !== null) {
                if (val instanceof RegExp) {
                    val = new RegExp(val);
                } else {
                    val = deepCopyInternal(val, isArray(val) ? [] : {});
                }
            }
            result[key] = val;
        }
    }
    return result;
}

function deepCopy (obj) {
    return deepCopyInternal(obj, isArray(obj) ? [] : {});
}

module.exports = deepCopy;

},{}],3:[function(_dereq_,module,exports){
module.exports = {
    AssignmentExpression: ['type', 'operator', 'left', 'right'],
    ArrayExpression: ['type', 'elements'],
    ArrayPattern: ['type', 'elements'],
    // ArrowFunctionExpression: ['type', 'params', 'defaults', 'rest', 'body', 'generator', 'expression'],
    BlockStatement: ['type', 'body'],
    BinaryExpression: ['type', 'operator', 'left', 'right'],
    BreakStatement: ['type', 'label'],
    CallExpression: ['type', 'callee', 'arguments'],
    CatchClause: ['type', 'param', 'guard', 'body'],
    // ClassBody: ['type', 'body'],
    // ClassDeclaration: ['type', 'id', 'body', 'superClass'],
    // ClassExpression: ['type', 'id', 'body', 'superClass'],
    ConditionalExpression: ['type', 'test', 'consequent', 'alternate'],
    ContinueStatement: ['type', 'label'],
    DebuggerStatement: ['type'],
    // DirectiveStatement: ['type'],
    DoWhileStatement: ['type', 'body', 'test'],
    EmptyStatement: ['type'],
    ExpressionStatement: ['type', 'expression'],
    ForStatement: ['type', 'init', 'test', 'update', 'body'],
    ForInStatement: ['type', 'left', 'right', 'body', 'each'],
    FunctionDeclaration: ['type', 'id', 'params', 'defaults', 'rest', 'body', 'generator', 'expression'],
    FunctionExpression: ['type', 'id', 'params', 'defaults', 'rest', 'body', 'generator', 'expression'],
    Identifier: ['type', 'name'],
    IfStatement: ['type', 'test', 'consequent', 'alternate'],
    Literal: ['type', 'value'],
    LabeledStatement: ['type', 'label', 'body'],
    LogicalExpression: ['type', 'operator', 'left', 'right'],
    MemberExpression: ['type', 'object', 'property', 'computed'],
    // MethodDefinition: ['type', 'key', 'value'],
    NewExpression: ['type', 'callee', 'arguments'],
    ObjectExpression: ['type', 'properties'],
    ObjectPattern: ['type', 'properties'],
    Program: ['type', 'body'],
    Property: ['type', 'key', 'value', 'kind'],
    ReturnStatement: ['type', 'argument'],
    SequenceExpression: ['type', 'expressions'],
    SwitchStatement: ['type', 'discriminant', 'cases', 'lexical'],
    SwitchCase: ['type', 'test', 'consequent'],
    ThisExpression: ['type'],
    ThrowStatement: ['type', 'argument'],
    TryStatement: ['type', 'block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
    UnaryExpression: ['type', 'operator', 'prefix', 'argument'],
    UpdateExpression: ['type', 'operator', 'argument', 'prefix'],
    VariableDeclaration: ['type', 'declarations', 'kind'],
    VariableDeclarator: ['type', 'id', 'init'],
    WhileStatement: ['type', 'test', 'body'],
    WithStatement: ['type', 'object', 'body'],
    YieldExpression: ['type', 'argument']
};

},{}],4:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],5:[function(_dereq_,module,exports){
var traverse = module.exports = function (obj) {
    return new Traverse(obj);
};

function Traverse (obj) {
    this.value = obj;
}

Traverse.prototype.get = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            node = undefined;
            break;
        }
        node = node[key];
    }
    return node;
};

Traverse.prototype.has = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            return false;
        }
        node = node[key];
    }
    return true;
};

Traverse.prototype.set = function (ps, value) {
    var node = this.value;
    for (var i = 0; i < ps.length - 1; i ++) {
        var key = ps[i];
        if (!hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
    }
    node[ps[i]] = value;
    return value;
};

Traverse.prototype.map = function (cb) {
    return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
        if (!this.isRoot || !skip) {
            acc = cb.call(this, acc, x);
        }
    });
    return acc;
};

Traverse.prototype.paths = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.path); 
    });
    return acc;
};

Traverse.prototype.nodes = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.node);
    });
    return acc;
};

Traverse.prototype.clone = function () {
    var parents = [], nodes = [];
    
    return (function clone (src) {
        for (var i = 0; i < parents.length; i++) {
            if (parents[i] === src) {
                return nodes[i];
            }
        }
        
        if (typeof src === 'object' && src !== null) {
            var dst = copy(src);
            
            parents.push(src);
            nodes.push(dst);
            
            forEach(objectKeys(src), function (key) {
                dst[key] = clone(src[key]);
            });
            
            parents.pop();
            nodes.pop();
            return dst;
        }
        else {
            return src;
        }
    })(this.value);
};

function walk (root, cb, immutable) {
    var path = [];
    var parents = [];
    var alive = true;
    
    return (function walker (node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        
        var keepGoing = true;
        
        var state = {
            node : node,
            node_ : node_,
            path : [].concat(path),
            parent : parents[parents.length - 1],
            parents : parents,
            key : path.slice(-1)[0],
            isRoot : path.length === 0,
            level : path.length,
            circular : null,
            update : function (x, stopHere) {
                if (!state.isRoot) {
                    state.parent.node[state.key] = x;
                }
                state.node = x;
                if (stopHere) keepGoing = false;
            },
            'delete' : function (stopHere) {
                delete state.parent.node[state.key];
                if (stopHere) keepGoing = false;
            },
            remove : function (stopHere) {
                if (isArray(state.parent.node)) {
                    state.parent.node.splice(state.key, 1);
                }
                else {
                    delete state.parent.node[state.key];
                }
                if (stopHere) keepGoing = false;
            },
            keys : null,
            before : function (f) { modifiers.before = f },
            after : function (f) { modifiers.after = f },
            pre : function (f) { modifiers.pre = f },
            post : function (f) { modifiers.post = f },
            stop : function () { alive = false },
            block : function () { keepGoing = false }
        };
        
        if (!alive) return state;
        
        function updateState() {
            if (typeof state.node === 'object' && state.node !== null) {
                if (!state.keys || state.node_ !== state.node) {
                    state.keys = objectKeys(state.node)
                }
                
                state.isLeaf = state.keys.length == 0;
                
                for (var i = 0; i < parents.length; i++) {
                    if (parents[i].node_ === node_) {
                        state.circular = parents[i];
                        break;
                    }
                }
            }
            else {
                state.isLeaf = true;
                state.keys = null;
            }
            
            state.notLeaf = !state.isLeaf;
            state.notRoot = !state.isRoot;
        }
        
        updateState();
        
        // use return values to update if defined
        var ret = cb.call(state, state.node);
        if (ret !== undefined && state.update) state.update(ret);
        
        if (modifiers.before) modifiers.before.call(state, state.node);
        
        if (!keepGoing) return state;
        
        if (typeof state.node == 'object'
        && state.node !== null && !state.circular) {
            parents.push(state);
            
            updateState();
            
            forEach(state.keys, function (key, i) {
                path.push(key);
                
                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
                
                var child = walker(state.node[key]);
                if (immutable && hasOwnProperty.call(state.node, key)) {
                    state.node[key] = child.node;
                }
                
                child.isLast = i == state.keys.length - 1;
                child.isFirst = i == 0;
                
                if (modifiers.post) modifiers.post.call(state, child);
                
                path.pop();
            });
            parents.pop();
        }
        
        if (modifiers.after) modifiers.after.call(state, state.node);
        
        return state;
    })(root).node;
}

function copy (src) {
    if (typeof src === 'object' && src !== null) {
        var dst;
        
        if (isArray(src)) {
            dst = [];
        }
        else if (isDate(src)) {
            dst = new Date(src.getTime ? src.getTime() : src);
        }
        else if (isRegExp(src)) {
            dst = new RegExp(src);
        }
        else if (isError(src)) {
            dst = { message: src.message };
        }
        else if (isBoolean(src)) {
            dst = new Boolean(src);
        }
        else if (isNumber(src)) {
            dst = new Number(src);
        }
        else if (isString(src)) {
            dst = new String(src);
        }
        else if (Object.create && Object.getPrototypeOf) {
            dst = Object.create(Object.getPrototypeOf(src));
        }
        else if (src.constructor === Object) {
            dst = {};
        }
        else {
            var proto =
                (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {}
            ;
            var T = function () {};
            T.prototype = proto;
            dst = new T;
        }
        
        forEach(objectKeys(src), function (key) {
            dst[key] = src[key];
        });
        return dst;
    }
    else return src;
}

var objectKeys = Object.keys || function keys (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

function toS (obj) { return Object.prototype.toString.call(obj) }
function isDate (obj) { return toS(obj) === '[object Date]' }
function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
function isError (obj) { return toS(obj) === '[object Error]' }
function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
function isNumber (obj) { return toS(obj) === '[object Number]' }
function isString (obj) { return toS(obj) === '[object String]' }

var isArray = Array.isArray || function isArray (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

forEach(objectKeys(Traverse.prototype), function (key) {
    traverse[key] = function (obj) {
        var args = [].slice.call(arguments, 1);
        var t = new Traverse(obj);
        return t[key].apply(t, args);
    };
});

var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
    return key in obj;
};

},{}]},{},[1])(1)
});

