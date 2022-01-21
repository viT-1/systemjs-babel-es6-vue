import { sprintf } from 'printj';

import { defaultTarget, greetFormat, greetText } from './Greeter.config';

function Greeter(target) {
	this.greetTarget = target || defaultTarget;
}

Greeter.prototype.greet = function greet() {
	return sprintf(greetFormat, greetText, this.greetTarget);
};

export { Greeter };
