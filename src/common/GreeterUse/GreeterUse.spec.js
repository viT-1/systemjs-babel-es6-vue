import { describe, expect, it } from '@jest/globals';

import { GreeterUse } from '#common/GreeterUse';
import { conf } from '#common/Greeter';

describe('module #common/GreeterUse', () => {
	it(`greet by default "${conf.defaultTarget}"`, () => {
		expect.assertions(1);

		expect(GreeterUse.say()).toContain(conf.defaultTarget);
	});

	const customTarget = 'Sun';

	it(`greet custom e.g. "${customTarget}"`, () => {
		expect.assertions(1);

		expect(GreeterUse.say(customTarget)).toContain(customTarget);
	});

	it(`greets anyone like "${conf.greetText}"`, () => {
		expect.assertions(1);

		expect(GreeterUse.say()).toContain(conf.greetText);
	});
});
