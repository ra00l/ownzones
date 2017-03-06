Demo project for Ownzones
========================

To start it, use node index.js
I tried to be as lean as possible, using the minimum amount of libs. 

How to use
-----------------
Please use this API resposibly! Even though it's possible, don't specify both width and height unless you know what you're doing :)

To resize by both width & height, call: 
http://localhost:1337/image/logo.png?size=100x100
This will send an 100x100 image, scaled.

The recommendation would be to use either width or height, to keep the image's scale appropriate.
For example, generate a w 100 image:
http://localhost:1337/image/logo.png?size=100

or a h 100 image (x needs to stay for height, but can miss for width):
http://localhost:1337/image/logo.png?size=x100

I've also created a test html page. You can either open it as a file in the browser, or
  ```
    http-server .
  ```
  inside the main dir (make sure you have "npm install"-ed "http-server -g")

Constraints
--------
__Image name needs to be unique__
If you use, for example, logo.png and logo.jpg, you might receive the wrong resized image. This can be bypassed with some extra code, but I find the constraint resonable.

__Resize width / height are between 1 and 16383__ 
(http://sharp.dimens.io/en/stable/api-resize/)


Good to knows
-------------
When installing "sharp" package on windows, I got a VCC compile error. Turns out I need to declare a path variable before "npm install"-ing the extension to work OK:
```
  set VCTargetsPath=C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\V120
```

Going further
---------------
Things that can improve the tiny project:
 - Lint the code, to have the same style across the team + catch typos / gotcha's
 - Losslessly compress the pngs with google's zoopfli / other png optimizers. This takes a lot CPU, but can save bandwidth (tests I've done shave ~5-10% of the image size). Can go further with lossy compression, giving a 90% quality image, with a lot more size shaved. Can use kraken.io for that or a commandline tool.
 - 
  
  
Tests
-------------
Run tests using 
```javascript
    npm test
```