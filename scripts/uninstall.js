var fs = require('fs');
var fsExtra = require('fs-extra');
var path = require('path');

var currentDir = process.cwd();

var gitDir = currentDir + '/../../.git/hooks';
var preCommitHook = gitDir + '/pre-commit';
var prePushHook = gitDir + '/pre-push';

function fileExists(filePath) {
	try { return fs.statSync(filePath).isFile(); }
	catch (err) { return false; }
}

gitFolder = fs.lstatSync(gitDir);
if (!gitFolder.isDirectory()) {
	console.log('current directory is not git-versioned');
	process.exit(0);
}

if (fileExists(preCommitHook)) {
	fs.unlinkSync(preCommitHook);
}

if (fileExists(prePushHook)) {
	fs.unlinkSync(prePushHook);
}

if (fileExists(preCommitHook + '.old')) {
	fsExtra.copySync(path.resolve(__dirname, '../hooks/pre-commit.old'), preCommitHook);
}

if (fileExists(prePushHook + '.old')) {
	fsExtra.copySync(path.resolve(__dirname, '../hooks/pre-push.old'), prePushHook);
}
