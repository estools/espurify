const espurify = require('..');
const esprima = require('esprima');
const assert = require('assert');
const { describe, it } = require('node:test');

describe('espurify.customize', function () {
  const ast = esprima.parse('assert("foo")', { tolerant: true, tokens: true, loc: true, range: true, raw: true });

  it('default', function () {
    const clone = espurify.customize();
    const purified = clone(ast);
    assert.deepEqual(purified, {
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

  it('raw', function () {
    const clone = espurify.customize({ extra: ['raw'] });
    const purified = clone(ast);
    assert.deepEqual(purified, {
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
      ]
    });
  });

  it('loc', function () {
    const clone = espurify.customize({ extra: ['loc'] });
    const purified = clone(ast);
    assert.deepEqual(purified, {
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
      }
    });
  });

  it('range', function () {
    const clone = espurify.customize({ extra: ['range'] });
    const purified = clone(ast);
    assert.deepEqual(purified, {
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
      ]
    });
  });

  it('loc, range, raw', function () {
    const clone = espurify.customize({ extra: ['loc', 'range', 'raw'] });
    const purified = clone(ast);
    const expected = {
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
              ],
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
                range: [
                  7,
                  12
                ],
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
            range: [
              0,
              13
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
          range: [
            0,
            13
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
        }
      ],
      range: [
        0,
        13
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
    };

    assert.deepEqual(purified, expected);
  });
});
