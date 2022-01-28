import { conf as confGreeterH, options as greeterH } from '#common/greeter-h';

const elSelector = '#app-vue';

const components = {
	[confGreeterH.tagName]: greeterH,
};

const warnings = {
	elSelectorIsNotFound: '{{elSelector}} is not found!', // mustache format
};

export {
	components,
	elSelector,
	warnings,
};
