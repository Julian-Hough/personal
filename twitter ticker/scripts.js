//start app
angular.module('app',[]).controller('twitterController', function($scope, $http, $interval) {
	//function for interval to work
	$scope.refresh = function() {
	//get request
	$http.get('get_tweets.php',{params:{q:'q'}}).then(function successCallback(data) {
		//store data
		$scope.feed = data['data']['statuses'];
	});
	};
	
	//refresh function
	$scope.intervalPromise = $interval(function() {
		$scope.refresh();
	}, 12000);
	
	//initial load of data
	$scope.refresh();
});