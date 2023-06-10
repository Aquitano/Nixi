/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'airbnb-base',
		'airbnb-typescript/base',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	root: true,
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: true,
	},
	rules: {
		'@typescript-eslint/ban-ts-comment': 'warn',
		'import/prefer-default-export': 'off',
		'no-console': 'off',
		'no-param-reassign': 'off',
		'import/extensions': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
	},
};
