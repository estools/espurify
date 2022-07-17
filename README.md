espurify
================================

Clone AST without extra properties

[![Build Status][ci-image]][ci-url]
[![NPM version][npm-image]][npm-url]
[![Code Style][style-image]][style-url]
[![License][license-image]][license-url]


API
---------------------------------------

### const purifiedAstClone = espurify.purifyAst(originalAst)
(note: using `espurify` as a default exported function is deprecated in favor of named exports aiming ESM era, and will be removed from future releases)

Returns new clone of `originalAst` but without extra properties.

Leaves properties defined in [The ESTree Spec](https://github.com/estree/estree) (formerly known as [Mozilla SpiderMonkey Parser API](https://speakerdeck.com/michaelficarra/spidermonkey-parser-api-a-standard-for-structured-js-representations)) only. Also note that extra informations (such as `loc`, `range` and `raw`) are eliminated too.

#### Supported ECMAScript versions

- [ES5](https://github.com/estree/estree/blob/master/es5.md)
- [ES2015](https://github.com/estree/estree/blob/master/es2015.md)
- [ES2016](https://github.com/estree/estree/blob/master/es2016.md)
- [ES2017](https://github.com/estree/estree/blob/master/es2017.md)
- [ES2018](https://github.com/estree/estree/blob/master/es2018.md)
- [ES2019](https://github.com/estree/estree/blob/master/es2019.md)
- [ES2020](https://github.com/estree/estree/blob/master/es2020.md)
- [ES2021](https://github.com/estree/estree/blob/master/es2021.md)
- [ES2022](https://github.com/estree/estree/blob/master/es2022.md)


### const customizedCloneFunctionWithAllowList = espurify.cloneWithAllowlist(allowList)
(note: `espurify.cloneWithWhitelist` is still exported but deprecated in favor of more inclusive language and will be removed from future releases)

Returns customized function for cloning AST, with user-provided `allowList`.


### const purifiedAstClone = customizedCloneFunctionWithAllowList(originalAst)

Returns new clone of `originalAst` by customized function.


#### allowList

| type     | default value |
|:---------|:--------------|
| `object` | N/A           |

`allowList` is an object containing NodeType as keys and properties as values.

```js
{
    ArrayExpression: ['type', 'elements'],
    ArrayPattern: ['type', 'elements'],
    ArrowFunctionExpression: ['type', 'id', 'params', 'body', 'generator', 'expression'],
    AssignmentExpression: ['type', 'operator', 'left', 'right'],
    ...
```


### const customizedCloneFunction = espurify.customize(options)

Returns customized function for cloning AST, configured by custom `options`.


### const purifiedAstClone = customizedCloneFunction(originalAst)

Returns new clone of `originalAst` by customized function.



#### options

| type     | default value |
|:---------|:--------------|
| `object` | `{}`          |

Configuration options. If not passed, default options will be used.


#### options.ecmaVersion

| type                 | default value |
|:---------------------|:--------------|
| `string` or `number` | `2022`        |

Indicates the ECMAScript version to clone. Must be either 5, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022.


#### options.extra

| type                | default value |
|:--------------------|:--------------|
| `array` of `string` | null          |

List of extra properties to be left in result AST. For example, functions returned by `espurify.customize({extra: ['raw']})` will preserve `raw` properties of `Literal`. Functions return by `espurify.customize({extra: ['loc', 'range']})` will preserve `loc` and `range` properties of each Node.


EXAMPLE
---------------------------------------

```javascript
const espurify = require('espurify');
const estraverse = require('estraverse');
const acorn = require('acorn');
const syntax = estraverse.Syntax;
const assert = require('assert');

const jsCode = 'assert("foo")';

// Adding extra informations to AST
const originalAst = acorn.parse(jsCode, { locations: true, ranges: true, ecmaVersion: 2022 });
estraverse.replace(originalAst, {
  leave: function (currentNode, parentNode) {
    if (currentNode.type === syntax.Literal && typeof currentNode.raw !== 'undefined') {
      currentNode['x-verbatim-bar'] = {
        content : currentNode.raw,
        precedence : 18  // escodegen.Precedence.Primary
      };
      return currentNode;
    } else {
      return undefined;
    }
  }
});


// purify AST
const purifiedClone = espurify.purifyAst(originalAst);


// Extra properties are eliminated from cloned AST
assert.deepEqual(purifiedClone, {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'assert'
        },
        arguments: [
          {
            type: 'Literal',
            value: 'foo'
          }
        ],
        optional: false
      }
    }
  ],
  sourceType: 'script'
});


// original AST is not modified
assert.deepEqual(originalAst,{
  type: 'Program',
  start: 0,
  end: 13,
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 1,
      column: 13
    }
  },
  range: [
    0,
    13
  ],
  body: [
    {
      type: 'ExpressionStatement',
      start: 0,
      end: 13,
      loc: {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 1,
          column: 13
        }
      },
      range: [
        0,
        13
      ],
      expression: {
        type: 'CallExpression',
        start: 0,
        end: 13,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 13
          }
        },
        range: [
          0,
          13
        ],
        callee: {
          type: 'Identifier',
          start: 0,
          end: 6,
          loc: {
            start: {
              line: 1,
              column: 0
            },
            end: {
              line: 1,
              column: 6
            }
          },
          range: [
            0,
            6
          ],
          name: 'assert'
        },
        arguments: [
          {
            type: 'Literal',
            start: 7,
            end: 12,
            loc: {
              start: {
                line: 1,
                column: 7
              },
              end: {
                line: 1,
                column: 12
              }
            },
            range: [
              7,
              12
            ],
            value: 'foo',
            raw: '"foo"',
            "x-verbatim-bar": {
              content: '"foo"',
              precedence: 18
            }
          }
        ],
        optional: false
      }
    }
  ],
  sourceType: 'script'
});
```


INSTALL
---------------------------------------

### via npm

Install

    $ npm install --save espurify

Use

```javascript
const espurify = require('espurify');
```


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


CONTRIBUTORS
---------------------------------------
* [Renée Kooi](https://github.com/goto-bus-stop)
* [Andreas Lind](https://github.com/papandreou)


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/estools/espurify/blob/master/MIT-LICENSE.txt) license.


[npm-url]: https://npmjs.org/package/espurify
[npm-image]: https://badge.fury.io/js/espurify.svg

[ci-image]: https://github.com/estools/espurify/workflows/Node.js%20CI/badge.svg
[ci-url]: https://github.com/estools/espurify/actions?query=workflow%3A%22Node.js+CI%22

[style-url]: https://github.com/Flet/semistandard
[style-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg

[license-url]: https://github.com/estools/espurify/blob/master/MIT-LICENSE.txt
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
