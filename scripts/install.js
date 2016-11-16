var fs = require('fs');
var fsExtra = require('fs-extra');

var currentDir = process.cwd();

var gitDir = currentDir + '../../.git/hooks';
var preCommitHook = gitDir + '/pre-commit';
var prePushHook = gitDir + '/pre-push';

function fileExists(filePath) {
	try { return fs.statSync(filePath).isFile(); }
	catch (err) { return false; }
}

gitFolder = fs.lstatSync(gitDir);
if (! gitFolder.isDirectory()) {
	console.log('current directory is not git-versioned');
	process.exit(1);
}

if (fileExists(preCommitHook)) {
	fs.renameSync(preCommitHook, preCommitHook + '.old');
}

if (fileExists(prePushHook)) {
	fs.renameSync(prePushHook, preCommitHook + '.old');
}

fsExtra.copySync(path.resolve(__dirname, 'hooks/pre-commit'), preCommitHook);
fsExtra.copySync(path.resolve(__dirname, 'hooks/pre-push'), prePushHook);
