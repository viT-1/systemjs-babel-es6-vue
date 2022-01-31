import arg from 'arg';
import express from 'express';
import path from 'path';

import conf from './express.config';

// TODO app.config.json
const staticFilesFolder = 'dist';

const app = express();

app.use(express.static(
	path.resolve(staticFilesFolder),
	{ cacheControl: false },
));

const defPageKey = '--defPageFileName';
const args = arg({ [defPageKey]: String });
const defPageFileName = args[defPageKey];
if (defPageFileName) {
	const indexPath = path.join(staticFilesFolder, defPageFileName);

	app.get('/', (req, res) => {
		res.sendFile(path.resolve(indexPath));
	});
}

const server = app.listen(conf.port, () => {
	console.log(conf.log.onListen, conf.port);
});

// @link: https://flaviocopes.com/node-terminate-program/
process.on('SIGTERM', () => {
	server.close(() => {
		console.log(conf.log.onSigterm);
	});
});
