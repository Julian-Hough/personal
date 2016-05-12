// server init + mods
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var t_http = require('http');

//allow usage of static files for external css and js
app.use(express.static(path.join(__dirname, 'public')));

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//gets data from the index.html and functions accordingly
io.on('connection', function(socket) {
	
	socket.on('query', function(query) {
		//the base url is the same until the query part
		var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=';
		//query needs to be encoded to allow the url to work
		var string = query;
		var encoded = encodeURIComponent(string);
		url += encoded;
		//format part of url is appended to get JSON data format
		url += '&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on';
		//http get request is added and JSON parsed and sent to the front end
		t_http.get(url, (res) => {
			var data = '';
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function() {
				var parsed = JSON.parse(data);
				socket.emit('results',parsed);
			});
		});
		
	});
	
});




// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});