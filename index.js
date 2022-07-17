/**
 * espurify - Clone AST without extra properties
 *
 * https://github.com/estools/espurify
 *
 * Copyright (c) 2014-2022 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/estools/espurify/blob/master/MIT-LICENSE.txt
 */
'use strict';

const createAllowlist = require('./lib/create-allowlist');
const cloneWithAllowlist = require('./lib/clone-ast');

function createCloneFunction (options) {
  return cloneWithAllowlist(createAllowlist(options));
}

const espurify = createCloneFunction();
espurify.customize = createCloneFunction;
espurify.cloneWithAllowlist = cloneWithAllowlist;
espurify.cloneWithWhitelist = cloneWithAllowlist;
module.exports = espurify;
