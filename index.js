const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (request, response) {

	var urlParsed = url.parse(request.url, true);
	console.log(urlParsed);

	if(request.url.indexOf('/stats') > -1) {
		return writeStats(response);
	}
	else {
		//match image name, extension and size
		var m = request.url.match(/\/image\/(.+?)\.(jpg|jpeg|png|gif)\?size=(.*?)(?:$|&)/);

		if(!!m) {
			var imgName = m[1];
			var extName = m[2];
			var size = m[3];
			var spl = size.split('x');
			var w = +spl[0] || 0; //avoid NAN
			var h = +spl[1] || 0;

			if(!imgName || !extName || (!w && !h))
				return write404(response);

			return imgBytes(response, extName);
		}

		return write404(response);
	}

	function writeStats(res) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ statsDate: new Date() }));
		res.end();
	}

	function write404(res) {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.write("Sorry, the page you're looking for doesn't exist!");
		res.end();
	}

	function imgBytes(res, extName) {


		var img = fs.readFile('./img-raw/logo.png', function(err, imgData) {
			if(err) {
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.write("Server error: " + err);
				return res.end();
			}

			res.writeHead(200, { 'Content-Type': 'image/' + extName });
			res.end(imgData, 'binary');
		});
	}

}).listen(1337);