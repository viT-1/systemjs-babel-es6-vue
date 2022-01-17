import { describe, expect, it } from '@jest/globals';

import { GreeterUse } from '#common/GreeterUse';
import { conf as GreeterConf } from '#common/Greeter';

describe('module GreeterUse.js', () => {
	it(`greet by default "${GreeterConf.defaultTarget}"`, () => {
		expect.assertions(1);

		expect(GreeterUse.say()).toContain(GreeterConf.defaultTarget);
	});

	const customTarget = 'Sun';

	it(`greet custom e.g. "${customTarget}"`, () => {
		expect.assertions(1);

		expect(GreeterUse.say(customTarget)).toContain(customTarget);
	});

	it(`greets anyone like "${GreeterConf.greetText}"`, () => {
		expect.assertions(1);

		expect(GreeterUse.say()).toContain(GreeterConf.greetText);
	});
});
