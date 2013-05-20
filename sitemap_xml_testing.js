var links = [];
var intlinks = [];
var intimages = [];
var intcss = [];
var intjs = [];
var casper = require('casper').create();
var fs = require('fs'); 
var sitemap = casper.cli.get("sitemap");
var logfile = casper.cli.get("logfile");

function getLinks() { //XML URL parser. All sitemap.xml files compliant with the standard specification for them will work with this function
    var links = document.querySelectorAll('loc');
    return Array.prototype.map.call(links, function(e) {
        return e.textContent
    });
}

function getInteriorLinks() { //Returns href values
    var intlinks = document.querySelectorAll('a');
    return Array.prototype.map.call(intlinks, function(e) {
        return e.getAttribute('href')
    });
}

function getInteriorImages() { //Returns all images on a page, regardless of type
    var intimages = document.querySelectorAll('img');
    return Array.prototype.map.call(intimages, function(e) {
        return e.getAttribute('src')
    });
}

function getInteriorMeta() { //Returns meta information, including CSS
    var intcss = document.querySelectorAll('link');
    return Array.prototype.map.call(intcss, function(e) {
        return e.getAttribute('href')
    });
}

function getInteriorScript() { //Returns javascript file locations
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
    fs.write(logfile, resource.url + ' returned a 400\n', 'a'); 
});
casper.on('http.status.401', function(resource) {
    this.echo('401 Unauthorized ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 401\n', 'a'); 
});
casper.on('http.status.403', function(resource) {
    this.echo('403 Forbidden ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 403\n', 'a'); 
});
casper.on('http.status.404', function(resource) {
    this.echo('404 Not Found ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 404\n', 'a'); 
});
casper.on('http.status.500', function(resource) {
    this.echo('500 Internal Server Error ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 500\n', 'a'); 
});
casper.on('http.status.502', function(resource) {
    this.echo('502 Bad Gateway ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 502\n', 'a'); 
});
casper.on('http.status.503', function(resource) {
    this.echo('503 Service Unavailable ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 503\n', 'a'); 
});
casper.on('http.status.504', function(resource) {
    this.echo('504 Gateway Timeout ' + resource.url);
    fs.write(logfile, resource.url + ' returned a 504\n', 'a'); 
});

casper.on("page.error", function(msg, trace) { //Logging JavaScript errors on a page
  this.echo("Error:    " + msg, "ERROR");
  fs.write(logfile, "Error:    " + msg + "\n", 'a'); 
  if (trace[0].file){
    this.echo("file:     " + trace[0].file, "WARNING");
  }
  if (trace[0].line){
  fs.write(logfile, "file:     " + trace[0].file + "\n", 'a'); 
    this.echo("line:     " + trace[0].line, "WARNING");
  }
  if (trace[0]["function"]){
    fs.write(logfile, "line:     " + trace[0].line + "\n", 'a'); 
        this.echo("function: " + trace[0]["function"], "WARNING");
    }
  fs.write(logfile, "function: " + trace[0]["function"] + "\n", 'a'); 
  msg = 0;
  trace = []; //Workaround for what I think might be a memory issue
});


casper.start(sitemap, function() {
    fs.write(logfile, 'Starting crawl...\n', 'w'); //Initializes writing to file
    links = this.evaluate(getLinks);
});

casper.then(function() { //Main asynchronous function
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
            this.clear();
		});
	}
});

casper.run(function() {
    this.echo(links.length + ' links and their children were tested').exit();
});