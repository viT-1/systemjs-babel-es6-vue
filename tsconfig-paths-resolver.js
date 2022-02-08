import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from 'fs';
import path from 'path';
import findRoot from 'find-root';
import readdirp from 'readdirp';
import arg from 'arg';
import { createMatchPath } from 'tsconfig-paths';

const confKey = '--config-file';
const args = arg({ [confKey]: String });
const utilConfigPath = args[confKey]; // TODO check for incorrect input
const utilConfigDirPath = path.dirname(utilConfigPath);

const utilConfig = JSON.parse(readFileSync(utilConfigPath));

const {
	filesFilter: fileFilter, // by design inconsistent between this util and readdirp configuration
	filesPathRoot, // file contents will be read to regex
	outFilesPathRoot, // WARN: file contents will be replaced!!!
	placeOpens,
	placeCloses,
	tsconfigPath, // path for tscongig-paths package
} = utilConfig;

// paths & patterns in utilCofig json are relative to package.json directory
// tsconfig-path-resolver can be placed into any child folder in project
// shoud it be configurated to another way: relative to config?
const pathsDir = findRoot(utilConfigDirPath);

const pathRootForRegex = path.join(pathsDir, filesPathRoot);
const pathToTsconfigFile = path.join(pathsDir, tsconfigPath); // TODO check for incorrect input

const tsconfigContentAsString = readFileSync(pathToTsconfigFile, 'utf8');
const tsconfigPaths = JSON.parse(tsconfigContentAsString).compilerOptions.paths;
const MatchPaths = createMatchPath(pathsDir, tsconfigPaths);

const regXpattern = `(${placeOpens})(.*)(${placeCloses})`;

let nFilesChanged = 0;
let nFilesWritten = 0;

readdirp(path.resolve(pathRootForRegex), {
	fileFilter, // globstars aren't supported https://github.com/paulmillr/readdirp#options
	// directoryFilter, // set gitignore patterns if first readdirp parameter isn't absolute path
}).on('data', (entry) => {
	const fileFullPath = path.join(pathRootForRegex, entry.path);
	const fileContent = readFileSync(fileFullPath, 'utf8');
	let contentIsChanged = false;
	const newContent = fileContent.replace(new RegExp(regXpattern, 'gm'), (match, sGroup1, sGroup2, sGroup3) => {
		// related problem with baseUrl: https://github.com/dividab/tsconfig-paths/issues/190
		let mayBeResolvedPath = MatchPaths(sGroup2);

		if (typeof mayBeResolvedPath !== 'undefined') {
			contentIsChanged = true;
			nFilesChanged += 1;

			// make relative to current fileFullPath
			const relativeResolvedPath = path.relative(path.dirname(fileFullPath), mayBeResolvedPath);
			mayBeResolvedPath = relativeResolvedPath.replace(/\\/g, '/');
			// console.log(path.basename(entry.path), match, `replaced to ${mayBeResolvedPath}`);
		} else {
			mayBeResolvedPath = sGroup2;
		}

		return `${sGroup1}${mayBeResolvedPath}${sGroup3}`;
	});

	const pathFileToWrite = path.join(pathsDir, outFilesPathRoot, entry.path);
	if (contentIsChanged || ((filesPathRoot !== outFilesPathRoot) && !existsSync(pathFileToWrite))) {
		const pathDirToWrite = path.dirname(pathFileToWrite);
		if (!existsSync(pathDirToWrite)) {
			mkdirSync(pathDirToWrite, { recursive: true });
		}

		// console.log(`replaced ${entry.path} with:`, newContent);
		writeFileSync(pathFileToWrite, newContent);
		nFilesWritten += 1;
	}
})
	.on('end', () => console.log(`tsconfig-paths-resolver:
Files written: ${nFilesWritten}. And ${nFilesChanged} of them with paths resolved`));
