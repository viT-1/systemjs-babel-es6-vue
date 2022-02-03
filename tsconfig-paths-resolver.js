import { readFileSync, writeFileSync, existsSync } from 'fs';
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
const pathsDir = findRoot(utilConfigDirPath); // shoud it be configurated to another way: relative to config?
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
	const newContent = fileContent.replace(new RegExp(regXpattern, 'gm'), (match, gr1, gr2) => {
		// related problem with baseUrl: https://github.com/dividab/tsconfig-paths/issues/190
		let mayBeResolvedPath = MatchPaths(gr2);
		if (typeof mayBeResolvedPath !== 'undefined') {
			contentIsChanged = true;
			nFilesChanged++;

			// make relative to current fileFullPath
			let relativeResolvedPath = path.relative(path.dirname(fileFullPath), mayBeResolvedPath);
			relativeResolvedPath = relativeResolvedPath.replace(/\\/g, '/');

			const resolvedPlace = `${placeOpens}${relativeResolvedPath}${placeCloses}`;
			// console.log(path.basename(entry.path), match, `replaced to ${resolvedPlace}`);
			return resolvedPlace;
		}

		// no changed - change on same value
		return `${placeOpens}${gr2}${placeCloses}`;
	});

	const pathFileToWrite = path.join(pathsDir, outFilesPathRoot, entry.path);
	if (contentIsChanged || ((filesPathRoot !== outFilesPathRoot) && !existsSync(pathFileToWrite))) {
		// console.log(`replaced ${entry.path} with:`, newContent);
		writeFileSync(pathFileToWrite, newContent);
		nFilesWritten++;
	}
})
.on('end', () => console.log(`tsconfig-paths-resolver:
Files written: ${nFilesWritten}. And ${nFilesChanged} of them with paths resolved`));
