module.exports = {
  ...require('config/eslint-nestjs.js'),
  root: true,
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
