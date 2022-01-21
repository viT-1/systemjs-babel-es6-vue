import { Greeter } from '#common/Greeter';

import { template } from './greeter-h.config';

const greeterH = {
	template,
	props: {
		target: { type: String },
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
};

export { greeterH };
