//Weekday Array
var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

//Month Array
var month = new Array();
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";

//Geographical Degree to Compass Direction
function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

//Kelvin to Fahrenheit Helper Function
function convert(degree) {
	return degree * (9/5) - 459.67;
}

//m/s to mph helper function
function mPH(windSpeed) {
	return windSpeed * 2.2369362920544;
}

//Weather Type Helper Function for Weather Icon
function weatherType(weatherDesc) {
	if (weatherDesc == "Clear") { return 2; }
	if (weatherDesc == "Clouds") { return 6; }
	if (weatherDesc == "Rain") { return 10; }
	if (weatherDesc == "Snow") { return 14; }
}

//Another Helper Function for Weather Icon from AVGs
function weatherAVG(clear,cloud,rain,snow) {
	var TheWeather;
	var maxCount = 0;
	if (clear > maxCount) { maxCount = clear; }
	if (cloud > maxCount) { maxCount = cloud; }
	if (rain > maxCount) { maxCount = rain; }
	if (snow > maxCount) { maxCount = snow; }
	
	if (maxCount == snow) { return 14; }
	if (maxCount == rain) { return 10; }
	if (maxCount == cloud) { return 6; }
	if (maxCount == clear) { return 2; }
}


var latitude;
var longitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude; 
	
//API URLs	
var CurrentWeatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=cbfdb5be570feb1ba7f9884d88dd868a";	
var FiveDayWeatherAPI = "http://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&appid=44db6a862fba0b067b1930da0d769e98";
	
//AJAX get request to pull data from json file
$.getJSON(CurrentWeatherAPI, function(data) {
		
		var today = new Date();
		
		//variables to store important information
		var cityName = data.name;
		var windSpeed = data.wind.speed;
		var windDir = data.wind.deg;
		var weatherDesc = data.weather[0].main;
		var humidity = data.main.humidity;
		var currentTemp = data.main.temp;
		
		//Current weather html data
		var CWOutput = "<li class=\"today forecast\"><ul class=\"forecast-header\">";
		CWOutput += "<li class=\"day\">"+weekday[today.getDay()]+"</li><li class=\"date\">";
		CWOutput += today.getDate()+" "+month[today.getMonth()]+"</li></ul><ul class=\"forecast-content\">";
		CWOutput += "<li class=\"location\">"+cityName+"</li>";	
		CWOutput += "<li class=\"degree\"><ul class=\"num\">"+Math.round(convert(currentTemp))+"<sup>o</sup>F</ul><ul class=\"forecast-icon\"><img src=\"images/icons/icon-";
		CWOutput += weatherType(weatherDesc)+".svg\" width=90></ul></li>";
		CWOutput += "<span><img src=\"images/Water-Drop.png\" height=\"21px\" width=\"21px\">"+Math.round(humidity)+"%</span>";
		CWOutput += "<span><img src=\"images/icon-wind.png\">"+mPH(windSpeed).toFixed(2)+" MPH</span>";
		CWOutput += "<span><img src=\"images/icon-compass.png\">"+degToCompass(windDir)+"</span></ul></li>";
		CWOutput += "";
		
		$("#weather").append(CWOutput);	
});

//GET request
$.getJSON(FiveDayWeatherAPI, function(data) {
	
	var today = new Date();
	var weatherType;
	
	var weatherDesc;
	var minTemp = 10000;
	var maxTemp = -10000;
	var weatherDay = today.getDay();
	
	var clear = 0;
	var cloud = 0;
	var rain = 0;
	var snow = 0;
	var count = 0;
	
	
	//Go through every 3 hour weather data
	$.each(data.list, function(key, val) {
		
		var arrayDate = new Date();
		arrayDate.setDate(val.dt_txt.substring(8,10));
		
		//gets min temp
		if (val.main.temp_min < minTemp) {
			minTemp = val.main.temp_min;
		}
		//get max temp
		if (val.main.temp_max > maxTemp) {
			maxTemp = val.main.temp_max;
		}
		//counts weather types
		if (val.weather[0].main == "Clear") { clear++; }
		if (val.weather[0].main == "Clouds") { cloud++; }
		if (val.weather[0].main == "Rain") { rain++; }
		if (val.weather[0].main == "Snow") { snow++; }
		
		//resets values for each new day and prints the old day
		if (arrayDate.getDay() != weatherDay && weatherDay != today.getDay()) {
			
			
			var FDOutput = "<div class=\"forecast\"><div class=\"forecast-header\"><div class=\"day\">";
			FDOutput += weekday[weatherDay]+"</div></div><div class=\"forecast-content\"><div class=\"forecast-icon\"><img src=\"images/icons/icon-";
			FDOutput += weatherAVG(clear,cloud,rain,snow)+".svg\" width=48></div><div class=\"degree\">";
			FDOutput += Math.round(convert(maxTemp))+"<sup>o</sup>F</div><small>"+Math.round(convert(minTemp))+"<sup>o</sup></small></div></div>";
			
			$("#weather").append(FDOutput);
			
			weatherDay = arrayDate.getDay();
			minTemp = 10000;
			maxTemp = -10000;
			clear = 0;
			cloud = 0;
			rain = 0;
			snow = 0;
			count++;
			
		}else {
			weatherDay = arrayDate.getDay();
		}
		
	});
	
	//if count is greater than 5 extra data isn't enough for display the next day
	if (count < 5) {
	//prints 5th day from the API
	var FDOutput = "<div class=\"forecast\"><div class=\"forecast-header\"><div class=\"day\">";
	FDOutput += weekday[weatherDay]+"</div></div><div class=\"forecast-content\"><div class=\"forecast-icon\"><img src=\"images/icons/icon-";
	FDOutput += weatherAVG(clear,cloud,rain,snow)+".svg\" width=48></div><div class=\"degree\">";
	FDOutput += Math.round(convert(maxTemp))+"<sup>o</sup>F</div><small>"+Math.round(convert(minTemp))+"<sup>o</sup></small></div></div>";
			
	$("#weather").append(FDOutput);
			
	}
	
});


}	

//Call Function on Site Load	
window.onload = function() {
  getLocation();
};	
