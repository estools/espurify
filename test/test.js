var espurify = require('..'),
    esprima = require('esprima'),
    assert = require('assert');

describe('eliminate extra properties from AST output', function () {
    beforeEach(function () {
        this.expected = {
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
                                type: 'Identifier',
                                name: 'foo'
                            }
                        ]
                    }
                }
            ]
        };
    });

    it('eliminate tokens', function () {
        var ast = esprima.parse('assert(foo)', {tolerant: true, tokens: true});
        var purified = espurify(ast);

        assert.deepEqual(ast, {
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
                                type: 'Identifier',
                                name: 'foo'
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
                    type: 'Identifier',
                    value: 'foo'
                },
                {
                    type: 'Punctuator',
                    value: ')'
                }
            ],
            errors: []
        });

        assert.deepEqual(purified, this.expected);
    });

    it('eliminate loc', function () {
        var ast = esprima.parse('assert(foo)', {tolerant: true, loc: true});
        var purified = espurify(ast);
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
                                type: 'Identifier',
                                name: 'foo',
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 7
                                    },
                                    end: {
                                        line: 1,
                                        column: 10
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
                                column: 11
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
                            column: 11
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
                    column: 11
                }
            },
            errors: []
        });

        assert.deepEqual(purified, this.expected);
    });

});
