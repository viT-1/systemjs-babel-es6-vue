import {
	describe,
	expect,
	it,
} from '@jest/globals';
import mustache from 'mustache';
import domBySelector from 'dom-by-selector'; // is not supported attribute selectors

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
	const errorAboutAppContainer = mustache.render(conf.warnings.elSelectorIsNotFound, conf);

	it(`should throw error "${errorAboutAppContainer}" if dom isn't correct for Vue app mount`, () => {
		expect.assertions(1);

		document.body.innerHTML = '';

		expect(appVue.init).toThrow(errorAboutAppContainer);
	});

	it(`если DOM содержит ${conf.elSelector}, Vue инициализируется`, () => {
		expect.assertions(1);

		// Перед активацией инициализируем DOM
		document.body.innerHTML = domBySelector(conf.elSelector);
		const v = appVue.init(); // Активируем Vue

		// console.log('jsdom rendering:', document.querySelector(conf.elSelector).outerHTML);

		expect(v).not.toBeNull();
	});
});
