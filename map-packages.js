import { readFileSync, writeFileSync } from 'fs';

import { dependencies } from './package';
import mustache from 'mustache';

// TODO: app.config.json
const dirs = {
	src: './src', // source folder
	dest: './dist', // destination folder
};

// TODO: glob
const importmapsPaths = [
	`${dirs.src}/importmap.system.json`,
	`${dirs.src}/importmap.esm.json`,
];

importmapsPaths.forEach((path) => {
	const output = mustache.render(readFileSync(path).toString(), dependencies);
	writeFileSync(path.replace(dirs.src, dirs.dest), output);
});
