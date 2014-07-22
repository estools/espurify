var espurify = require('..'),
    esprima = require('esprima'),
    assert = require('assert');

it('eliminate extra properties from AST output', function () {
    var ast = esprima.parse('assert(foo)', {tolerant: true, tokens: true});
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

    var purified = espurify(ast);
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
