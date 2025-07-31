# Code Quality and Static Analysis for Element Plus Applications

## Overview

This guide covers implementing comprehensive code quality and static analysis tools for Element Plus applications, including linting, formatting, type checking, security analysis, and automated quality gates.

## ESLint Configuration

### Advanced ESLint Setup

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname
  },
  plugins: [
    '@typescript-eslint',
    'vue',
    'vuejs-accessibility',
    'security',
    'import',
    'unused-imports',
    'simple-import-sort'
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      },
      alias: {
        map: [
          ['@', './src'],
          ['@components', './src/components'],
          ['@utils', './src/utils'],
          ['@stores', './src/stores'],
          ['@types', './src/types']
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue']
      }
    }
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    
    // Vue specific rules
    'vue/multi-word-component-names': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-emits-declaration': 'error',
    'vue/define-props-declaration': 'error',
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    'vue/no-empty-component-block': 'error',
    'vue/no-multiple-template-root': 'off', // Vue 3 allows multiple roots
    'vue/no-unused-components': 'error',
    'vue/no-unused-vars': 'error',
    'vue/no-useless-template-attributes': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/prefer-separate-static-class': 'error',
    'vue/require-macro-variable-name': 'error',
    'vue/script-setup-uses-vars': 'error',
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 3 },
      multiline: { max: 1 }
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'below'
    }],
    
    // Import/Export rules
    'import/order': 'off', // Handled by simple-import-sort
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'simple-import-sort/imports': ['error', {
      groups: [
        // Node.js builtins
        ['^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)'],
        // Packages
        ['^@?\\w'],
        // Internal packages
        ['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'],
        // Side effect imports
        ['^\\u0000'],
        // Parent imports
        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
        // Other relative imports
        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        // Style imports
        ['^.+\\.s?css$']
      ]
    }],
    'simple-import-sort/exports': 'error',
    
    // Unused imports
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    
    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    
    // Accessibility rules
    'vuejs-accessibility/alt-text': 'error',
    'vuejs-accessibility/anchor-has-content': 'error',
    'vuejs-accessibility/aria-props': 'error',
    'vuejs-accessibility/aria-role': 'error',
    'vuejs-accessibility/aria-unsupported-elements': 'error',
    'vuejs-accessibility/click-events-have-key-events': 'error',
    'vuejs-accessibility/form-control-has-label': 'error',
    'vuejs-accessibility/heading-has-content': 'error',
    'vuejs-accessibility/iframe-has-title': 'error',
    'vuejs-accessibility/interactive-supports-focus': 'error',
    'vuejs-accessibility/label-has-for': 'error',
    'vuejs-accessibility/media-has-caption': 'error',
    'vuejs-accessibility/mouse-events-have-key-events': 'error',
    'vuejs-accessibility/no-access-key': 'error',
    'vuejs-accessibility/no-autofocus': 'error',
    'vuejs-accessibility/no-distracting-elements': 'error',
    'vuejs-accessibility/no-onchange': 'error',
    'vuejs-accessibility/no-redundant-roles': 'error',
    'vuejs-accessibility/role-has-required-aria-props': 'error',
    'vuejs-accessibility/tabindex-no-positive': 'error',
    
    // General code quality rules
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    'no-array-constructor': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'no-unreachable': 'error',
    'no-unreachable-loop': 'error',
    'complexity': ['warn', { max: 10 }],
    'max-depth': ['warn', { max: 4 }],
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-params': ['warn', { max: 4 }]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    },
    {
      files: ['**/__tests__/**/*', '**/*.{test,spec}.*'],
      env: {
        jest: true,
        vitest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'security/detect-object-injection': 'off'
      }
    },
    {
      files: ['*.config.*', 'scripts/**/*'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-extraneous-dependencies': 'off'
      }
    }
  ]
}
```

### Custom ESLint Rules

```typescript
// eslint-rules/element-plus-rules.js
module.exports = {
  'prefer-element-plus-components': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Prefer Element Plus components over native HTML elements',
        category: 'Best Practices',
        recommended: true
      },
      fixable: 'code',
      schema: []
    },
    create(context) {
      const elementMappings = {
        'button': 'el-button',
        'input': 'el-input',
        'select': 'el-select',
        'form': 'el-form',
        'table': 'el-table',
        'dialog': 'el-dialog',
        'tooltip': 'el-tooltip',
        'popover': 'el-popover'
      }
      
      return {
        VElement(node) {
          const tagName = node.name
          if (elementMappings[tagName]) {
            context.report({
              node,
              message: `Prefer '${elementMappings[tagName]}' over '${tagName}' for consistency with Element Plus design system`,
              fix(fixer) {
                return fixer.replaceText(node, node.rawName.replace(tagName, elementMappings[tagName]))
              }
            })
          }
        }
      }
    }
  },
  
  'require-component-name': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Require Vue components to have a name property',
        category: 'Essential',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        Program(node) {
          const sourceCode = context.getSourceCode()
          const scriptSetup = sourceCode.ast.body.find(
            n => n.type === 'ExportDefaultDeclaration' && 
                 n.declaration.type === 'CallExpression' &&
                 n.declaration.callee.name === 'defineComponent'
          )
          
          if (scriptSetup) {
            const properties = scriptSetup.declaration.arguments[0]?.properties || []
            const hasName = properties.some(prop => 
              prop.type === 'Property' && 
              prop.key.name === 'name'
            )
            
            if (!hasName) {
              context.report({
                node: scriptSetup,
                message: 'Vue component must have a name property for better debugging and DevTools support'
              })
            }
          }
        }
      }
    }
  },
  
  'no-inline-styles': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow inline styles in Vue templates',
        category: 'Best Practices',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        VAttribute(node) {
          if (node.key.name === 'style' && node.value) {
            context.report({
              node,
              message: 'Avoid inline styles. Use CSS classes or CSS modules instead for better maintainability'
            })
          }
        }
      }
    }
  }
}
```

## Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // Vue specific
  vueIndentScriptAndStyle: true,
  
  // HTML/XML
  htmlWhitespaceSensitivity: 'css',
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Override for specific file types
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue'
      }
    },
    {
      files: ['*.json', '.eslintrc', '.prettierrc'],
      options: {
        parser: 'json',
        trailingComma: 'none'
      }
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 80,
        proseWrap: 'always'
      }
    },
    {
      files: '*.{css,scss,less}',
      options: {
        parser: 'css',
        singleQuote: false
      }
    },
    {
      files: '*.{yaml,yml}',
      options: {
        parser: 'yaml',
        singleQuote: false
      }
    }
  ]
}
```

## TypeScript Configuration for Quality

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    // Bundler mode
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    
    // Strict type checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    // Advanced
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    
    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@stores/*": ["src/stores/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"],
      "@styles/*": ["src/styles/*"]
    },
    
    // Type definitions
    "types": ["vite/client", "element-plus/global", "@types/node"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx",
    "cypress/**/*.ts",
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "playwright.config.*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "**/*.js"
  ]
}
```

## Stylelint Configuration

```javascript
// .stylelintrc.js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-scss',
    'stylelint-selector-bem-pattern',
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-high-performance-animation'
  ],
  rules: {
    // Color
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-named': 'never',
    'color-no-invalid-hex': true,
    
    // Font
    'font-family-name-quotes': 'always-where-recommended',
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    
    // Function
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-name-case': 'lower',
    'function-url-quotes': 'always',
    
    // Number
    'number-leading-zero': 'always',
    'number-max-precision': 3,
    'number-no-trailing-zeros': true,
    
    // String
    'string-no-newline': true,
    'string-quotes': 'single',
    
    // Length
    'length-zero-no-unit': true,
    
    // Unit
    'unit-case': 'lower',
    'unit-no-unknown': true,
    
    // Value
    'value-keyword-case': 'lower',
    'value-list-comma-space-after': 'always-single-line',
    'value-list-comma-space-before': 'never',
    
    // Property
    'property-case': 'lower',
    'property-no-unknown': true,
    'property-no-vendor-prefix': true,
    
    // Declaration
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-no-important': true,
    
    // Declaration block
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    
    // Block
    'block-closing-brace-empty-line-before': 'never',
    'block-closing-brace-newline-after': 'always',
    'block-closing-brace-newline-before': 'always',
    'block-no-empty': true,
    'block-opening-brace-newline-after': 'always',
    'block-opening-brace-space-before': 'always',
    
    // Selector
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'selector-combinator-space-after': 'always',
    'selector-combinator-space-before': 'always',
    'selector-descendant-combinator-no-non-space': true,
    'selector-max-compound-selectors': 4,
    'selector-max-id': 0,
    'selector-max-specificity': '0,3,2',
    'selector-max-universal': 1,
    'selector-no-qualifying-type': true,
    'selector-no-vendor-prefix': true,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-pseudo-element-no-unknown': true,
    'selector-type-case': 'lower',
    'selector-type-no-unknown': true,
    
    // Selector list
    'selector-list-comma-newline-after': 'always',
    'selector-list-comma-space-before': 'never',
    
    // Media feature
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-name-case': 'lower',
    'media-feature-name-no-unknown': true,
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    
    // At-rule
    'at-rule-case': 'lower',
    'at-rule-name-case': 'lower',
    'at-rule-name-space-after': 'always',
    'at-rule-no-unknown': true,
    'at-rule-no-vendor-prefix': true,
    'at-rule-semicolon-newline-after': 'always',
    
    // Comment
    'comment-no-empty': true,
    'comment-whitespace-inside': 'always',
    
    // General
    'indentation': 2,
    'linebreaks': 'unix',
    'max-empty-lines': 2,
    'max-line-length': 100,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-eol-whitespace': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    'no-missing-end-of-source-newline': true,
    
    // Order
    'order/order': [
      'custom-properties',
      'declarations'
    ],
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-wrap',
      'grid',
      'grid-area',
      'grid-template',
      'grid-template-areas',
      'grid-template-rows',
      'grid-template-columns',
      'grid-row',
      'grid-row-start',
      'grid-row-end',
      'grid-column',
      'grid-column-start',
      'grid-column-end',
      'grid-auto-rows',
      'grid-auto-columns',
      'grid-auto-flow',
      'grid-gap',
      'grid-row-gap',
      'grid-column-gap',
      'gap',
      'row-gap',
      'column-gap',
      'align-content',
      'align-items',
      'align-self',
      'justify-content',
      'justify-items',
      'justify-self',
      'order',
      'float',
      'clear',
      'object-fit',
      'overflow',
      'overflow-x',
      'overflow-y',
      'overflow-scrolling',
      'clip',
      'zoom',
      'columns',
      'column-gap',
      'column-fill',
      'column-rule',
      'column-rule-width',
      'column-rule-style',
      'column-rule-color',
      'column-span',
      'column-count',
      'column-width',
      'table-layout',
      'empty-cells',
      'caption-side',
      'border-spacing',
      'border-collapse',
      'list-style',
      'list-style-position',
      'list-style-type',
      'list-style-image',
      'content',
      'quotes',
      'counter-reset',
      'counter-increment',
      'resize',
      'cursor',
      'user-select',
      'nav-index',
      'nav-up',
      'nav-right',
      'nav-down',
      'nav-left',
      'transition',
      'transition-delay',
      'transition-timing-function',
      'transition-duration',
      'transition-property',
      'transform',
      'transform-origin',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-play-state',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',
      'appearance',
      'clip-path',
      'filter',
      'backdrop-filter',
      'opacity',
      'visibility',
      'size',
      'zoom',
      'transform',
      'box-sizing',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border',
      'border-spacing',
      'border-collapse',
      'border-width',
      'border-style',
      'border-color',
      'border-top',
      'border-top-width',
      'border-top-style',
      'border-top-color',
      'border-right',
      'border-right-width',
      'border-right-style',
      'border-right-color',
      'border-bottom',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'border-left',
      'border-left-width',
      'border-left-style',
      'border-left-color',
      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-image',
      'border-image-source',
      'border-image-slice',
      'border-image-width',
      'border-image-outset',
      'border-image-repeat',
      'outline',
      'outline-width',
      'outline-style',
      'outline-color',
      'outline-offset',
      'background',
      'background-color',
      'background-image',
      'background-attachment',
      'background-position',
      'background-position-x',
      'background-position-y',
      'background-clip',
      'background-origin',
      'background-size',
      'background-repeat',
      'box-decoration-break',
      'box-shadow',
      'color',
      'font',
      'font-weight',
      'font-style',
      'font-variant',
      'font-size-adjust',
      'font-stretch',
      'font-size',
      'font-family',
      'src',
      'line-height',
      'letter-spacing',
      'quotes',
      'counter-increment',
      'counter-reset',
      'page-break-before',
      'page-break-inside',
      'page-break-after',
      'max-lines',
      'text-align',
      'text-align-last',
      'text-decoration',
      'text-emphasis',
      'text-emphasis-position',
      'text-emphasis-style',
      'text-emphasis-color',
      'text-indent',
      'text-justify',
      'text-outline',
      'text-transform',
      'text-wrap',
      'text-overflow',
      'text-overflow-ellipsis',
      'text-overflow-mode',
      'text-shadow',
      'white-space',
      'word-spacing',
      'word-wrap',
      'word-break',
      'overflow-wrap',
      'tab-size',
      'hyphens',
      'unicode-bidi',
      'columns',
      'column-count',
      'column-fill',
      'column-gap',
      'column-rule',
      'column-rule-color',
      'column-rule-style',
      'column-rule-width',
      'column-span',
      'column-width',
      'page-break-after',
      'page-break-before',
      'page-break-inside',
      'src'
    ],
    
    // SCSS specific
    'scss/at-extend-no-missing-placeholder': true,
    'scss/at-function-pattern': '^[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
    'scss/at-import-no-partial-leading-underscore': true,
    'scss/at-import-partial-extension-blacklist': ['scss'],
    'scss/at-mixin-pattern': '^[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-pattern': '^[_]?[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
    'scss/percent-placeholder-pattern': '^[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
    'scss/selector-no-redundant-nesting-selector': true,
    
    // Performance
    'plugin/no-low-performance-animation-properties': true,
    
    // Ignored properties
    'plugin/declaration-block-no-ignored-properties': true
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ],
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    'coverage/**/*',
    '**/*.js',
    '**/*.ts'
  ]
}
```

## SonarQube Configuration

```properties
# sonar-project.properties
sonar.projectKey=element-plus-app
sonar.projectName=Element Plus Application
sonar.projectVersion=1.0.0

# Source code
sonar.sources=src
sonar.tests=tests,src/**/__tests__
sonar.exclusions=node_modules/**,dist/**,coverage/**,**/*.spec.ts,**/*.test.ts
sonar.test.exclusions=src/**

# Language settings
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=coverage/test-results.xml

# Code coverage
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts,**/*.d.ts,src/main.ts,src/App.vue

# Duplication
sonar.cpd.exclusions=**/*.spec.ts,**/*.test.ts

# Quality gates
sonar.qualitygate.wait=true

# Analysis parameters
sonar.sourceEncoding=UTF-8
sonar.scm.provider=git

# TypeScript specific
sonar.typescript.tsconfigPath=tsconfig.json

# ESLint integration
sonar.eslint.reportPaths=eslint-report.json

# Security
sonar.security.hotspots.inheritFromParent=true
```

## Quality Gates and CI Integration

```yaml
# .github/workflows/quality-check.yml
name: Code Quality Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type checking
        run: npm run type-check
      
      - name: Lint check
        run: |
          npm run lint
          npm run lint:style
      
      - name: Format check
        run: npm run format:check
      
      - name: Security audit
        run: |
          npm audit --audit-level=moderate
          npm run security:check
      
      - name: Run tests with coverage
        run: npm run test:coverage
      
      - name: Build application
        run: npm run build
      
      - name: Bundle analysis
        run: npm run analyze
      
      - name: SonarQube Scan
        uses: sonarqube-quality-gate-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          scanMetadataReportFile: .scannerwork/report-task.txt
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
      
      - name: Comment PR with quality report
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs')
            
            // Read quality metrics
            const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'))
            const eslintReport = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'))
            
            // Calculate metrics
            const coveragePercent = coverage.total.lines.pct
            const errorCount = eslintReport.reduce((sum, file) => sum + file.errorCount, 0)
            const warningCount = eslintReport.reduce((sum, file) => sum + file.warningCount, 0)
            
            // Create comment
            const comment = `
            ## 📊 Code Quality Report
            
            ### Coverage
            - **Lines**: ${coveragePercent}%
            - **Branches**: ${coverage.total.branches.pct}%
            - **Functions**: ${coverage.total.functions.pct}%
            - **Statements**: ${coverage.total.statements.pct}%
            
            ### Linting
            - **Errors**: ${errorCount}
            - **Warnings**: ${warningCount}
            
            ${coveragePercent >= 80 ? '✅' : '❌'} Coverage threshold: 80%
            ${errorCount === 0 ? '✅' : '❌'} No linting errors
            ${warningCount <= 5 ? '✅' : '⚠️'} Warning threshold: 5
            `
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            })
```

## Package Scripts for Quality

```json
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --cache",
    "lint:check": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --max-warnings 0",
    "lint:report": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --format json --output-file eslint-report.json",
    "lint:style": "stylelint 'src/**/*.{css,scss,vue}' --fix",
    "lint:style:check": "stylelint 'src/**/*.{css,scss,vue}'",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "vue-tsc --noEmit --skipLibCheck",
    "type-check:watch": "vue-tsc --noEmit --skipLibCheck --watch",
    "security:check": "npm audit && snyk test",
    "security:fix": "npm audit fix && snyk wizard",
    "quality:check": "npm run type-check && npm run lint:check && npm run lint:style:check && npm run format:check",
    "quality:fix": "npm run lint && npm run lint:style && npm run format",
    "analyze": "npm run build && npx vite-bundle-analyzer dist/stats.json",
    "sonar": "sonar-scanner",
    "pre-commit": "lint-staged",
    "prepare": "husky install"
  }
}
```

This comprehensive code quality and static analysis setup ensures high code standards, security, and maintainability for Element Plus applications.