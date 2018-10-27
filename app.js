// can use the following env. vars. to control the web server
// 1. HOST (optional)
// 1. PORT (optional)
// 2. SSL_PRIVATE_KEY (optional)
// 3. SSL_FULLCHAIN_CERT (optional)
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs')
const path = require('path');

//console.log(`env=\n${JSON.stringify(process.env, null, 2)}`);

console.log(`version=${process.env.npm_package_version}`);

let app = express();

let bpj = bodyParser.json({"limit":"999mb"});   // json body middleware
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

app.get('/', (req, res) => {
	res.jsonp({msg: 'Hawdy'});
});

// for certbot "webroot" plugin certificate support
app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, '.well-known/acme-challenge')));

let secure = (process.env.SSL_PRIVATE_KEY && process.env.SSL_FULLCHAIN_CERT ? true : false);

let server = null;

if (secure) {
	const options = {
		key: fs.readFileSync(process.env.SSL_PRIVATE_KEY),
		cert: fs.readFileSync(process.env.SSL_FULLCHAIN_CERT)
	};
	server = https.createServer(options, app);
} else {
	server = http.createServer(app);
}

let host = (process.env.HOST || "0.0.0.0");
let port = (process.env.PORT || 8080);

console.log(`host=${host}, port=${port}`);

server.listen(port, host, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log('app server listening at %s://%s:%s', (secure ? 'https': 'http'), host, port);
});