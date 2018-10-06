var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

//console.log(`env=\n${JSON.stringify(process.env, null, 2)}`);

console.log(`version=${process.env.npm_package_version}`);

var app = express();

var bpj = bodyParser.json({"limit":"999mb"});   // json body middleware
app.use(bpj);

app.use((req, res, next) => {
	console.log('**********************************************************************');
	console.log('incoming request from ' + req.connection.remoteAddress + ":" + req.connection.remotePort + ', url='+ req.url);
	console.log('method=' + req.method);
	console.log('headers: ' + JSON.stringify(req.headers));
	console.log('**********************************************************************');
	console.log('');
	next();
});

//app.set("json replacer", null);
//app.set("json spaces", 2);

app.use((req, res) => {
	res.jsonp({msg: 'Hawdy'});
});

/*
app.get('/', (req, res) => {
	res.jsonp({msg: 'Hawdy'});
});
*/

var server = http.createServer(app);

var host = "0.0.0.0";
var port = (process.env.PORT || 8080);

console.log(`host=${host}, port=${port}`);

server.listen(port, host, function () {
	var host = server.address().address;
	var port = server.address().port;
	 console.log('app server listening at %s://%s:%s', 'http', host, port);
});