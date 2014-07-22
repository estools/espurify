espurify
================================

Eliminate extra properties from AST output


EXAMPLE
---------------------------------------

```javascript
var espurify = require('espurify'),
    esprima = require('esprima'),
    assert = require('assert');

var jsCode = 'assert("foo")';
var ast = esprima.parse(jsCode, {tolerant: true, loc: true});
var purified = espurify(ast);

// original AST
assert.deepEqual(ast, {
    type: 'Program',
    body: [
        {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'assert',
                    loc: {
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    }
                },
                arguments: [
                    {
                        type: 'Literal',
                        value: 'foo',
                        raw: '"foo"',
                        loc: {
                            start: {
                                line: 1,
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 12
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 13
                }
            }
        }
    ],
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
    errors: []
});

// Extra properties eliminated from AST output
assert.deepEqual(purified, {
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
                ]
            }
        }
    ]
});
```


INSTALL
---------------------------------------

### via npm

Install

    $ npm install --save espurify

Use

```javascript
var espurify = require('espurify');
```

### via bower

Install

    $ bower install --save espurify

Load (`espurify` function is exported)

    <script type="text/javascript" src="./path/to/bower_components/espurify/build/espurify.js"></script>



AUTHOR
---------------------------------------
* [Takuto Wada](http://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](http://twada.mit-license.org/) license.
