module.exports = {
	...require('config/eslint-nestjs.cjs'),
	root: true,
	parserOptions: {
		root: true,
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
};
