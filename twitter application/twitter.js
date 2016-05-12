// server init + mods
var express = require('express');
var TwitterStream = require('twitter-stream-api');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var js2xmlparser = require("js2xmlparser");

//database modules
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');
	
	
var url = 'mongodb://localhost:27017/twitter';	
//establish database twitter	
var db = new Db('twitter', new Server('localhost', 27017));

//allow usage of static files for external css and js
app.use(express.static(path.join(__dirname, 'public')));

//Twitter Streaming API Keys 
var keys = {
  consumer_key: 'NAG1Noql3ZqFqXrnCR86FMEk4',
  consumer_secret: 'w1RCNW6QUjixskjjZ6k5QpkIIQknuCf5fMpDrVJhayajoma1rs',
  token: '704380827044585473-YF0dRzrjcPMET0Dmzh34tGcC06iw2q2',
  token_secret: 'b27gMH28anuw6jOnyxKCPD1KUI2hyJ8e5fgIEuHhYzDfG'
};
 
//This structure will keep the total number of tweets received and a map of all the symbols and how many tweets 
var watchList = {
    total: 0,
	count: 0,
    tweets: []
};

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var find = function(db, callback) {
	var cursor = db.collection('tweets').find();
	cursor.each(function(err,doc) {
		assert.equal(err,null);
		if (doc != null) {
			watchList.tweets.push(doc);
		}else {
			callback();
		}
	});
}


//gets data from the index.html and functions accordingly
io.on('connection', function(socket) {
	//make third visualization timeline function
	socket.on('getTimeline', function(bool) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection("timeline").aggregate([
				{$group:{_id:{date:'$date'},count:{$sum:1}}},
				{$sort:{_id:-1}},
				{$limit:7}
			]).toArray(function(err, result) {
				assert.equal(err,null);
				socket.emit('makeTimeline',result);
				db.close();
			})
		});
	});
	//make second visualization popular users function
	socket.on('getUsers', function(bool) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection("twusers").aggregate([
				{$sort:{followers_count:-1}},
				{$limit:5}
			]).toArray(function(err, result) {
				assert.equal(err,null);
				socket.emit('makeUsers',result);
				db.close();
			})
		});
	});
	
	//make first visualization popular hashtags function
	socket.on('getHashtags', function(bool) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection("hashtags").aggregate([
				{$group:{_id:{hashtag:'$hashtag'},count:{$sum:1}}},
				{$sort:{count:-1}},
				{$limit:5}
			]).toArray(function(err, result) {
				assert.equal(err,null);
				socket.emit('makeHashtags',result);
				db.close();
			})
		});
		
	});
	
	
	socket.emit('data', watchList);
	socket.on('getTweets', function(desc) {
		watchList.total = 0;
		watchList.count = desc[0];
		watchList.tweets = [];
		if (desc[1] == "") {
			location(desc[2]);
		}else {
			track(desc[1],desc[2]);
		}

	
	});
	
	socket.on('downloadTweets', function(fname) {
		
		var jsonArray = {};
			var count = 0;
			//parse json data
			watchList.tweets.forEach(function(value) {
				jsonArray["tweet"+count] = {
				"created_at" : value["created_at"],
				"id": value["id"],
				"text": value["text"],
				"user_id": value["user"]["id"],
				"user_name": value["user"]["name"],
				"user_screen_name": value["user"]["screen_name"],
				"user_location": value["user"]["location"],
				"user_followers_count": value["user"]["followers_count"],
				"user_friends_count": value["user"]["friends_count"],
				"user_created_at": value["user"]["created_at"],
				"user_time_zone": value["user"]["time_zone"],
				"user_profile_background_color": value["user"]["profile_background_color"],
				"user_profile_image_url": value["user"]["profile_image_url"],
				"geo": value["geo"],
				"coordinates": value["coordinates"],
				"place": value["place"]
				};
				count += 1;
			});
		
		//check if file exists
		fs.stat(fname+'.xml', function(err, stat) {
			if (err == null) {
				socket.emit('print', 'Overwrote '+fname+'.xml');
			}else {
				socket.emit('print', 'Created '+fname+'.xml')
			}
		});
			
			
		//creates or overwrites file
		fs.writeFile(fname+'.xml', js2xmlparser("tweets",JSON.stringify(jsonArray)), (err) => {
			if (err) throw err;
			console.log("Tweets successfully exported as XML file.");
		});
	});
	
	socket.on('showTweets', function(foo) {
		watchList.tweets = [];
		
		
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);	
			find(db, function() {
				io.emit('data',watchList);
				io.emit('print',"Loaded Tweets From Database!");
				db.close();
			});
			
		});
		
	});
	
	socket.on('exportTweets', function(array) {
		
		if (array[0] == "JSON") {
			var jsonArray = [];
			//parse json data
			watchList.tweets.forEach(function(value) {
				jsonArray.push( {
				"created_at" : value["created_at"],
				"id": value["id"],
				"text": value["text"],
				"user_id": value["user"]["id"],
				"user_name": value["user"]["name"],
				"user_screen_name": value["user"]["screen_name"],
				"user_location": value["user"]["location"],
				"user_followers_count": value["user"]["followers_count"],
				"user_friends_count": value["user"]["friends_count"],
				"user_created_at": value["user"]["created_at"],
				"user_time_zone": value["user"]["time_zone"],
				"user_profile_background_color": value["user"]["profile_background_color"],
				"user_profile_image_url": value["user"]["profile_image_url"],
				"geo": value["geo"],
				"coordinates": value["coordinates"],
				"place": value["place"]
				});
		
			});
			//check if file exists
			fs.stat(array[1]+'-tweets.json', function(err, stat) {
				if (err == null) {
					socket.emit('print', 'Overwrote '+array[1]+'-tweets.json');
				}else {
					socket.emit('print', 'Created '+array[1]+'-tweet.json')
				}
			});
			
			//creates or overwrites file
			fs.writeFile(array[1]+'-tweets.json', JSON.stringify(jsonArray), (err) => {
				if (err) throw err;
				console.log("Tweets successfully exported as JSON file.");
			});
		}
		if (array[0] == "CSV") {
			//csv header
			var csvArray = [['"created_at"','"id"','"text"','"user_id"','"user_name"','"user_screen_name"',
			'"user_location"','"user_followers_count"','"user_friends_count"','"user_created_at"',
			'"user_time_zone"','"user_profile_background_color"','"user_profile_image_url"','"geo"',
			'"coordinates"','"place"']];
			//parse and append of json data
			watchList.tweets.forEach(function(value) {
				csvArray.push( ["\""+String(value["created_at"])+"\"","\""+String(value["id"])+"\"",
				"\""+String(value["text"])+"\"","\""+String(value["user"]["id"])+"\"",
				"\""+String(value["user"]["name"])+"\"","\""+String(value["user"]["screen_name"])+"\"",
				"\""+String(value["user"]["location"])+"\"","\""+String(value["user"]["followers_count"])+"\"",
				"\""+String(value["user"]["friends_count"])+"\"","\""+String(value["user"]["created_at"])+"\"",
				"\""+String(value["user"]["time_zone"])+"\"","\""+String(value["user"]["profile_background_color"])+"\"",
				"\""+String(value["user"]["profile_image_url"])+"\"","\""+String(value["geo"])+"\"",
				"\""+String(value["coordinates"])+"\"","\""+String(value["place"])+"\""
				]);
			});
			//csv string concatenation
			csvArray = csvArray.join("\r\n");
			//check if file exists
			fs.stat(array[1]+'-tweets.csv', function(err, stat) {
				if (err == null) {
					socket.emit('print', 'Overwrote '+array[1]+'-tweets.csv');
				}else {
					socket.emit('print', 'Created '+array[1]+'-tweet.csv')
				}
			});
			//creates or overwrites file data
			fs.writeFile(array[1]+'-tweets.csv', csvArray, (err) => {
				if (err) throw err;
				console.log("Tweets successfully exported as CSV file.");
			});
			
		}
	});
})

//if the search is blank does by location at RPI
function location(makedb) {
//creates new connection
var Twitter = new TwitterStream(keys, true);
//filter
Twitter.stream('statuses/filter', { locations: '-73.68,42.72,-73.67,42.73'});
//connection checker and reports in console
Twitter.on('connection success', function (uri) {
	console.log('connection success', uri);
});
Twitter.on('connection aborted', function () {
    console.log('connection aborted');
});
Twitter.on('connection error network', function (error) {
    console.log('connection error network', error);
});
Twitter.on('connection error http', function (httpStatusCode) {
    console.log('connection error http', httpStatusCode);
});
Twitter.on('connection error stall', function () {
    console.log('connection error stall');
});
Twitter.on('connection rate limit', function (httpStatusCode) {
    console.log('connection rate limit', httpStatusCode);
});
Twitter.on('connection error unknown', function (error) {
    console.log('connection error unknown', error);
    Twitter.close();
});
Twitter.on('data error', function (error) {
    console.log('data error', error);
});

//gets data from the Streaming API and pushes it back to index.html
Twitter.on('data', function(tweet) {
	//input data for the data visualizations on every tweet
	MongoClient.connect(url, function(err, db) {
		var d = new Date();
		assert.equal(null, err);
		var collection = db.collection("timeline");
		collection.insert({'date':(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate())});
		
		db.close();
	});
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var collection = db.collection("hashtags");
		var ins = tweet['entities']['hashtags'];
		ins.forEach(function(value) {
			collection.insert({hashtag:value['text']});
		});
		var collection2 = db.collection("twusers");
		collection2.insert({screen_name: tweet['user']['screen_name'],followers_count:tweet['user']['followers_count']});
		
		var d = new Date();
		var collection3 = db.collection("timeline");
		collection3.insert({date:d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()});
		
		db.close();
	});
	
	if (watchList.total < watchList.count) {
		watchList.tweets.push(tweet);
		watchList.total++;
		if (makedb == 'no') {
			io.emit('data',watchList);
			io.emit('print',"Loading Tweets ... ");
		}
	}else {
		//store into database
		if (makedb == 'yes') {
			
			// Establish connection to db
			MongoClient.connect(url, function(err,db) {
				assert.equal(null,err);
				db.collection("tweets").drop();
				db.close();
			});
			MongoClient.connect(url, function(err, db) {
				assert.equal(null, err);
				var collection = db.collection("tweets");
				collection.insert(watchList.tweets);
				db.close();
			});
			io.emit('print', "Finished Building Database ... ");
		}
		//close connection
		if (makedb == 'no') {
			io.emit('print','Finished loading tweets!');
		}
		Twitter.close();
		return;	
	}
});

}


//if search isn't blank does based on the key word
function track(search,makedb) {
var Twitter = new TwitterStream(keys, true);
Twitter.stream('statuses/filter', { track: search});
Twitter.on('connection success', function (uri) {
	console.log('connection success', uri);
});
Twitter.on('connection aborted', function () {
    console.log('connection aborted');
});
Twitter.on('connection error network', function (error) {
    console.log('connection error network', error);
});
Twitter.on('connection error http', function (httpStatusCode) {
    console.log('connection error http', httpStatusCode);
});
Twitter.on('connection error stall', function () {
    console.log('connection error stall');
});
Twitter.on('connection rate limit', function (httpStatusCode) {
    console.log('connection rate limit', httpStatusCode);
});
Twitter.on('connection error unknown', function (error) {
    console.log('connection error unknown', error);
    Twitter.close();
});
Twitter.on('data error', function (error) {
    console.log('data error', error);
});
Twitter.on('data', function(tweet) {
	//input data for the data visualizations on every tweet
	MongoClient.connect(url, function(err, db) {
		var d = new Date();
		assert.equal(null, err);
		var collection = db.collection("timeline");
		collection.insert({'date':(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate())});
		
		db.close();
	});
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var collection = db.collection("hashtags");
		var ins = tweet['entities']['hashtags'];
		ins.forEach(function(value) {
			collection.insert({hashtag:value['text']});
		});
		var collection2 = db.collection("twusers");
		collection2.insert({screen_name: tweet['user']['screen_name'],followers_count:tweet['user']['followers_count']});
		
		db.close();
	});
	
	if (watchList.total < watchList.count) {
		watchList.tweets.push(tweet);
		watchList.total++;
		if (makedb == 'no') {
			io.emit('data',watchList);
			io.emit('print',"Loading Tweets ... ");
		}
	}else {
		//store into database
		if (makedb == 'yes') {
			// Establish connection to db
			MongoClient.connect(url, function(err,db) {
				assert.equal(null,err);
				db.collection("tweets").drop();
				db.close();
			});
			MongoClient.connect(url, function(err, db) {
				assert.equal(null, err);
				var collection = db.collection("tweets");
				collection.insert(watchList.tweets);
				
				db.close();
			});
			io.emit('print', "Finished Building Database ... ");
		}
		if (makedb == 'no') {
			io.emit('print','Finished loading tweets');
		}
		Twitter.close();
		return;
	}
});

}

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});