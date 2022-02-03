## tsconfig and importmap
Easy standardized configuration in this configuration hell of custom plugins.
tsconfig is used to define project aliases to folders (even to single file). [Why aliases](https://stephencharlesweiss.com/typescript-absolute-imports-aliases)?
importmap is used to resolve imports to get paths of cdns for js libraries.

importmaps are fixed with package.json dependencies versions with [mustache.render](https://github.com/viT-1/systemjs-babel-es6-vue/blob/06d7265961464c4c27876d3f5e0af9230bec013a/map-packages.js#L19) and used to resolve (rewrite names to uri paths) modules
by [@snowpack/babel-plugin-package-import](https://www.npmjs.com/package/@snowpack/babel-plugin-package-import#user-content-plugin-options) at [resolve-alias stage](https://github.com/viT-1/systemjs-babel-es6-vue/blob/b59b7c91a3da7d0cf5077c66742b64ab85b7bdb4/package.json#L24)

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
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue) for vue components but [can't lint vue html templates](https://github.com/vuejs/vue-eslint-parser/issues/28) if they are [non-SFC](https://github.com/vuejs/eslint-plugin-vue/issues/490).
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) - rules about esm imports

imports:
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript) resolve alias/paths for project modules which configured in tsconfig.json
- [eslint-import-resolver-node](https://www.npmjs.com/package/eslint-import-resolver-node) used with resolver-typescript, both [instead](https://github.com/viT-1/dist-gh-pages/commit/8fca781dede871be8f8f5d7841f00f3424878b34#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519L37) of using [eslint-import-resolver-alias](https://www.npmjs.com/package/eslint-import-resolver-alias)

## LintHtml

## CSS Linting

## CSS @import paths resolving
Nowadays is very popular CSS-in-JS, it is not our case (Babel plugins for CSS aren't suitable).
This project use classic practice without importing css files into js.

Alias solutions (isn't used):
- [css-aliases](https://www.npmjs.com/package/css-aliases) only to get resolved path, not inlining files content
- [css-import-resolve](https://csstools.github.io/css-import-resolve/)
- [postcss-import-alias-resolver](https://www.npmjs.com/package/postcss-import-alias-resolver)

But I don't need another config "aliases" format, I need tsconfig paths support!
Found tsconfig format compatible solution for sass (but I don't use SASS here): [sass-extended-importer](https://github.com/wessberg/sass-extended-importer#path-mappingaliasing).

For `*.css` files with `@import` tsconfig paths I made utility script `tsconfig-path-resolver.js` based on:
- [arg](https://www.npmjs.com/package/arg) for cli set config path;
- [find-root](https://www.npmjs.com/package/find-root) for utility paths independence;
- [readdirp](https://www.npmjs.com/package/readdirp) to get all paths by file extension mask;
- [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) for resolving paths by tsconfig settings.
Utility isn't inlining content from resolved path files, only paths rewrited.

## Minify
This project isn't used any bundlers, all steps realised as npm scripts. Therefore, separate core modules are used for minifying.
- JS: [minify-all-js](https://www.npmjs.com/package/minify-all-js) based on [terser](https://www.npmjs.com/package/terser) & [node-minify](https://www.npmjs.com/package/@node-minify/core) for recursive files iteration, which [is not supported by terser](https://github.com/terser/terser/issues/544#issuecomment-626350611) nowadays.
- CSS: This project is used optimizer & inliner [clean-css](https://www.npmjs.com/package/clean-css).
- StylusCSS: I like possibilities of [inbrowser transforming](https://stylus-lang.com/try.html) with [Stylus](https://www.npmjs.com/package/stylus) and don't like to make CSS syntax so complex like JS do. Stylus [has glob import](https://github.com/stylus/stylus/issues/1711#issuecomment-164995761) and can [compress StylusCSS](https://github.com/stylus/stylus/issues/2354) but [only for](https://github.com/stylus/stylus/issues/2154#issuecomment-203168846) `*.styl` files configured with [CSSO plugin](https://github.com/stylus/stylus/issues/2318#issuecomment-319385404). Another (modern) solution is [PostCSS](https://www.npmjs.com/package/postcss-cli) which has these two abilities too. By the way, Stylus [resolver is not extensionable](https://github.com/stylus/stylus/issues/2039) :(
- In complex may be used [suggested by terser issue](https://github.com/terser/terser/issues/544#issuecomment-626350611) solution: [ucompress](https://github.com/WebReflection/ucompress)

## CSS code conventions
Not using scoped CSS, prior to BEM methodology in [iAMCss interpretation](https://vit-1.github.io/iAMcss-samples/).
Native [CSS-variables](https://dev.to/idoshamun/theming-with-css-variables-322f) used with [iAMCss theming](https://github.com/viT-1/iAMcss/blob/master/styleguide.md#%D0%BC%D0%BE%D0%B4%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80-%D1%82%D0%B5%D0%BC%D1%8B-skin--view) ([theming live demo](https://vit-1.github.io/iAMcss-samples/v3/aria-collapsable/)) and [iAMCss naming](https://github.com/viT-1/iAMcss/blob/master/v3/styleguide.md#%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D1%81%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-iam-%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82%D0%BE%D0%B2). CSSO [about variables](https://github.com/css/csso/issues/443).

## No need for project but peer dependencies =(
- [vue-template-compiler](https://github.com/vuejs/vue-test-utils/issues/1399#issuecomment-1023985291). This project isn't used .vue files...