//Global variables that are used and changed constantly throughout the game
var r_red = 0;
var r_green = 0;
var r_blue = 0;
var randomColor = 0;
var start_time = 0;
var difficulty = 5;
var totalScore = 0;
var score = 0;

  //gets hex value from rgb decimal values
function hexFromRGB(r, g, b) {
	var hex = [
    r.toString( 16 ),
    g.toString( 16 ),
    b.toString( 16 )
	];
    $.each( hex, function( nr, val ) {
		if ( val.length === 1 ) {
        hex[ nr ] = "0" + val;
		}
    });
    return hex.join( "" ).toUpperCase();
}

//refreshes swatch function that is called after score is calculated
function refreshSwatch() {
    red = $( "#red" ).slider( "value" ),
    green = $( "#green" ).slider( "value" ),
    blue = $( "#blue" ).slider( "value" ),
    hex = hexFromRGB( red, green, blue );
    $( "#swatch" ).css( "background-color", "#" + hex );
	$( "#swatch_disp" ).text( "Hex Code: " + hex);
}

//refreshes your color function
function refreshMatch() {
	r_red = Math.floor(Math.random() * (255 + 1));
	r_green = Math.floor(Math.random() * (255 + 1));
	r_blue = Math.floor(Math.random() * (255 + 1));
	randomColor = hexFromRGB(r_red,r_green,r_blue);
	$( "#match" ).css( "background-color", "#" + randomColor);
}

//get score function that follows the word document
function get_score() {
	var end_time = new Date();
	var time = end_time - start_time;
	
	var m_red = $( "#red" ).slider( "value" );
    var m_green = $( "#green" ).slider( "value" );
    var m_blue = $( "#blue" ).slider( "value" );
	
	var perOffR = Math.abs( r_red - m_red)/255*100; 
	var perOffG = (Math.abs( r_green - m_green)/255*100);
	var perOffB = (Math.abs( r_blue - m_blue)/255*100);
	var perOff = (perOffB + perOffG + perOffR)/3;
	score = ((15 - difficulty - perOff)/(15-difficulty))*(15000-time);
	
	//if score is negative set it to 0
	if (score < 0) { score = 0; }
	
  }
  
//main function
$(function() {
	$( "#red, #green, #blue" ).slider({
		orientation: "horizontal",
		range: "min",
		max: 255,
		value: 0,
		slide: refreshSwatch,
		change: refreshSwatch
	  
    });
	
	
	//automatically updates difficulty
	$("#difficulty").change(function () {
		difficulty = $(this).val();
	});
	
	//clear the input automatically when user want to type
	$("#turns").click(function () {
		$(this).val('');            
	});
  
	var oStart = document.getElementById("start");
	oStart.onclick = function () {
		round = 0;
		totalScore = 0;
		$("#roundInfo").html( "Round "+ (round+1) + " of " + totalRounds );
		refreshMatch();
		start_time = new Date();
		$("#getScore").css("display","inline");
		$("#start").css("display","none");
		$("#chooseDifficulty").css("display","none");
		$("#difficulty").css("display","none");
		$("#chooseRounds").css("display","none");
	};
  
//record the turn value when "focusout" event triggered, default is 10 
	var totalRounds = 10;
	$("#turns").focusout(function () {
		if ($(this).val() != '' && $.isNumeric($(this).val())) {
		totalRounds = Math.round($(this).val());
		}
	});
	
	//starting slider values
    $( "#red" ).slider( "value", 19 );
    $( "#green" ).slider( "value", 19 );
    $( "#blue" ).slider( "value", 19 );
	
	
	var oBtn = document.getElementById("getScore");
	oBtn.onclick = function () {
		if ((round+1) < totalRounds) {
			round ++;
			get_score();
			refreshMatch();
			//reset the color slider
			$( "#red" ).slider( "value", 19 );
			$( "#green" ).slider( "value", 19 );
			$( "#blue" ).slider( "value", 19 );
			//sets start time to '0'
			start_time = new Date();
			totalScore += score;
			score = score.toFixed(2);
			$( "#score" ).text( "Current Score: " + score);
			var tempTotal = (totalScore).toFixed(2);
			$("#totalScore").html("Total Score: " + tempTotal);
			$("#roundInfo").html( "Round "+ (round+1) + " of " + totalRounds );
	  
		} else {
			get_score();
			totalScore += score;
			totalScore = (totalScore).toFixed(2);
			$("#totalScore").html("Total Score: " + totalScore);
			$("#lastScore").html("Last Score: " + totalScore);
			$("#start").html("Play Again?");
			$("#start").css("display","inline");
			$("#getScore").css("display","none");
			$( "#red" ).slider( "value", 19 );
			$( "#green" ).slider( "value", 19 );
			$( "#blue" ).slider( "value", 19 );
			$("#chooseDifficulty").css("display","inline");
			$("#difficulty").css("display","inline");
			$("#chooseRounds").css("display","block");
		}
	};
	
});