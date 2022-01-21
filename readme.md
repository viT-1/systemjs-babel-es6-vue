## tsconfig and importmap
Easy standardized configuration in this configuration hell of custom plugins.
tsconfig is used to define project aliases to folders (even to single file).
importmap is used to resolve imports to get paths of cdns for js libraries.

## Babel
Transform-plugins to resolve project alias & extensions:
- [tsconfig-paths-module-resolver](https://www.npmjs.com/package/babel-plugin-tsconfig-paths-module-resolver)
- [add-import-extension](https://www.npmjs.com/package/babel-plugin-add-import-extension)
and Babel plugins for SystemJs & HTML import in components configs:
- [babel-plugin-transform-html-import-to-string](https://www.npmjs.com/package/babel-plugin-transform-html-import-to-string)
- [babel-plugin-replace-import-extension](https://www.npmjs.com/package/babel-plugin-replace-import-extension) to correct `.html.js` import to `.html` for html-plugin
- [@snowpack/babel-plugin-package-import](https://www.npmjs.com/package/@snowpack/babel-plugin-package-import#user-content-plugin-options) to map node_modules imports with [importmap format](https://github.com/wicg/import-maps)
- babel-plugin-system-import-transformer
That's why we should use custom Babel configurations (or separated environments) and not default `babel.config.json`!

Jest can run ES modules with two Babel ways:
- Run jest as usual commonjs by `package.json > scripts`: `"test": "jest --runInBand --no-cache"` and [jest-esm-transformer](https://www.npmjs.com/package/jest-esm-transformer) with `"transform"` setting for jest config and without babel config.
- Native [esm](https://www.npmjs.com/package/esm) by `package.json > scripts`: `"test": "set NODE_ENV=envJest&&node -r esm ./node_modules/jest/bin/jest.js --runInBand --no-cache"` without any `"transform"` setting but `babel.config.json`: `{"env": {"envJest": {"presets": ["@babel/preset-env"]}}}`

## Jest
Jest [is not ready for esm](https://github.com/facebook/jest/issues/9430) and uses Babel transformations spec-files to CommonJs.
"@jest/globals" for strict esm `*.spec.*` files, to free from option `"testEnvironment": "jsdoc"`.

## ESLint
rules:
- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) + [eslint-plugin-jest-formatting](https://www.npmjs.com/package/eslint-plugin-jest-formatting) - rules for Jest tests
- [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) - common dev community rules
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) - rules about esm imports

imports:
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript) resolve alias/paths for project modules which configured in tsconfig.json
- [eslint-import-resolver-node](https://www.npmjs.com/package/eslint-import-resolver-node) used with resolver-typescript, both [instead](https://github.com/viT-1/dist-gh-pages/commit/8fca781dede871be8f8f5d7841f00f3424878b34#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519L37) of using [eslint-import-resolver-alias](https://www.npmjs.com/package/eslint-import-resolver-alias)

## LintHtml