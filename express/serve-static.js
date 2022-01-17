import express from 'express';
import path from 'path';

import conf from './express.config';

const staticFilesFolder = 'dist';

const app = express();

app.use(express.static(
	path.resolve(staticFilesFolder),
	{ cacheControl: false },
));

const server = app.listen(conf.port, () => {
	console.log(conf.log.onListen, conf.port);
});

// @link: https://flaviocopes.com/node-terminate-program/
process.on('SIGTERM', () => {
	server.close(() => {
		console.log(conf.log.onSigterm);
	});
});
