/*
Sitemap.xml Automated Testing Script using CasperJS

Usage instructions: casperjs sitemap_xml_testing.js --sitemap=<URL TO SITEMAP> --logfile=<LOG FILE NAME>

This script will attempt to crawl through a specified sitemap to check children pages for broken urls, 
images, css, and Javascript. Errors will be recorded to the logfile specified. This script requires 
casperjs to be installed.

Copyright (c) 2013 Georgiy Mazin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var links = [];
var intlinks = [];
var intimages = [];
var intcss = [];
var intjs = [];
var casper = require('casper').create();
var fs = require('fs'); 
var sitemap = casper.cli.get("sitemap");
var logfile = casper.cli.get("logfile");

function getLinks() {
    var links = document.querySelectorAll('loc');
    return Array.prototype.map.call(links, function(e) {
        return e.textContent
    });
}

function getInteriorLinks() {
    var intlinks = document.querySelectorAll('a');
    return Array.prototype.map.call(intlinks, function(e) {
        return e.getAttribute('href')
    });
}

function getInteriorImages() {
    var intimages = document.querySelectorAll('img');
    return Array.prototype.map.call(intimages, function(e) {
        return e.getAttribute('src')
    });
}

function getInteriorMeta() {
    var intcss = document.querySelectorAll('link');
    return Array.prototype.map.call(intcss, function(e) {
        return e.getAttribute('href')
    });
}

function getInteriorScript() {
    var intjs = document.querySelectorAll('script');
    return Array.prototype.map.call(intjs, function(e) {
        return e.getAttribute('src')
    });
}

casper.on('http.status.100', function(resource) {
    this.echo('100 Continue ' + resource.url);
});
casper.on('http.status.200', function(resource) {
    this.echo('200 OK ' + resource.url);
});

casper.on('http.status.300', function(resource) {
    this.echo('300 Multiple Choices ' + resource.url);
});
casper.on('http.status.301', function(resource) {
    this.echo('301 Moved Permanently ' + resource.url);
});
casper.on('http.status.302', function(resource) {
    this.echo('302 Found ' + resource.url);
});
casper.on('http.status.400', function(resource) {
    this.echo('400 Bad Request ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 400\n', 'a'); 
});
casper.on('http.status.401', function(resource) {
    this.echo('401 Unauthorized ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 401\n', 'a'); 
});
casper.on('http.status.403', function(resource) {
    this.echo('403 Forbidden ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 403\n', 'a'); 
});
casper.on('http.status.404', function(resource) {
    this.echo('404 Not Found ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 404\n', 'a'); 
});
casper.on('http.status.500', function(resource) {
    this.echo('500 Internal Server Error ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 500\n', 'a'); 
});
casper.on('http.status.502', function(resource) {
    this.echo('502 Bad Gateway ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 502\n', 'a'); 
});
casper.on('http.status.503', function(resource) {
    this.echo('503 Service Unavailable ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 503\n', 'a'); 
});
casper.on('http.status.504', function(resource) {
    this.echo('504 Gateway Timeout ' + resource.url);
    fs.write(logfile, resource.url + 'returned a 504\n', 'a'); 
});

casper.on("page.error", function(msg, trace) {
  this.echo("Error:    " + msg, "ERROR");
  fs.write(logfile, "Error:    " + msg + "\n", 'a'); 
  this.echo("file:     " + trace[0].file, "WARNING");
  fs.write(logfile, "file:     " + trace[0].file + "\n", 'a'); 
  this.echo("line:     " + trace[0].line, "WARNING");
  fs.write(logfile, "line:     " + trace[0].line + "\n", 'a'); 
  this.echo("function: " + trace[0]["function"], "WARNING");
  fs.write(logfile, "function: " + trace[0]["function"] + "\n", 'a'); 
  msg = 0;
  trace = [];
});


casper.start(sitemap, function() {
    fs.write(logfile, 'Starting crawl...\n', 'w'); 
    links = this.evaluate(getLinks);
});

casper.then(function() {
    console.log('------------------------------'); 
	for (var i = 0; i < links.length; i++) {
	    casper.thenOpen(links[i], function() {
	    	intlinks = this.evaluate(getInteriorLinks);
	    	intimages = this.evaluate(getInteriorImages);
	    	intcss = this.evaluate(getInteriorMeta); 
	    	intjs = this.evaluate(getInteriorScript); 
            this.echo('------------------------------');
	    	console.log('--Iterating through ' + this.getCurrentUrl() + '--'); 
            fs.write(logfile, '--Iterating through ' + this.getCurrentUrl() + '--\n', 'a'); 
            this.echo('------------------------------');
			for (var j = 0; j < intlinks.length; j++) {
	    		casper.thenOpen(intlinks[j], function() {
				});
			}
			for (var k = 0; k < intimages.length; k++) {
	    		casper.thenOpen(intimages[k], function() {
				});
			}
			for (var l = 0; l < intcss.length; l++) {
	    		casper.thenOpen(intcss[l], function() {
				});
			}
			for (var m = 0; m < intjs.length; m++) {
	    		casper.thenOpen(intjs[m], function() {

				});
			}
			intjs = []; 
			intcss = [];
			intimages = [];
			intlinks = [];
            
		});
	}
});

casper.run(function() {
    this.echo(links.length + ' links and their children were tested').exit();
});