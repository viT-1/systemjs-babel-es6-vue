import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import findRoot from 'find-root';
import { parse as parseIgnored } from 'parse-gitignore';
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
const pathToGitIgnore = path.join(pathsDir, '.gitignore');
const pathToTsconfigFile = path.join(pathsDir, tsconfigPath); // TODO check for incorrect input

// tsconfig > path has 'src' resolving parts
const tsconfigContentAsString = readFileSync(pathToTsconfigFile, 'utf8');
const tsconfigPaths = JSON.parse(tsconfigContentAsString).compilerOptions.paths;
// console.log('tsconfig > paths', tsconfigPaths);
const MatchPaths = createMatchPath(pathsDir, tsconfigPaths);

const gitIgnorePatterns = parseIgnored(readFileSync(pathToGitIgnore)).patterns;
const directoryFilter = gitIgnorePatterns.map((pattern) => `!${pattern}`);

const regXpattern = `(${placeOpens})(.*)(${placeCloses})`;

readdirp(pathRootForRegex, {
	fileFilter, // globstars aren't supported https://github.com/paulmillr/readdirp#options
	directoryFilter, // set gitignore patterns
}).on('data', (entry) => {
	const fileFullPath = path.join(pathRootForRegex, entry.path);
	const fileContent = readFileSync(fileFullPath, 'utf8');
	let contentIsChanged = false;
	const newContent = fileContent.replace(new RegExp(regXpattern, 'gm'), (match, gr1, gr2) => {
		let mayBeResolvedPath = MatchPaths(gr2);
		// console.log('Try MatchPath', gr2, mayBeResolvedPath);
		if (typeof mayBeResolvedPath !== 'undefined') {
			contentIsChanged = true;

			let outFileFullPath = fileFullPath;
			if (filesPathRoot !== outFilesPathRoot) {
				// only first occurance
				mayBeResolvedPath = mayBeResolvedPath.replace(filesPathRoot, outFilesPathRoot);
				outFileFullPath = fileFullPath.replace(filesPathRoot, outFilesPathRoot);
			}

			// make relative to current fileFullPath
			let relativeResolvedPath = path.relative(path.dirname(outFileFullPath), mayBeResolvedPath);
			relativeResolvedPath = relativeResolvedPath.replace(/\\/g, '/');

			const resolvedPlace = `${placeOpens}${relativeResolvedPath}${placeCloses}`;
			// console.log(path.basename(entry.path), match, `replaced to ${resolvedPlace}`);
			return resolvedPlace;
		}

		// no changed - change on same value
		return `${placeOpens}${gr2}${placeCloses}`;
	});

	if (contentIsChanged || (filesPathRoot !== outFilesPathRoot)) {
		// console.log(`replaced ${entry.path} with:`, newContent);
		writeFileSync(path.join(pathsDir, outFilesPathRoot, entry.path), newContent);

		// TODO: log N writed files & Q changed files
		// (filesPathRoot !== outFilesPathRoot) writes more files (as cpx) than changed
	}
});
