var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

var bpj = bodyParser.json({"limit":"999mb"});   // json body middleware
app.use(bpj);

app.use(function(req, res, next) {
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

app.get('/', function(req, res) {
	res.jsonp({msg: 'Hawdy'});
});

app.get('/test', function(req, res) {
	res.jsonp({msg: 'This is a test'});
});

app.post('/test', function(req, res) {
	res.json(req.body);
});

app.put('/test_put', function(req, res) {
	res.json({});
});

var config = {
	host: "0.0.0.0"
	,port: process.env.PORT || 8080
};

var server = http.createServer(app);

var port = config.port;
var host = config.host;

server.listen(port, host, function () {
	var host = server.address().address;
	var port = server.address().port;
	 console.log('app server listening at %s://%s:%s', 'http', host, port);
});