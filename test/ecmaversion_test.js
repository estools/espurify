const espurify = require('..');
const assert = require('assert');
const acorn = require('acorn');
const { describe, it } = require('node:test');

describe('ecmaVersion option', function () {
  describe('es2025', function () {
    it('ImportAttributes', function () {
      const clone = espurify.customize({ ecmaVersion: 2025 });
      const code = `
import foo from "./foo.json" with { type: "json" }
`;
      const ast = acorn.parse(code, { locations: true, ranges: true, ecmaVersion: 2025, sourceType: 'module' });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            source: {
              type: 'Literal',
              value: './foo.json'
            },
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ],
            attributes: [
              {
                type: 'ImportAttribute',
                key: {
                  type: 'Identifier',
                  name: 'type'
                },
                value: {
                  type: 'Literal',
                  value: 'json'
                }
              }
            ]
          }
        ],
        sourceType: 'module'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2024 = espurify.customize({ ecmaVersion: 2024 });
      assert.notDeepEqual(clone2024(ast), expected);
    });
  });

  describe('es2022', function () {
    it('PropertyDefinition, PrivateIdentifier and StaticBlock', function () {
      const clone = espurify.customize({ ecmaVersion: 2022 });
      const code = `
class Foo {
  static #bar;
  static {
    this.#bar = 'baz';
  }
}
`;
      const ast = acorn.parse(code, { locations: true, ranges: true, ecmaVersion: 2022 });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'bar'
                  },
                  value: null,
                  computed: false,
                  static: true
                },
                {
                  type: 'StaticBlock',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          property: {
                            name: 'bar',
                            type: 'PrivateIdentifier'
                          },
                          computed: false,
                          optional: false
                        },
                        right: {
                          type: 'Literal',
                          value: 'baz'
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2021 = espurify.customize({ ecmaVersion: 2021 });
      assert.notDeepEqual(clone2021(ast), expected);
    });
  });

  describe('es2020', function () {
    it('ChainExpression', function () {
      const clone = espurify.customize({ ecmaVersion: 2020 });
      const ast = acorn.parse('obj.aaa?.bbb()?.ccc();', { locations: true, ranges: true, ecmaVersion: 2020 });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'obj'
                        },
                        property: {
                          type: 'Identifier',
                          name: 'aaa'
                        },
                        computed: false,
                        optional: false
                      },
                      property: {
                        type: 'Identifier',
                        name: 'bbb'
                      },
                      computed: false,
                      optional: true
                    },
                    arguments: [],
                    optional: false
                  },
                  property: {
                    type: 'Identifier',
                    name: 'ccc'
                  },
                  computed: false,
                  optional: true
                },
                arguments: [],
                optional: false
              }
            }
          }
        ],
        sourceType: 'script'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2019 = espurify.customize({ ecmaVersion: 2019 });
      assert.notDeepEqual(clone2019(ast), expected);
    });
    it('ExportAllDeclaration', function () {
      const clone = espurify.customize({ ecmaVersion: 2020 });
      const ast = acorn.parse('export * as foo from "mod";', { locations: true, ranges: true, ecmaVersion: 2020, sourceType: 'module' });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'ExportAllDeclaration',
            source: {
              type: 'Literal',
              value: 'mod'
            },
            exported: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ],
        sourceType: 'module'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2019 = espurify.customize({ ecmaVersion: 2019 });
      assert.notDeepEqual(clone2019(ast), expected);
    });
    it('ImportExpression', function () {
      const clone = espurify.customize({ ecmaVersion: 2020 });
      const ast = acorn.parse('import(source);', { locations: true, ranges: true, ecmaVersion: 2020, sourceType: 'module' });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ImportExpression',
              source: {
                type: 'Identifier',
                name: 'source'
              }
            }
          }
        ],
        sourceType: 'module'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2019 = espurify.customize({ ecmaVersion: 2019 });
      assert.notDeepEqual(clone2019(ast), expected);
    });
    it('BigInt literal', function () {
      const clone = espurify.customize({ ecmaVersion: 2020 });
      const ast = acorn.parse('9007199254740991n;', { locations: true, ranges: true, ecmaVersion: 2020 });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 9007199254740991n,
              bigint: '9007199254740991'
            }
          }
        ],
        sourceType: 'script'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2019 = espurify.customize({ ecmaVersion: 2019 });
      assert.notDeepEqual(clone2019(ast), expected);
    });
  });

  describe('es2018', function () {
    it('for-await-of', function () {
      const clone = espurify.customize({ ecmaVersion: 2018 });
      const ast = acorn.parse('async function f() { for await (const x of a()) { assert(x); } }', { locations: true, ranges: true, ecmaVersion: 2018 });
      const expected = {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForOfStatement',
                  await: true,
                  left: {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        init: null
                      }
                    ],
                    kind: 'const'
                  },
                  right: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    arguments: []
                  },
                  body: {
                    type: 'BlockStatement',
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
                              type: 'Identifier',
                              name: 'x'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            generator: false,
            async: true
          }
        ],
        sourceType: 'script'
      };
      assert.deepEqual(clone(ast), expected);
      const clone2017 = espurify.customize({ ecmaVersion: 2017 });
      assert.notDeepEqual(clone2017(ast), expected);
    });
  });

  describe('es2017', function () {
    it('async/await', function () {
      const clone = espurify.customize({ ecmaVersion: 2017 });
      const ast = acorn.parse('async function foo (task) { return await task(); }', { locations: true, ranges: true, ecmaVersion: 2017 });
      const expected = {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              name: 'foo',
              type: 'Identifier'
            },
            params: [
              {
                name: 'task',
                type: 'Identifier'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'AwaitExpression',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        name: 'task',
                        type: 'Identifier'
                      },
                      arguments: []
                    }
                  }
                }
              ]
            },
            generator: false,
            async: true
          }
        ]
      };
      assert.deepEqual(clone(ast), expected);
      const clone2016 = espurify.customize({ ecmaVersion: 2016 });
      assert.notDeepEqual(clone2016(ast), expected);
    });
  });

  describe('es2015', function () {
    it('ArrowFunctionExpression', function () {
      const clone = espurify.customize({ ecmaVersion: 2015 });
      const ast = acorn.parse('evens.map(v => v + 1);', { locations: true, ranges: true, ecmaVersion: 2015 });
      const expected = {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                computed: false,
                object: {
                  type: 'Identifier',
                  name: 'evens'
                },
                property: {
                  type: 'Identifier',
                  name: 'map'
                }
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  id: null,
                  params: [
                    {
                      type: 'Identifier',
                      name: 'v'
                    }
                  ],
                  body: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                      type: 'Identifier',
                      name: 'v'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  },
                  generator: false,
                  // async: false,
                  expression: true
                }
              ]
            }
          }
        ]
      };
      assert.deepEqual(clone(ast), expected);
      const cloneEs5 = espurify.customize({ ecmaVersion: 5 });
      assert.notDeepEqual(cloneEs5(ast), expected);
    });
    it('RegExpLiteral', function () {
      const clone = espurify.customize({ ecmaVersion: 2015 });
      const ast = acorn.parse('var re = /^foo$/im', { locations: true, ranges: true, ecmaVersion: 5 });
      const expected = {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 're'
                },
                init: {
                  type: 'Literal',
                  value: /^foo$/im,
                  regex: {
                    pattern: '^foo$',
                    flags: 'im'
                  }
                }
              }
            ],
            kind: 'var'
          }
        ]
      };
      assert.deepEqual(clone(ast), expected);
      const cloneEs5 = espurify.customize({ ecmaVersion: 5 });
      assert.notDeepEqual(cloneEs5(ast), expected);
    });
  });
});
