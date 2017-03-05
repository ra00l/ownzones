const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const ImageHelper = require('./ImageHelper');

http.createServer(function (request, response) {

	if(request.url.indexOf('/stats') > -1) {
		return writeStats(response);
	}
	else {
		//match image name, extension and size
		var img = new ImageHelper(request.url);

		if (!img || img.error) return write404(response, img);

		//check cached image existance on disk. If not there, creat it!
		img.getCached(function found(byteArr) { //found in cache, write to response
			imgBytes(response, byteArr, img.extName);
		},
		function notfound() { //not in cache, continue...
			write404(response, img);
		});
	}

	function writeStats(res) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ statsDate: new Date() }));
		res.end();
	}

	function write404(res, img) {
		res.writeHead(404, { 'Content-Type': 'text/json' });
		res.write(JSON.stringify({ error: (img && img.error) || "Sorry, the page you're looking for doesn't exist!" }));
		res.end();
	}

	function imgBytes(res, imgData, extName) {
		res.writeHead(200, { 'Content-Type': 'image/' + extName });
		res.end(imgData, 'binary');
	}

}).listen(1337);