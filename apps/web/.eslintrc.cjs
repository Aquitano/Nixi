module.exports = {
  ...require('config/eslint-web.js'),
  root: true,
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
