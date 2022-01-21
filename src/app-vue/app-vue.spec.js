import {
	describe,
	expect,
	it,
} from '@jest/globals';
import { sprintf } from 'printj';
// import { parseCssSelector } from '@tokey/css-selector-parser';

import { appVue, conf } from '.';

describe('app-vue.config', () => {
	// like DTD
	it('should export "conf" and contains "components"', () => {
		expect.assertions(2);

		expect(conf).toBeDefined();

		// This test is bad practice - should be implemented with strict defenition typing!
		expect(conf.components).toBeDefined();
	});
});

describe('module ~/app-vue', () => {
	const errorAboutAppContainer = sprintf(conf.warnings.elSelectorIsNotFound, conf.elSelector);

	it(`should throw error "${errorAboutAppContainer}" if dom isn't correct for Vue app mount`, () => {
		expect.assertions(1);

		document.body.innerHTML = '';

		expect(appVue.init).toThrow(errorAboutAppContainer);
	});

	it(`если DOM содержит ${conf.elSelector}, Vue инициализируется`, () => {
		expect.assertions(1);

		// console.log(parseCssSelector(conf.elSelector));

		// Перед активацией инициализируем DOM
		document.body.innerHTML = '<div iam-app-vue><greeter-h/></div>';
		const v = appVue.init(); // Активируем Vue

		// console.log('jsdom rendering:', document.querySelector('[iam-app-vue]').outerHTML);

		expect(v).not.toBeNull();
	});
});
