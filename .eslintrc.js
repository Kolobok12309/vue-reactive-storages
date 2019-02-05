module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        indent: [
            'error',
            4,
        ],
        'prefer-destructuring': ['error', {
            array: false,
            object: true,
        }],
        'linebreak-style': ['off', 'windows'],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 'no-debugger': 'off',
        'no-underscore-dangle': ['error', {
            allowAfterThis: true,
        }],
        'no-return-assign': ['error', 'except-parens'],
        'no-bitwise': ['error', {
            allow: ['~'],
        }],
        'vue/attribute-hyphenation': [
            'error',
            'never',
        ],
        'vue/html-end-tags': 'error',
        'vue/html-indent': [
            'error',
            4,
        ],
        'max-len': ['error', { code: 300 }],
        'no-param-reassign': ['error', { props: false }],
        'vue/html-self-closing': 1,
        'vue/require-default-prop': 'error',
        'vue/require-prop-types': 'error',
        'vue/attributes-order': 'error',
        'vue/html-quotes': [
            'error',
            'double',
        ],
        'vue/order-in-components': 'error',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
