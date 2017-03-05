const assert = require('assert');
const ImageHelper = require('../ImageHelper');

describe('ImageHelper', function() {
	describe('parse image url correctly', function() {
		it('should detect right image from URL', function(done) {
			var img = new ImageHelper('/image/test.png?size=100');

			if(img.error) done(img.error);
			else {
				//console.log(assert);
				assert.equal(img.imgName, 'test');
				assert.equal(img.extName, 'png');
				assert.equal(img.w, 100);
				assert.equal(img.h, null);

				done();
			}
		});
	});
});