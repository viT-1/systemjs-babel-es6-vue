import { Greeter } from '#common/Greeter';

const GreeterUse = {
	say(greetTarget) {
		const gr = new Greeter(greetTarget);
		return gr.greet();
	},
};

export { GreeterUse };
