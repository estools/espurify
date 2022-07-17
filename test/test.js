const espurify = require('..');
const esprima = require('esprima');
const estraverse = require('estraverse');
const babelTypes = require('babel-types');
const babylon = require('babylon');
const fs = require('fs');
const path = require('path');
const syntax = estraverse.Syntax;
const assert = require('assert');

describe('eliminate extra properties from AST output', function () {
  let expected;
  beforeEach(() => {
    expected = {
      type: 'Program',
      sourceType: 'script',
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
    };
  });

  it('eliminate tokens and raw', function () {
    const ast = esprima.parse('assert("foo")', { tolerant: true, tokens: true, raw: true });
    const purified = espurify(ast);

    assert.deepEqual(ast, {
      type: 'Program',
      sourceType: 'script',
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
                value: 'foo',
                raw: '"foo"'
              }
            ]
          }
        }
      ],
      tokens: [
        {
          type: 'Identifier',
          value: 'assert'
        },
        {
          type: 'Punctuator',
          value: '('
        },
        {
          type: 'String',
          value: '"foo"'
        },
        {
          type: 'Punctuator',
          value: ')'
        }
      ],
      errors: []
    });

    assert.deepEqual(purified, expected);
  });

  it('eliminate range', function () {
    const ast = esprima.parse('assert("foo")', { tolerant: true, range: true });
    const purified = espurify(ast);
    assert.deepEqual(ast, {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'assert',
              range: [
                0,
                6
              ]
            },
            arguments: [
              {
                type: 'Literal',
                value: 'foo',
                raw: '"foo"',
                range: [
                  7,
                  12
                ]
              }
            ],
            range: [
              0,
              13
            ]
          },
          range: [
            0,
            13
          ]
        }
      ],
      range: [
        0,
        13
      ],
      errors: []
    });
    assert.deepEqual(purified, expected);
  });

  it('eliminate loc', function () {
    const ast = esprima.parse('assert("foo")', { tolerant: true, loc: true });
    const purified = espurify(ast);

    assert.deepEqual(ast, {
      type: 'Program',
      sourceType: 'script',
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

    assert.deepEqual(purified, expected);
  });

  it('eliminate custom property', function () {
    const ast = esprima.parse('assert("foo")', { tolerant: true, raw: true });
    estraverse.replace(ast, {
      leave: function (currentNode, parentNode) {
        if (currentNode.type === syntax.Literal && typeof currentNode.raw !== 'undefined') {
          currentNode['x-verbatim-bar'] = {
            content: currentNode.raw,
            precedence: 18 // escodegen.Precedence.Primary
          };
          return currentNode;
        } else {
          return undefined;
        }
      }
    });
    const purified = espurify(ast);

    assert.deepEqual(ast, {
      type: 'Program',
      sourceType: 'script',
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
                value: 'foo',
                raw: '"foo"',
                'x-verbatim-bar': {
                  content: '"foo"',
                  precedence: 18
                }
              }
            ]
          }
        }
      ],
      errors: []
    });

    assert.deepEqual(purified, expected);
  });
});

function traverse (object, currentKey, visitor) {
  let key, child;
  visitor(object, currentKey);
  for (key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child, key, visitor);
      }
    }
  }
}

describe('cloneWithAllowlist', function () {
  let ast;
  beforeEach(function () {
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', 'CounterContainer.jsx'), 'utf8');
    const babelAst = babylon.parse(code, {
      sourceType: 'module',
      plugins: [
        'classProperties',
        'jsx',
        'flow'
      ]
    });
    ast = babelAst.program;
  });
  it('complete allowlist', function () {
    const astAllowList = Object.keys(babelTypes.BUILDER_KEYS).reduce(function (props, key) {
      props[key] = ['type'].concat(babelTypes.BUILDER_KEYS[key]);
      return props;
    }, {});
    const purifyAst = espurify.cloneWithAllowlist(astAllowList);
    const purified = purifyAst(ast);
    traverse(purified, null, function (node, key) {
      assert.notEqual(key, 'loc');
      assert.notEqual(key, 'start');
      assert.notEqual(key, 'end');
    });
  });
  it('babel.types.BUILDER_KEYS', function () {
    const purifyAst = espurify.cloneWithAllowlist(babelTypes.BUILDER_KEYS);
    const purified = purifyAst(ast);
    traverse(purified, null, function (node, key) {
      assert.notEqual(key, 'loc');
      assert.notEqual(key, 'start');
      assert.notEqual(key, 'end');
    });
  });
});

it('should not break when the same object instance is referenced twice', function () {
  const loc = { start: { line: 4, column: 0 }, end: { line: 4, column: 9 } };
  const root = {
    type: 'Program',
    sourceType: 'script',
    body: [
      {
        type: 'DebuggerStatement',
        loc
      },
      {
        type: 'DebuggerStatement',
        loc
      }
    ]
  };

  const clone = espurify.customize({ extra: ['loc'] });
  assert.deepEqual(clone(root), {
    type: 'Program',
    sourceType: 'script',
    body: [
      {
        type: 'DebuggerStatement',
        loc
      },
      {
        type: 'DebuggerStatement',
        loc
      }
    ]
  });
});

describe('dealing with circular references in AST', function () {
  it('circular references in standard node tree', function () {
    const ident = {
      type: 'Identifier',
      name: 'assert'
    };
    const literal = {
      type: 'Literal',
      value: 'foo',
      raw: '"foo"'
    };
    const callExp = {
      type: 'CallExpression',
      callee: ident,
      arguments: [literal]
    };
    ident.parent = callExp;
    literal.parent = callExp;
    const expStmt = {
      type: 'ExpressionStatement',
      expression: callExp
    };
    callExp.parent = expStmt;
    const program = {
      type: 'Program',
      sourceType: 'script',
      body: [expStmt],
      errors: []
    };
    expStmt.parent = program;

    assert.deepEqual(espurify(program), {
      type: 'Program',
      sourceType: 'script',
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
  });

  it('circular references in non-standard node tree', function () {
    const key0 = {
      type: 'Identifier',
      name: 'qty'
    };
    const value0 = {
      type: 'NumberTypeAnnotation'
    };
    const prop0 = {
      type: 'ObjectTypeProperty',
      key: key0,
      value: value0
    };
    key0.parent = prop0;
    value0.parent = prop0;
    const key1 = {
      type: 'Identifier',
      name: 'total'
    };
    const value1 = {
      type: 'NumberTypeAnnotation'
    };
    const prop1 = {
      type: 'ObjectTypeProperty',
      key: key1,
      value: value1
    };
    key1.parent = prop1;
    value1.parent = prop1;
    const right = {
      type: 'ObjectTypeAnnotation',
      properties: [
        prop0,
        prop1
      ],
      indexers: [],
      callProperties: []
    };
    prop0.parent = right;
    prop1.parent = right;
    const id = {
      type: 'Identifier',
      name: 'CounterContainerStateType'
    };
    const root = { type: 'TypeAlias', id, typeParameters: null, right };
    id.parent = root;
    right.parent = root;

    const expected = {
      type: 'TypeAlias',
      id: {
        type: 'Identifier',
        name: 'CounterContainerStateType'
      },
      typeParameters: null,
      right: {
        type: 'ObjectTypeAnnotation',
        properties: [
          {
            type: 'ObjectTypeProperty',
            key: {
              type: 'Identifier',
              name: 'qty'
            },
            value: {
              type: 'NumberTypeAnnotation'
            }
          },
          {
            type: 'ObjectTypeProperty',
            key: {
              type: 'Identifier',
              name: 'total'
            },
            value: {
              type: 'NumberTypeAnnotation'
            }
          }
        ],
        indexers: [],
        callProperties: []
      }
    };
    expected.right.parent = expected;
    expected.right.properties[0].parent = expected.right;
    expected.right.properties[0].value.parent = expected.right.properties[0];
    expected.right.properties[1].parent = expected.right;
    expected.right.properties[1].value.parent = expected.right.properties[1];

    assert.deepEqual(espurify(root), expected);
  });
});
