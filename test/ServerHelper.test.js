const server = require('../ServerHelper');

const assert = require('assert');
const http = require('http');

describe('server test', function () {
	before(function () {
		server.start(8000);
	});

	describe('/', function () {
		it('should return 404', function (done) {
			http.get('http://localhost:8000', function (res) {
				assert.equal(404, res.statusCode);
				done();
			});
		});

		it('should return 200', function (done) {
			http.get('http://localhost:8000/image/cta-phone.png?size=100', function (res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});
	});

	after(function () {
		server.close();
	});
});