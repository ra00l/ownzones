const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

module.exports = function(url) {
	if(!url || url.indexOf('/image') != 0) {
		this.error = 'not an image path!';
		return;
	}

	var urlMatches = url.match(/\/image\/(.+?)\.(jpg|jpeg|png|gif)\?size=(.*?)(?:$|&)/);

	if(!!urlMatches) {
		this.imgName = urlMatches[1];
		this.extName = urlMatches[2];
		var size = urlMatches[3];
		var spl = size.split('x');
		this.w = +spl[0] || null; //avoid NAN
		this.h = +spl[1] || null;

		if (!this.imgName || !this.extName || (!this.w && !this.h)) {
			this.error = 'Not a valid url path!';
			return;
		}
	}
	else {
		this.error = 'Url is malformed or image not supported!';
		return;
	}

	var resizedName = '';
	if (this.w) resizedName += 'w' + this.w;
	if (this.h) resizedName += 'h' + this.h;

	this.cachedImagePath =  path.join('./img-cached', this.imgName, resizedName + '.' + this.extName);

	this.getCached = function(success, fail) {
		var self = this;
		fs.stat(this.cachedImagePath, function (err) {
			if (err) {
				if(err.code === 'ENOENT') { //file not found!
					console.log('cached image doesn\'t exists; creating it: ', this.cachedImagePath);
					return this.getOriginal(success, fail);
				}
				console.log('error getting cached image: ', this.cachedImagePath);
				fail();
			}

			fs.readFile(this.cachedImagePath, function(err, imgData) {
				if(err) {
					console.log('error reading cached image!');
					return fail();
				}
				return success(imgData);
			});
		}.bind(this));
	};

	this.getOriginal = function(success, fail) {
		//var self = this;
		var originalImgPath = path.join('./img-raw', this.imgName + '.' + this.extName);
		fs.stat(originalImgPath, function (err) {
			if(err) {
				console.log('could not found original image', originalImgPath, err);
				return fail();
			}

			fs.stat(path.dirname(this.cachedImagePath), function(err) {
				if(err) {
					fs.mkdirSync(path.dirname(this.cachedImagePath));
				}

				sharp(originalImgPath)
					.resize(this.w, this.h)
					.toFile(this.cachedImagePath, function (err, info) {
						if (err) {
							console.log('could not write resized image', this.cachedImagePath, err);
							fail();
						}
						success(fs.readFileSync(this.cachedImagePath)); //should use the async method, but I hope it's tolerable :D
					}.bind(this));
			}.bind(this));
		}.bind(this));
	};
};

// gm("image.png").size(function(err, value){
// 	// note : value may be undefined
// })