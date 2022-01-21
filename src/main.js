import { appVue } from '~/app-vue';

import { GreeterUse } from '#common/GreeterUse';

function run() {
	appVue.init();
	// eslint-disable-next-line no-console
	console.log(GreeterUse.say('Dude'));
}

export { run };
