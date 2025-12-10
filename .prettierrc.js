const importOrder = [
  '<BUILTIN_MODULES>',
  '',
  '<THIRD_PARTY_MODULES>',
  '',
  '^(@api-models|@app|@components|@constants|@core|@env|@features|@guards|@resolvers|@interceptors|@layout|@models|@shared|@state|@validators)(/.*)$',
  '',
  '^[.][.]/(.*)$',
  '',
  '^[.]/(.*)$',
];

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
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};
