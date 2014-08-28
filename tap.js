'use strict';
var yamlish = require('yamlish');

module.exports = function (results) {
	var ret = 'TAP version 13\n';
	var total = 0;

	ret += '\n1..{total}\n';

	results.forEach(function (result) {
		var messages = result.messages;

		if (messages.length === 0) {
			return;
		}

		ret += messages.map(function (el) {
			var severity = 'warning';

			if (el.fatal || el.severity === 2) {
				severity = 'error';
			}

			return '\nnot ok ' + (++total) + '\n    ---' + yamlish.encode({
				message: el.message.replace(/'/g, ''),
				severity: severity,
				file: result.filePath,
				line: el.line || 0,
				name: el.ruleId
			}) + '\n    ...';
		}).join('\n') + '\n';
	});

	ret = ret.replace(/\{.*\}/, total);

	return ret;
};
