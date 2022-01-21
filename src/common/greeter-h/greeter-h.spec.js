import {
	describe,
	expect,
	it,
} from '@jest/globals';
import { createLocalVue, mount } from '@vue/test-utils';

import { Greeter } from '#common/Greeter';
import { conf, options } from '.';

const localVue = createLocalVue();
const co = localVue.component(conf.tagName, options);

describe('component #common/greeter-h', () => {
	it('represents Greeter default greeting, if target property is not defined', () => {
		expect.assertions(1);

		const gr = new Greeter();
		const undefinedTargetGreeting = gr.greet();

		const wrapper = mount(co, { localVue });

		expect(wrapper.html()).toContain(undefinedTargetGreeting);
	});

	it('represents Greeter custom target greeting', () => {
		expect.assertions(1);

		const customTarget = 'awesome';
		const gr = new Greeter(customTarget);
		const customTargetGreeting = gr.greet();

		const wrapper = mount(co, { localVue, propsData: { target: customTarget } });

		expect(wrapper.html()).toContain(customTargetGreeting);
	});

	it('should be reactive by watching target', () => {
		expect.assertions(2);

		const initialTarget = 'Frog Princess';
		const mutatedTarget = 'Vasilisa';

		const wrapper = mount(co, { localVue, propsData: { target: initialTarget } });

		expect(wrapper.html()).toContain(initialTarget);

		wrapper.setProps({ target: mutatedTarget });
		localVue.nextTick();

		expect(wrapper.html()).toContain(mutatedTarget);
	});
});
