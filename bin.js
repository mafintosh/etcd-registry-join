#!/usr/bin/env node

var join = require('./');
var net = require('net');
var path = require('path');
var optimist = require('optimist');

var argv = optimist
	.usage('Usage: $0 [connection-string] [name-1,name-2...] [index-file.js] [options]')
	.alias('s', 'slack').describe('s', 'slack time in seconds before exiting old process')
	.alias('w', 'wait').describe('w', 'wait time in seconds before leaving the registry')
	.argv;

if (argv._.length < 3) {
	optimist.showHelp();
	process.exit(1);
}

var cs = argv._[0];
var req = argv._[2];

var opts = {
	name: argv._[1].split(','),
	slack: 1000 * (argv.slack || 0),
	wait: 1000 * (argv.wait || 0)
};

var server = net.createServer();
var Server = net.Server;

var listen = Server.prototype.listen;

server.listen(0, function() {
	var port = server.address().port;

	Server.prototype.listen = function(p) {
		if (String(port) !== String(p)) return listen.apply(this, arguments);

		this.on('listening', function() {
			join(cs, opts, this);
		});

		return listen.apply(this, arguments);
	};

	server.close(function() {
		process.env.PORT = port;
		require(path.join(process.cwd(), req));
	});
});
