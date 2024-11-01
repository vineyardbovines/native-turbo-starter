import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import html from "@html-eslint/eslint-plugin"
import markdown from "@eslint/markdown"
import json from "@eslint/json"
import cspell from "@cspell/eslint-plugin/recommended"
import stylistic from "@stylistic/eslint-plugin"
import importX from 'eslint-plugin-import-x'
import promise from "eslint-plugin-promise"
import paths from "eslint-plugin-paths"
import unusedImports from "eslint-plugin-unused-imports"
import react from "@eslint-react/eslint-plugin"
import yml from 'eslint-plugin-yml'
import unicorn from "eslint-plugin-unicorn"
import custom from './rules/index.cjs'

const OFF = 0
const ERROR = 2

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
    arrowParens: "as-needed",
    braceStyle: "1tbs",
    blockSpacing: "always",
    quoteProps: "consistent-as-needed",
    commaDangle: "always-multiline",
  }),
  unicorn.configs['flat/recommended'],
  promise.configs['flat/recommended'],
  cspell,
  // ...react.configs.recommended,

  {
    ignores: [
      ".*",
      "build/**",
      "dist/**",
      "lib/**",
      "*.config.{ts,js}",
      "*.{json,html,md,yaml,yml}"
    ]
  },

  {
    name: "TypeScript",
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "import-x": importX,
      "unused-imports": unusedImports,
      paths,
      custom,
    },
    settings: {
      "import-x/resolver": {
        "typescript": {}
      }
    },
    rules: {
      "@typescript-eslint/naming-convention": [ERROR,
        // default: camelCase or UPPER_CASE variables
        {
          selector: ["variable", "parameter", "property"],
          format: ["camelCase", "UPPER_CASE"],
          trailingUnderscore: "forbid"
        },
        // regular functions must be camelCase
        {
          selector: "function",
          format: ["camelCase"],
          filter: {
            // exclude react components
            regex: "(?:React\\.(?:FC|FunctionComponent)|(?:JSX\\.Element)|(?:Props))",
            match: false
          }
        },
        // destructured variables can return any format
        {
          selector: ["variableLike"],
          modifiers: ["destructured"],
          format: null
        },
        // unused variables must be prefixed with an underscore
        {
          selector: ["variable", "parameter", "property"],
          format: ["camelCase", "UPPER_CASE"],
          modifiers: ["unused"],
          leadingUnderscore: "require",
          trailingUnderscore: "forbid"
        },
        // boolean variables should have a prefix
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "should", "has", "can", "did", "will"]
        },
        // private members must have a leading underscore
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        // enums must be in PascalCase
        {
          selector: ["enum", "enumMember"],
          format: ["PascalCase"],
        },
        // const object declarations and properties must be in PascalCase
        {
          selector: ["property"],
          modifiers: ["const"],
          format: ["PascalCase"]
        },
      ],

      "custom/screaming-as-const": [ERROR],

      "unicorn/prevent-abbreviations": [OFF],
      "unicorn/catch-error-name": [ERROR, { "name": "err" }],
      "unicorn/filename-case": [ERROR, {
        cases: {
          camelCase: true,
          pascalCase: true
        }
      }]
    }
  },

  {
    name: "Import/Export",
    rules: {
      "import-x/newline-after-import": [ERROR, { "considerComments": true }],
      "import-x/no-duplicates": [
        ERROR,
        { "considerQueryString": true, "prefer-inline": true }
      ],
      "import-x/order": [
        ERROR,
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "^react",
              group: "external",
              position: "before",
            },
            {
              pattern: "~/**",
              group: "internal",
            },
          ],
        },
      ],
      "import-x/export": [ERROR],
      "import-x/prefer-default-export": [OFF],
      "import-x/no-anonymous-default-export": [ERROR],
      "import-x/no-default-export": [ERROR],
      "import-x/no-named-as-default": [ERROR],
      "import-x/no-empty-named-blocks": [ERROR],
      "import-x/no-absolute-path": [ERROR],
      "import-x/named": [ERROR],
      "import-x/default": [ERROR],
      "import-x/no-cycle": [ERROR],
      "import-x/no-relative-packages": [ERROR],
      "import-x/no-self-import": [ERROR],
      "import-x/no-unresolved": [ERROR],
      "import-x/no-useless-path-segments": [ERROR],
      "import-x/consistent-type-specifier-style": [ERROR, "prefer-inline"],
      "import-x/first": [ERROR],
      "import-x/no-duplicates": [ERROR],

      "unused-imports/no-unused-imports": [
        ERROR,
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      "paths/alias": ERROR
    }
  },

  {
    name: "React",
    files: [
      "**/*.tsx",
      "**/*.{spec|test}.tsx",
    ],
    rules: {
      "unicorn/filename-case": [ERROR, {
        case: "pascalCase"
      }],

      "@typescript-eslint/naming-convention": [ERROR,
        // React Function Components must be PascalCase
        {
          selector: ["variable", "function"],
          types: ["TSFunctionType", "FunctionExpression", "FunctionDeclaration"],
          format: ["PascalCase"],
          filter: {
            regex: "(?:React\\.(?:FC|FunctionComponent)|(?:JSX\\.Element)|(?:Props))",
            match: true
          }
        },
      ]
    }
  },

  {
    name: "Expo Router",
    files: [
      // router entry path
      "**/app/**/*.{ts,tsx}",
      // exclude adjustment/layout files
      "!**/app/**/[+_]*.{ts,tsx}",
    ],
    rules: {
      // expo router files must have a default export
      "import-x/no-default-export": [OFF],
      "import-x/default": [ERROR],

      // expo router files must be in kebab case
      "unicorn/filename-case": [ERROR, {
        case: "kebabCase",
      }]
    }
  },

  {
    name: "JavaScript",
    files: ['**/*.{js,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },

  {
    name: "HTML",
    files: ["**/*.html"],
    ...html.configs["flat/recommended"],
  },

  {
    name: "Markdown",
    files: ["**/*.md"],
    ...markdown.configs.recommended,
    language: "markdown/gfm",
  },

  {
    name: "JSON",
    files: ["**/*.json"],
    ignores: ["package-lock.json"],
    language: "json/json",
    ...json.configs.recommended,
  },

  {
    name: "JSONC",
    files: ["**/*.jsonc"],
    language: "json/jsonc",
    ...json.configs.recommended,
  },

  {
    name: "JSON5",
    files: ["**/*.json5"],
    language: "json/json5",
    ...json.configs.recommended,
  },

  {
    name: "YAML",
    files: ["**/*.{yaml,yml}"],
    ...yml.configs['flat/standard']
  }
);
