var phantom = require('node-phantom');
var glob = require("glob");
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var http = require('http');
var del = require('del');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var phantom = require('node-phantom');
var sourceDir = "ui/examples/";
var destDir = "tmp/";
var appDest = "ui/img/screens";
var figures = require('figures');


del(destDir, function() {

	mkdirp(destDir, function (err) {

		ncp(sourceDir, destDir + 'html/', function (err) {

			if (err) {
				return console.error(err);
			}

			var serve = serveStatic(destDir + 'html/', {
				'index': false
			})

			var server = http.createServer(function(req, res){
				
				var done = finalhandler(req, res)

				serve(req, res, done);

			});

			server.listen(3005, function() {

				glob(destDir + "**/*.html", null, function (er, files) {

					var files = files.map(function(file) {

						return file.replace('tmp/html', '');

					});

					
					var created = 0;

					phantom.create(function(err, ph) {

						files.forEach(function(file) {

							ph.createPage(function(err, page) {

								page.open("http://localhost:3005" + file + "?r=" + Math.random() * 99999, function(err,status) {

									var fileArr = file.split('.');

									fileArr.pop();

									var fileImgName = fileArr.join('.') + '.png';

									var fileImgDest = destDir + 'img' + fileImgName;
									
									//page.viewportSize = { width: 800, height: 600 };

									page.evaluate(function() {

										document.body.style.margin = "0";
										document.body.style.padding = "1em";
										document.body.style.boxSizing = "border-box";
										document.body.style.width = "784px"; // 784px is 800px inner width. Adds 8px.
										document.body.style.height = "511px"; // 511px is 600px inner height. Adds x px.
										document.body.style.overflowY = "hidden";
										document.body.style.background = "#fff";

									}, function() {
										
										page.render(fileImgDest, function() {

											created++;

											if(created === files.length) {

												console.log(figures.tick, 'Screens done');

												ph.exit();
												server.close();

												ncp(destDir + 'img/', appDest, function (err) {

													console.log(figures.tick, 'Moved into ui folder');

													del(destDir, function() {

														console.log(figures.tick, 'Cleaned up')

													});

												});

											}

										});

									});

								});

							})

						});

					});

				});

			})



		});

	});

})











/*


// options is optional
glob("ui/examples/*.html", null, function (er, files) {

	

	console.log(files);

	files = files.map(function(file) {

		return file.replace('ui')

	});

	files.forEach(function(file) {



	})

});

*/