import {
	describe,
	expect,
	it,
	jest,
} from '@jest/globals';

import indexHtml from '~/index.html';
import { run } from '~/main';

describe('module ~/main', () => {
	// for all tests. document is global variable by jest config > testEnvironment: "jsdom"
	document.body.innerHTML += indexHtml;

	it('runs without errors', () => {
		expect.assertions(1);

		expect(run).not.toThrow();
	});

	it('should greet by console', () => {
		expect.assertions(1);

		const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
		run();

		// eslint-disable-next-line jest/prefer-called-with
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});
});
