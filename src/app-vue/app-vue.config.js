import { conf as confGreeterH, options as greeterH } from '#common/greeter-h';

const elSelector = '[iam-app-vue]';

const components = {
	[confGreeterH.tagName]: greeterH,
};

const warnings = {
	elSelectorIsNotFound: '%s is not found!', // printj format
};

export {
	components,
	elSelector,
	warnings,
};
