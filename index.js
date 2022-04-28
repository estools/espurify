/**
 * espurify - Clone AST without extra properties
 *
 * https://github.com/estools/espurify
 *
 * Copyright (c) 2014-2021 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/estools/espurify/blob/master/MIT-LICENSE.txt
 */
'use strict';

const createWhitelist = require('./lib/create-whitelist');
const cloneWithWhitelist = require('./lib/clone-ast');

function createCloneFunction (options) {
  return cloneWithWhitelist(createWhitelist(options));
}

const espurify = createCloneFunction();
espurify.customize = createCloneFunction;
espurify.cloneWithWhitelist = cloneWithWhitelist;
module.exports = espurify;
