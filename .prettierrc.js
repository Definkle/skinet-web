module.exports = {
  singleQuote: true,
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  endOfLine: 'auto',
  bracketSpacing: true,
  bracketSameLine: false,
  semi: true,
  htmlWhitespaceSensitivity: 'ignore',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/api/(.*)$',
    '^@/components/(.*)$',
    '^@/models/(.*)$',
    '^@/services/(.*)$',
    '^@/shared/(.*)$',
    '^@/state/(.*)$',
    '^@/utils/(.*)$',
    '^src/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['decorators-legacy', 'typescript']
};
