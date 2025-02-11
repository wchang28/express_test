// can use the following env. vars. to control the web server
// 1. HOST (optional)
// 1. PORT (optional)
// 2. SSL_PRIVATE_KEY (optional)
// 3. SSL_FULLCHAIN_CERT (optional)
const http = require('http');
const https = require('https');
const express = require('express');
const fs = require('fs')

const version = require('./package.json').version;

console.log(`[${new Date().toISOString()}]: version=${version}`);

const app = express();

app.use((req, res, next) => {
	console.log('**********************************************************************');
	console.log(`[${new Date().toISOString()}]: incoming ${req.method} request from ${req.connection.remoteAddress}, url=${req.url}, headers: ${JSON.stringify(req.headers)}`);
	console.log('**********************************************************************');
	console.log('');
	next();
});

app.get('/', (req, res) => {
	res.jsonp({now: new Date().toISOString(), msg: 'Hello World!', version});
});

const secure = (process.env.SSL_PRIVATE_KEY && process.env.SSL_FULLCHAIN_CERT ? true : false);

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

const hostname = (process.env.HOST || "0.0.0.0");
const port = (process.env.PORT || 8080);

server.listen(port, hostname, function () {
	console.log(`[${new Date().toISOString()}]: app server listening at ${(secure ? 'https': 'http')}://${hostname}:${port}`);
});