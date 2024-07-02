/**
 * espurify - Clone AST without extra properties
 *
 * https://github.com/estools/espurify
 *
 * Copyright (c) 2014-2024 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/estools/espurify/blob/master/MIT-LICENSE.txt
 */
'use strict';

const createAllowlist = require('./lib/create-allowlist');
const cloneWithAllowlist = require('./lib/clone-ast');

function createCloneFunction (options) {
  return cloneWithAllowlist(createAllowlist(options));
}

/**
 * @deprecated since version 3.0.0. Use `espurify.purifyAst` instead.
 */
const espurify = createCloneFunction();
espurify.purifyAst = createCloneFunction();
espurify.customize = createCloneFunction;
espurify.cloneWithAllowlist = cloneWithAllowlist;
/**
 * @deprecated since version 3.0.0. Use `espurify.cloneWithAllowlist` instead.
 */
espurify.cloneWithWhitelist = cloneWithAllowlist;
module.exports = espurify;
