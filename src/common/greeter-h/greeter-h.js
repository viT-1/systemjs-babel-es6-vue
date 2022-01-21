import { Greeter, conf as confGreeter } from '#common/Greeter';

import { template } from './greeter-h.config';

// @vue/component
const greeterH = {
	props: {
		target: {
			default: confGreeter.defaultTarget,
			type: String,
		},
	},
	data() {
		return {
			greeter: new Greeter(this.target),
		};
	},
	computed: {
		greeting() {
			return this.greeter.greet();
		},
	},
	watch: {
		target(val) {
			this.greeter = new Greeter(val);
		},
	},
	template,
};

export { greeterH };
