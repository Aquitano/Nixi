module.exports = {
  ...require('config/eslint-extension.cjs'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
