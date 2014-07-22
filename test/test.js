var espurify = require('..'),
    esprima = require('esprima'),
    assert = require('assert');

describe('eliminate extra properties from AST output', function () {

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
                                type: 'Identifier',
                                name: 'foo'
                            }
                        ]
                    }
                }
            ]
        });
    });
});
