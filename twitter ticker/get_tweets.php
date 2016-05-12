<?php
require_once('TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => '704380827044585473-YF0dRzrjcPMET0Dmzh34tGcC06iw2q2',
    'oauth_access_token_secret' => 'b27gMH28anuw6jOnyxKCPD1KUI2hyJ8e5fgIEuHhYzDfG',
    'consumer_key' => 'NAG1Noql3ZqFqXrnCR86FMEk4',
    'consumer_secret' => 'w1RCNW6QUjixskjjZ6k5QpkIIQknuCf5fMpDrVJhayajoma1rs'
);

$url = "https://api.twitter.com/1.1/search/tweets.json";
$requestMethod = "GET";

$query = '?q=';
if(isset($_GET['q']) && $_GET['q']!='' ) {

    $query .= $_GET['q'];

} else {
    $query .= 'something';
}

//echo $query;
$twitter = new TwitterAPIExchange($settings);
$results = $twitter->setGetfield($query)->buildOauth($url, $requestMethod)->performRequest();
echo $results;
?>
