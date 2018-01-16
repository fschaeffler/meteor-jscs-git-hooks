const fs = require('fs'),
	fsExtra = require('fs-extra'),
	path = require('path');

let _checkFileExists = function (filePath) {
	try { return fs.statSync(filePath).isFile(); }
	catch (error) { return false; }	
};

let _getHooksDir = function (executingDir) {
	return (path.join(executingDir, '.git/hooks'));
};

let _getHooks = function (executingDir) {
	return [
		{
			'hookType': 'pre-commit',
			'exists': _checkFileExists(path.join(_getHooksDir(executingDir), 'pre-commit')),
			'existsOld': _checkFileExists(path.join(_getHooksDir(executingDir), 'pre-commit.old')),
			'filename': path.join(_getHooksDir(executingDir), 'pre-commit'),
			'filenameOld': path.join(_getHooksDir(executingDir), 'pre-commit.old')
		},
		{
			'hookType': 'pre-push',
			'exists': _checkFileExists(path.join(_getHooksDir(executingDir), 'pre-push')),
			'existsOld': _checkFileExists(path.join(_getHooksDir(executingDir), 'pre-push.old')),
			'filename': path.join(_getHooksDir(executingDir), 'pre-push'),
			'filenameOld': path.join(_getHooksDir(executingDir), 'pre-push.old')
		}
	];
};

let _activateHook = function (hook) {
	if (hook) {
		if (hook.exists) { fs.renameSync(hook.filename, hook.filenameOld); }
		fsExtra.copySync(path.join(__dirname, 'hooks/', hook.hookType), hook.filename);
	}
};

let _deactivateHook = function (hook) {
	if (hook) {
		if (hook.exists) { fs.unlinkSync(hook.filename); }
		if (hook.existsOld) { fsExtra.moveSync(hook.filenameOld, hook.filename); }
	}
};

let _validate = function (executingDir) {
	if(fs.lstatSync(_getHooksDir(executingDir))) {
		console.log('current directory is not git-versioned');
		process.exit(1);		
	}
};

let _activate = function (executingDir) {
	_getHooks(executingDir).forEach(function (hook) { _activateHook(hook); });
};

let _deactivate = function (executingDir) {
	_getHooks(executingDir).forEach(function (hook) { _deactivateHook(hook); });
};

let parameters = JSON.parse(process.env.npm_config_argv),
	executingDir = parameters.original[parameters.original.indexOf('--dir') + 1],
	isDeactivateCall = (parameters.original.indexOf('--deactivate') > -1);

if (isDeactivateCall) { _deactivate(executingDir); }
else { _activate(executingDir); }