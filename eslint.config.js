// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const importPlugin = require('eslint-plugin-import');
const pathGroups = [
  {
    pattern: '@api-models',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@app/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@components/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@constants/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@core/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@env/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@features/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@guards/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@interceptors/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@layout/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@models/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@shared/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@state/**',
    group: 'internal',
    position: 'after',
  },
  {
    pattern: '@validators/**',
    group: 'internal',
    position: 'after',
  },
];

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic, angular.configs.tsRecommended],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // TypeScript rules
      '@typescript-eslint/no-empty-object-type': ['error', { allowObjectTypes: 'always', allowInterfaces: 'with-single-extends' }],
      // Import rules - allow relative imports within same feature/domain
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/no-relative-packages': 'off', // Allow relative imports for packages
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          pathGroups,
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: false,
          order: [
            'STRUCTURAL_DIRECTIVE', // *ngIf, *ngFor, *ngSwitch
            'TEMPLATE_REFERENCE', // #templateRef
            'ATTRIBUTE_BINDING', // [attr.role]="..."
            'INPUT_BINDING', // [input]="..."
            'TWO_WAY_BINDING', // [(ngModel)]="..."
            'OUTPUT_BINDING', // (output)="..."
          ],
        },
      ],
    },
  },
]);
