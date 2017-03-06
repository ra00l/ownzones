const http = require('http');
const fs = require('fs');
const path = require('path');

const ImageHelper = require('./ImageHelper');

function countFiles(dirPath, cb) {
	fs.readdir(dirPath, function (err, files) {
		if (err) return write500('cannot read files in dir ' + dirPath);

		cb(files.length);
	});
}

function incrementProp(propName) {
	fs.readFile('./stats.json', function(err, jsonStats) {
		if (err) {
			return write500('Cannot read cached stats!');
		}

		var stats = JSON.parse(jsonStats); //this is not very scalable, it blocks the main thread...
		if(!stats[propName]) stats[propName] = 0;
		stats[propName]++;

		fs.writeFile('./stats.json', JSON.stringify(stats));
	});
}

function writeStats(res) {
	fs.readFile('./stats.json', function(err, jsonStats) {
		if(err) {
			return write500('Cannot read cached stats!');
		}

		var stats = JSON.parse(jsonStats);
		countFiles('./img-raw', setOriginalCnt);

		function setOriginalCnt(cnt) {
			stats.files = cnt;
			respondStats();
		}

		function respondStats() {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.write(JSON.stringify(stats));
			res.end();
		}

	});
}

function write500(res, err) {
	incrementProp('serverErrors');
	res.writeHead(500, { 'Content-Type': 'text/json' });
	res.write(JSON.stringify({ error: err }));
	res.end();
}

function write404(res, img) {
	incrementProp('notFounds');

	res.writeHead(404, { 'Content-Type': 'text/json' });
	res.write(JSON.stringify({ error: (img && img.error) || "Sorry, the page you're looking for doesn't exist!" }));
	res.end();
}

function imgBytes(res, imgData, extName) {
	res.writeHead(200, { 'Content-Type': 'image/' + extName });
	res.end(imgData, 'binary');
}

module.exports = {
	start: function (port) {
		this.server = http.createServer(function (request, response) {

			if (request.url.indexOf('/stats') > -1) {
				return writeStats(response);
			}
			else {
				//match image name, extension and size
				var img = new ImageHelper(request.url);

				if (!img || img.error) return write404(response, img);

				//check cached image existance on disk. If not there, creat it!
				img.getCached(function found(byteArr, cached) { //found in cache, write to response
						incrementProp(cached ? 'cacheHits' : 'cachedFiles');
						imgBytes(response, byteArr, img.extName);
					},
					function notfound() { //not in cache, continue...
						write404(response, img);
					});
			}
		}).listen(port);
	},
	close: function () {
		if (this.server) this.server.close();
	}
};
