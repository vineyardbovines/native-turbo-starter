module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce UPPER_CASE string values in objects with "as const"',
            category: 'Stylistic Issues',
            recommended: false,
        },
        fixable: 'code',
        schema: [],
        messages: {
            screamingRequired: 'String values in "as const" objects must be UPPER_CASE with underscores (SCREAMING_SNAKE_CASE)',
        }
    },

    create(context) {
        function convertToUpperSnakeCase(str) {
            return str
                .replace(/-/g, '_')
                .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
                .toUpperCase();
        }

        return {
            TSAsExpression(node) {
                if (
                    node.typeAnnotation?.type === 'TSTypeReference' &&
                    node.typeAnnotation.typeName?.name === 'const'
                ) {
                    if (node.expression.type === 'ObjectExpression') {
                        node.expression.properties.forEach(property => {
                            if (property.type === 'Property') {
                                const value = property.value;

                                if (value.type === 'Literal' && typeof value.value === 'string') {
                                    const stringValue = value.value;

                                    if (!/^[A-Z][A-Z0-9_]*$/.test(stringValue)) {
                                        context.report({
                                            node: value,
                                            messageId: 'screamingRequired',
                                            fix: function (fixer) {
                                                const fixedValue = convertToUpperSnakeCase(stringValue);
                                                return fixer.replaceText(value, `"${fixedValue}"`);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        };
    }
};
