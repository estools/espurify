## [3.1.0](https://github.com/estools/espurify/releases/tag/v3.1.0) (2024-07-04)


#### Features

* Support ES2023 and ES2024 ([a03f0b2e](https://github.com/estools/espurify/commit/a03f0b2e93c3623010c05e609d7d002e4e877a93))


## [3.0.0](https://github.com/estools/espurify/releases/tag/v3.0.0) (2022-07-17)


#### Features

* [Provide ecmaVersion option to make cloned AST conform to each annual estree spec](https://github.com/estools/espurify/pull/26)
  * set default ecmaVersion to 2022

* [Introduce `espurify.purifyAst` as an alias of default function](https://github.com/estools/espurify/pull/28/files)

* [Rename all WhiteList to AllowList in favor of more inclusive language](https://github.com/estools/espurify/pull/27)

* [Support ES2022 grammar](https://github.com/estools/espurify/commit/f80cfb6f2cc0a44ea4d971312bb52ce449b4c070)
  * support PropertyDefinition
  * support PrivateIdentifier
  * support StaticBlock

* [Support ES2020 grammar](https://github.com/estools/espurify/pull/21)
  * support ChainExpression
  * support ImportExpression
  * support exported property of ExportAllDeclaration
  * support BigInt literals


#### Breaking Changes

This release will not affect most users immediately. There are three notable changes.

1. `espurify` function is still exported as default but deprecated in favor of named exports aiming ESM era, and will be removed in future major releases. Please use `espurify.purifyAst` instead.

2. `espurify.cloneWithWhitelist` is still exported but deprecated in favor of more inclusive language and will be removed in future major releases. Please use `espurify.cloneWithAllowlist` instead.

3. Some new properties will appear in purified AST and may affect deep-equality of the tree, since default ecmaVersion is changed from 2018 to 2022 which add some properties to existing Nodes.

```diff
-  CallExpression: ['type', 'callee', 'arguments'],
+  CallExpression: ['type', 'callee', 'arguments', 'optional'],
-  ExportAllDeclaration: ['type', 'source'],
+  ExportAllDeclaration: ['type', 'source', 'exported'],
-  Literal: ['type', 'value', 'regex'],
+  Literal: ['type', 'value', 'regex', 'bigint'],
```

To make espurify's behavior same as v2, please use `espurify.customize` function with `ecmaVersion: 2018` option.
```
const purify = espurify.customize({ ecmaVersion: 2018 });
const clonedAst = purify(originalAst);
```


### [2.1.1](https://github.com/estools/espurify/releases/tag/v2.1.1) (2021-03-29)


#### Bug Fixes

* Revert relase [2.1.0](https://github.com/estools/espurify/releases/tag/v2.1.0) since it affects to AST matching logic and breaks [some usecases](https://github.com/unassert-js/unassert/issues/18).


## [2.1.0](https://github.com/estools/espurify/releases/tag/v2.1.0) (2021-03-26)


#### Features

* [Support ES2020 grammar](https://github.com/estools/espurify/pull/21)
  * support ChainExpression
  * support ImportExpression
  * support exported property of ExportAllDeclaration
  * support BigInt literals


### [2.0.1](https://github.com/estools/espurify/releases/tag/v2.0.1) (2019-02-15)


#### Bug Fixes

* [Fix cloning when the same object instance is referenced from multiple nodes (and introduce structural cloning)](https://github.com/estools/espurify/pull/13) by [@papandreou](https://github.com/papandreou)


## [2.0.0](https://github.com/estools/espurify/releases/tag/v2.0.0) (2018-11-23)


#### Breaking Changes

* [Remove core-js dependency](https://github.com/estools/espurify/pull/12) by [@goto-bus-stop](https://github.com/goto-bus-stop)

We drop support of ancient (= before ES6) environments. Please use polyfills by your own.

* [Drop support for prebuilt bundle and bower](https://github.com/estools/espurify/commit/266670edb6249ec2316265bd1845515c1de5f344)

We stopped providing prebuilt bundle for browsers. Please build your own by your bundler. We also dropped bower support. Please use npm instead.


### [1.8.1](https://github.com/estools/espurify/releases/tag/v1.8.1) (2018-07-10)


#### Bug Fixes

* [Deal with circular references in AST](https://github.com/estools/espurify/pull/11)


## [1.8.0](https://github.com/estools/espurify/releases/tag/v1.8.0) (2018-05-10)


#### Features

* [Support ES2018 (i.e. async iteration statement: `for-await-of`)](https://github.com/estools/espurify/pull/10)


## [1.7.0](https://github.com/estools/espurify/releases/tag/v1.7.0) (2017-02-24)


#### Features

* [Support ES2017 types and properties](https://github.com/estools/espurify/pull/8)


### [1.6.1](https://github.com/estools/espurify/releases/tag/v1.6.1) (2017-02-13)


#### Bug Fixes

* fix property order of ConditionalExpression ([01c13ada](https://github.com/estools/espurify/commit/01c13adac4ab304c9e5a50bc9bd16f60ad2e872b))


## [1.6.0](https://github.com/estools/espurify/releases/tag/v1.6.0) (2016-05-25)


#### Features

* [Consolidate ponyfills into core-js](https://github.com/estools/espurify/pull/6)


### [1.5.1](https://github.com/estools/espurify/releases/tag/v1.5.1) (2016-03-28)


### Performance Improvements

* [Improve AST clone performance](https://github.com/estools/espurify/pull/5)


## [1.5.0](https://github.com/estools/espurify/releases/tag/v1.5.0) (2015-12-21)


#### Features

* prepend `type` to whitelist if it does not exist ([af941315](https://github.com/estools/espurify/commit/af9413158f12af40cdbadf155c83ec681b3f60cb))


## [1.4.0](https://github.com/estools/espurify/releases/tag/v1.4.0) (2015-12-18)


#### Features

* [expose `cloneWithWhitelist` to deal with non-standard AST trees](https://github.com/estools/espurify/pull/4)


## [1.3.0](https://github.com/estools/espurify/releases/tag/v1.3.0) (2015-06-05)


#### Features

* add `delegate` to YieldExpression ([8ef733ed](https://github.com/estools/espurify/commit/8ef733edf15b49958265c1a866dd57802eda07c2))


## [1.2.0](https://github.com/estools/espurify/releases/tag/v1.2.0) (2015-04-17)


#### Features

* [performance optimization](https://github.com/estools/espurify/pull/1)


## [1.1.0](https://github.com/estools/espurify/releases/tag/v1.1.0) (2015-04-12)


#### Features

* switch to The ESTree Spec to support ES6 ([b9ca486e](https://github.com/estools/espurify/commit/b9ca486ed94f149e1f957ff7890899f171add03b))


#### Bug Fixes

* avoid cloning private (maybe recursive) props ([501b12bf](https://github.com/estools/espurify/commit/501b12bf86816ded4f5183a075a9d08da0ef22bf))


### [1.0.1](https://github.com/estools/espurify/releases/tag/v1.0.1) (2015-03-06)


* replace Array#indexOf with [indexof module](https://www.npmjs.com/package/indexof) to deal with older browsers ([4ba0bd51](https://github.com/estools/espurify/commit/4ba0bd5155ad657e4beb3338dfcd79e443e40d10))
* ship browser build with npm module too ([47e0cc85](https://github.com/estools/espurify/commit/47e0cc85a5d5b92b281ed80216d6908bed591515))


### Moved repository to estools (2014-11-24)


Moved repository from twada/espurify to estools/espurify.


### [1.0.0](https://github.com/estools/espurify/releases/tag/v1.0.0) (2014-11-01)


The first stable release.


### [0.1.3](https://github.com/estools/espurify/releases/tag/v0.1.3) (2014-08-01)


### [0.1.2](https://github.com/estools/espurify/releases/tag/v0.1.2) (2014-07-22)


### [0.1.1](https://github.com/estools/espurify/releases/tag/v0.1.1) (2014-07-22)


### [0.1.0](https://github.com/estools/espurify/releases/tag/v0.1.0) (2014-07-22)


The first release.
