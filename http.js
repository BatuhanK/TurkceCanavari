module.exports=function() {

	var connect = require('connect'),
	    http = require('http'),
	    directory = 'web',
	    http_port = 8080; // FAK
	connect()
	    .use(connect.static(directory))
	    .listen(http_port);

	console.log('## HTTP server %s portunda basladi',http_port);

};
