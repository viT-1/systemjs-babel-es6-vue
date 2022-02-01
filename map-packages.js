import arg from 'arg';
import { readFileSync, writeFileSync } from 'fs';

import { dependencies } from './package';
import mustache from 'mustache';

// TODO: app.config.json
const dirs = {
	src: './src', // source folder
	dest: './dist', // destination folder
};

const modeKey = '--mode';
const args = arg({ [modeKey]: String });
const mode = args[modeKey];
if (mode) {
	// TODO: glob
	const filesPaths = [
		`${dirs.src}/importmap.${mode}.json`,
		`${dirs.src}/index.${mode}.html`,
	];

	filesPaths.forEach((path) => {
		const output = mustache.render(readFileSync(path).toString(), dependencies);
		writeFileSync(path.replace(dirs.src, dirs.dest), output);
	});
}
else {
	new Error(`Set ${modeKey} please!`);
}
