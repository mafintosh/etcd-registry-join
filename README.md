# etcd-registry-join

Add a service to [etcd-registry](https://github.com/mafintosh/etcd-registry) and remove it
when your service process exits

	npm install etcd-registry-join

Or if you want to install the command line tool as well

	npm install -g etcd-registry-join

## Usage

``` js
var join = require('etcd-registry-join');
var http = require('http');

var server = http.createServer(function(request, response) {
	response.end('hello world\n');
});

server.listen(8080, function() {
	join(etcdConnectionString, 'my-service', server, function(err, service) {
		console.log('service joined:', service);
	});
});
```

When the process receives `SIGTERM` or `SIGINT` it will unregister the service from the registry
before exiting the process.

## Command line usage

You can also use the command line tool

```
etcd-registry-join etcd-connection-string my-service my-app.js
```

Where my app looks like

``` js
var http = require('http');
var server = http.createServer(function(request, response) {
	response.end('hello world\n');
});

server.listen(process.env.PORT); // this env var is set by etcd-registry-join
```

When your server is listening on `PORT` etcd-registry-join will add your service to the registry

## License

MIT