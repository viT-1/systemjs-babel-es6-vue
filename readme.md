## tsconfig and importmap
Easy standardized configuration in this configuration hell of custom plugins.
tsconfig is used to define project aliases to folders (even to single file).
importmap is used to resolve imports to get paths of cdns for js libraries.

## Jest
Jest [is not ready for esm](https://github.com/facebook/jest/issues/9430) and uses Babel transformations spec-files to CommonJs.

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

## Eslint