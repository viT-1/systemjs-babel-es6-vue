import Vue from 'vue';
import { sprintf } from 'printj';

import { components, elSelector as el, warnings } from './app-vue.config';
import { conf as confGreeter } from '#common/Greeter';

const appVue = {
	init() {
		// В любом случае отключаем Vue-предупреждения в консоль
		Vue.config.devtools = true;
		Vue.config.productionTip = false;

		if (!document.querySelector(el)) {
			throw Error(sprintf(warnings.elSelectorIsNotFound, el));
		}

		return new Vue({
			el,
			components,
			data() {
				return {
					greeterTarget: confGreeter.defaultTarget,
				};
			},
		});
	},
};

export { appVue };
