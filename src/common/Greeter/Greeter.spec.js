import { describe, expect, it } from '@jest/globals';
import { Greeter, conf } from '#common/Greeter';

describe('module Greeter.js', () => {
	it(`greets you like "${conf.greetText}"`, () => {
		expect.assertions(2);

		const greetTarget = 'dude';
		const gr = new Greeter(greetTarget);

		const greeting = gr.greet();

		expect(greeting).toContain(conf.greetText);
		expect(greeting).toContain(greetTarget);
	});
});
