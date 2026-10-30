import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

/**
 * Dependency direction (ARCHITECTURE.md §3):
 *   app → features → components → lib, config, content, data, assets, styles
 * Nothing imports from app. Shared UI never imports features. Data never imports UI or copy.
 */
const restrict = (patterns) => ({
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        { group: ['../*', '../**'], message: 'Use the @/ alias for imports outside this folder.' },
        ...patterns,
      ],
    },
  ],
});
const no = (folder, why) => ({ group: [`@/${folder}`, `@/${folder}/**`], message: why });

const NO_APP = no('app', 'Nothing may import from route files (src/app).');
const NO_FEATURES = no('features', 'Shared code must not depend on features.');
const NO_COMPONENTS = no('components', 'This layer must not depend on UI components.');
const NO_CONTENT = no('content', 'This layer must not depend on page copy.');
const NO_MOCK = no('data/mock', 'Read data through @/data/api, never the mock records directly.');

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.logs/**',
    '.next/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    '.claude/**',
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-expect-error': true },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/jsx-no-target-blank': 'error',
    },
  },
  { files: ['scripts/**', 'tests/**', '*.config.*'], rules: { 'no-console': 'off' } },
  { files: ['src/app/**'], rules: restrict([NO_MOCK]) },
  { files: ['src/features/**'], rules: restrict([NO_APP, NO_MOCK]) },
  { files: ['src/components/**'], rules: restrict([NO_APP, NO_FEATURES, NO_MOCK]) },
  {
    files: ['src/lib/**', 'src/config/**'],
    rules: restrict([NO_APP, NO_FEATURES, NO_COMPONENTS, NO_CONTENT, NO_MOCK]),
  },
  {
    files: ['src/content/**'],
    rules: restrict([
      NO_APP,
      NO_FEATURES,
      NO_COMPONENTS,
      no('data', 'Copy must not depend on data. Records belong in src/data/mock.'),
    ]),
  },
  {
    files: ['src/data/**'],
    rules: restrict([NO_APP, NO_FEATURES, NO_COMPONENTS, NO_CONTENT]),
  },
  {
    // No copy typed into JSX: every word comes from src/content.
    files: ['src/app/**/*.tsx', 'src/features/**/*.tsx', 'src/components/**/*.tsx'],
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: false,
          ignoreProps: true,
          allowedStrings: [
            '/',
            '–',
            '—',
            ':',
            '(',
            ')',
            ',',
            '.',
            '|',
            '+',
            '-',
            '×',
            '%',
            '&nbsp;',
          ],
        },
      ],
    },
  },
]);
