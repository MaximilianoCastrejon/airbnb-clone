module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'import', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'prettier/prettier': 'error',
    'import/no-unresolved': [
      'error',
      {
        plugins: [
          'module-resolve',
          {
            alias: {
              '@components': './src/components',
              '@interfaces': './src/interfaces',
              '@schemas': './src/schemas'
            }
          }
        ]
      }
    ]
  }
};
