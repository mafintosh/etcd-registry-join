#!/usr/bin/env node

var join = require('./');
var net = require('net');
var path = require('path');

if (process.argv.length < 5) {
	console.error('Usage: etcd-registry-join [connection-string] [service-name,service-name,...] [index-file.js]');
	process.exit(1);
}

var cs = process.argv[2];
var names = process.argv[3].split(',');

var server = net.createServer();
var Server = net.Server;

var listen = Server.prototype.listen;
var req = process.argv[4];

server.listen(0, function() {
	var port = server.address().port;

	Server.prototype.listen = function(p) {
		if (String(port) !== String(p)) return listen.apply(this, arguments);

		this.on('listening', function() {
			join(cs, names, this);
		});

		return listen.apply(this, arguments);
	};

	server.close(function() {
		process.env.PORT = port;
		require(path.join(process.cwd(), req));
	});
});
