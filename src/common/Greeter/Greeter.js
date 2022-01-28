import mustache from 'mustache';

import { defaultTarget, greetFormat, greetText } from './Greeter.config';

function Greeter(target) {
	this.greetTarget = target || defaultTarget;
}

Greeter.prototype.greet = function greet() {
	return mustache.render(greetFormat, { text: greetText, target: this.greetTarget });
};

export { Greeter };
