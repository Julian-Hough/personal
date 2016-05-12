//socket
var socket = io();
var array = [];

//tabs
jQuery(function () {
    jQuery('#myTab a:first').tab('show')
})
$("#tab3").hide();

//on get tweets button push does function 	
function getTweets(){
    // get number of tweets to get and search
	var numTweets = document.getElementById("count").value;
	var searchWut = document.getElementById("search").value;
	//push into array
	var stuff = [];
	stuff.push(numTweets);
	stuff.push(searchWut);
	stuff.push('no');
	//emit message
	socket.emit('getTweets',stuff);
      
};

//download file function
var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName,val) {
		if (val == 1) {
        var file = JSON.stringify(data);
        var blob = new Blob([file], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
		}
		if (val == 2) {
			var blob = new Blob([data], {type: "text/csv"});
			var url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = fileName;
			a.click();
			window.URL.revokeObjectURL(url);
		}
    };
}());
	
//start app
angular.module('app',[]).controller('twitterController', function($scope) {
	//ui cleanup when clicking through tabs
	$scope.clear = function() {
		$("#hashtags").empty();
		$("#users").empty();
		$("#timeline").empty();
		$("#clearTweetsButton").show();
		$("#tab3").hide();
	}
	//more ui cleanup when clicking through tabs
	$scope.visualize = function() {
		$scope.feed = [];
		$("#tab3").show();
		$("#hashtags").empty();
		$("#users").empty();
		$("#timeline").empty();
		$("#clearTweetsButton").hide();
		socket.emit('getHashtags',true);
		socket.emit('getUsers',true);
		socket.emit('getTimeline',true);
		
	}
	
	$scope.dloadTweets = function() {
		
		var fileName = document.getElementById("fileName").value;
		if (fileName == '') { fileName == "tweets"; }
		socket.emit('downloadTweets',fileName);
	}
	
	$scope.showTweets = function() {
		socket.emit('showTweets', 1);
	}
	
	$scope.buildDB = function() {
		// get number of tweets to get and search
		var numTweets = document.getElementById("count2").value;
		var searchWut = document.getElementById("search2").value;
		//push into array
		var stuff = [];
		stuff.push(numTweets);
		stuff.push(searchWut);
		stuff.push("yes");
		//emit message
		socket.emit('getTweets',stuff);
		$scope.print = "Building Database ...";
	}
	
	
	$scope.exportTweets = function() {
	array = [];
	var type = document.getElementById("type").value;
	var send = [];
	if (type == "JSON") {
		send.push("JSON");
		var searchPart = document.getElementById("search").value;
		if (searchPart == "") {searchPart = "RPI"; }
		send.push(String(searchPart));
		socket.emit('exportTweets', send);
	}
	if (type == "CSV"){
		send.push("CSV");
		var searchPart = document.getElementById("search").value;
		if (searchPart == "") {searchPart = "RPI"; }
		send.push(searchPart);
		socket.emit('exportTweets', send);
	
	}
	
	
};

	$scope.downloadTweets = function() {
	array = [];
	var type = document.getElementById("type").value;
	var send = [];
	if (type == "JSON") {
	//parses json data
	angular.forEach($scope.feed, function(value, key) {
		this.push( {
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
		
	}, array);
	var fname = document.getElementById("search").value;
	if (fname == "") {fname = "RPI"; }
	saveData(array,fname+"-tweets.json",1);
	$scope.print = "Downloading " + fname + "-tweets.json to PC ... ";
	
	}
	if (type == "CSV"){
		//csv header
		array = [['"created_at"','"id"','"text"','"user_id"','"user_name"','"user_screen_name"',
		'"user_location"','"user_followers_count"','"user_friends_count"','"user_created_at"',
		'"user_time_zone"','"user_profile_background_color"','"user_profile_image_url"','"geo"',
		'"coordinates"','"place"']];
		//append data to csv
		angular.forEach($scope.feed, function(value, key) {
		this.push( ["\""+String(value["created_at"])+"\"","\""+String(value["id"])+"\"",
		"\""+String(value["text"])+"\"","\""+String(value["user"]["id"])+"\"",
		"\""+String(value["user"]["name"])+"\"","\""+String(value["user"]["screen_name"])+"\"",
		"\""+String(value["user"]["location"])+"\"","\""+String(value["user"]["followers_count"])+"\"",
		"\""+String(value["user"]["friends_count"])+"\"","\""+String(value["user"]["created_at"])+"\"",
		"\""+String(value["user"]["time_zone"])+"\"","\""+String(value["user"]["profile_background_color"])+"\"",
		"\""+String(value["user"]["profile_image_url"])+"\"","\""+String(value["geo"])+"\"",
		"\""+String(value["coordinates"])+"\"","\""+String(value["place"])+"\""
		]);
		
	}, array);
	//csv string concatenation
	array = array.join("\r\n");
	
	var fname = document.getElementById("search").value;
	if (fname == "") {fname = "RPI"; }
	saveData(array,fname+"-tweets.csv",2);
	$scope.print = "Downloading " + fname + "-tweets.csv to PC ... ";
	
	}
	
};
	$scope.clearTweets = function() {
		$scope.feed = [];
	}
	//d3 function of vertical bar chart of how popular this app is
	socket.on('makeTimeline', function(days) {
		var data = [];
		days.reverse().forEach(function(value) {
			data.push({"date":value['_id']['date'],"total":value['count']});
		});

		var margin = {top: 40, right: 40, bottom: 40, left:40},
			width = 320,
			height = 300;

		var x = d3.time.scale().domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 1)])
			.rangeRound([0, width - margin.left - margin.right]);

		var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.total; })])
			.range([height - margin.top - margin.bottom, 0]);

		var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(d3.time.days, 1)
			.tickFormat(d3.time.format('%a %d')).tickSize(0).tickPadding(8);

		var yAxis = d3.svg.axis().scale(y).orient('left').tickPadding(8);

		var svg = d3.select('#timeline').append('svg').attr('class', 'chart').attr('width', width)
			.attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		svg.selectAll('.chart').data(data).enter().append('rect').attr('class', 'malebar').attr('x', function(d) { return x(new Date(d.date)); })
			.attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.total)) })
			.attr('width', 10).attr('height', function(d) { return height - margin.top - margin.bottom - y(d.total) });

		svg.append('g').attr('class', 'x axis').attr('transform','translate(0, '+(height - margin.top - margin.bottom)+')').call(xAxis);

		svg.append('g').attr('class', 'y axis').call(yAxis);
	});
	//d3 horizontal bar chart of popular users
	socket.on('makeUsers',function(user) {
		var data = [
		  {"screen_name": user[0]['screen_name']+' ('+user[0]['followers_count']+')', "followers_count": user[0]['followers_count']},
		  {"screen_name": user[1]['screen_name']+' ('+user[1]['followers_count']+')', "followers_count": user[1]['followers_count']},
		  {"screen_name": user[2]['screen_name']+' ('+user[2]['followers_count']+')', "followers_count": user[2]['followers_count']},
		  {"screen_name": user[3]['screen_name']+' ('+user[3]['followers_count']+')', "followers_count": user[3]['followers_count']},
		  {"screen_name": user[4]['screen_name']+' ('+user[4]['followers_count']+')', "followers_count": user[4]['followers_count']}
		];		
		var w = 320,
			h = 320,
			topMargin = 15,
			labelSpace = 40,
			innerMargin = 0,
			outerMargin = 0,
			gap = 2,
			dataRange = d3.max(data.map(function(d) { return d.followers_count }));
			leftLabel = "Left label",
			rightLabel = "Right label";

		var chartWidth = w - innerMargin - outerMargin,
			barWidth = h / data.length,
			yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
			total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
			commas = d3.format(",.0f");

		/* main panel */
		var vis = d3.select("#users").append("svg").attr("width", w).attr("height", h);

		var bar = vis.selectAll("g.bar").data(data).enter().append("g").attr("class", "bar")
		.attr("transform", function(d, i) {return "translate(0," + (yScale(i) + topMargin) + ")";
		});

		bar.append("text").attr("class", "below").attr("x", 12).attr("dy", "1.2em")
		.attr("text-anchor", "left").text(function(d) { return d.screen_name; })
		.style("fill", "#000000");

		bar.append("rect").attr("class", "malebar").attr("height", barWidth-gap).attr("x", 10);

		bar.append("svg")
			.attr({height: barWidth-gap}).append("text").attr("class", "up")
			.attr("x", 12).attr("dy", "1.2em").attr("text-anchor", "left")
			.text(function(d) { return d.screen_name; }).style("fill", "#ffffff");

		refresh(data);
		function refresh(data) {
			var bars = d3.selectAll("g.bar").data(data);
			bars.selectAll("rect.malebar").transition()
			.attr("width", function(d) { return total(d.followers_count); });
			bars.selectAll("svg").attr("width", function(d) { return total(d.followers_count) + 10; });   
		}
	});
	//d3 make pie chart of popular hastags
	socket.on('makeHashtags', function(tags) {
		var w = 280;
		var h = 280;
		var r = h/2;
		var color = d3.scale.category20c();
		
		var data = [{"label":tags[0]['count'], "value":tags[0]['count']}, 
          {"label":tags[1]['count'], "value":tags[1]['count']}, 
          {"label":tags[2]['count'], "value":tags[2]['count']},
          {"label":tags[3]['count'], "value":tags[3]['count']},
          {"label":tags[4]['count'], "value":tags[4]['count']}];
		$("#hashtag").append('<li class="liBlack"><div class=\"box pie1\"></div>#'+tags[0]['_id']['hashtag']+'</li>');
		$("#hashtag").append('<li class="liBlack"><div class=\"box pie2\"></div>#'+tags[1]['_id']['hashtag']+'</li>');
		$("#hashtag").append('<li class="liBlack"><div class=\"box pie3\"></div>#'+tags[2]['_id']['hashtag']+'</li>');
		$("#hashtag").append('<li class="liBlack"><div class=\"box pie4\"></div>#'+tags[3]['_id']['hashtag']+'</li>');
		$("#hashtag").append('<li class="liBlack"><div class=\"box pie5\"></div>#'+tags[4]['_id']['hashtag']+'</li>');
		

		var vis = d3.select('#hashtags').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
		var pie = d3.layout.pie().value(function(d){return d.value;});

		// declare an arc generator function
		var arc = d3.svg.arc().outerRadius(r);

		// select paths, use arc generator to draw
		var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
		arcs.append("svg:path").attr("fill", function(d, i){
			return color(i);
		}).attr("d", function (d) {
			return arc(d);
		});

		// add the text
		arcs.append("svg:text").attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
			return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
			return data[i].label;}
			);
	});
	
	
	socket.on('print', function(desc) {
		$scope.$apply(function() {
			$scope.print = desc;
		});
	});
	

	// on tweet received, append to list
    socket.on('data', function(tweets){
		//bind data to feed
		$scope.$apply(function() {
			$scope.feed = tweets['tweets'];
		});
    });
});
