var espurify = require('..'),
    esprima = require('esprima'),
    assert = require('assert');

describe('espurify.customize', function () {
    var ast = esprima.parse('assert("foo")', {tolerant: true, tokens: true, loc: true, range: true, raw: true});


    it('default', function () {
        var clone = espurify.customize();
        var purified = clone(ast);
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
        var clone = espurify.customize({extra: ['raw']});
        var purified = clone(ast);
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
        var clone = espurify.customize({extra: ['loc']});
        var purified = clone(ast);
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
        var clone = espurify.customize({extra: ['range']});
        var purified = clone(ast);
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
        var clone = espurify.customize({extra: ['loc', 'range', 'raw']});
        var purified = clone(ast);
        var expected = {
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
