import Vue from 'vue';
import mustache from 'mustache';

import { conf as confGreeter } from '#common/Greeter';
import { components, elSelector as el, warnings } from './app-vue.config';

const appVue = {
	init() {
		// В любом случае отключаем Vue-предупреждения в консоль
		Vue.config.devtools = true;
		Vue.config.productionTip = false;

		if (!document.querySelector(el)) {
			throw Error(mustache.render(warnings.elSelectorIsNotFound, { elSelector: el }));
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
