var electricApp = angular.module('electricApp', ['ngRoute']);
const apiUrl = 'http://kdavidmoore.com:3050';


electricApp.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'pages/main.html',
		controller: 'mainController'
	});
	$routeProvider.when('/standings',{
		templateUrl: 'pages/standings.html',
		controller: 'standingsController'
	});
	$routeProvider.when('/upload',{
		templateUrl: 'pages/upload.html',
		controller: 'uploadController'
	});
	// send the user back to the home page if the route is not valid
	$routeProvider.otherwise({
		redirectTo: '/'
	});
});

electricApp.controller('mainController', function($scope, $http){
	// on load, get all cars in the database
	showRandomCar();

	$scope.isElectric = function(){
		vote('electric');
	}


	$scope.isNot = function(){
		vote('not');
	}


	$scope.newUser = function(){
		
		console.log('creating new user...');
	
	}


	$scope.reset = function(){
		$http({
			method: 'GET',
			url: apiUrl + '/reset'
		}).then(function successCallback(response){
			//console.log(response);
			showRandomCar();
		}, function errorCallback(status){
			console.log(status);
		});
	}


	function showRandomCar(){
		// make an http get request that returns all the cars
		$http({
			method: 'GET',
			url: apiUrl
		}).then(function successCallback(response){
			console.log(response);
			var result = response.data;
			var randomIndex = Math.floor(Math.random() * result.length);
			$scope.randomCar = result[randomIndex].name;
			console.log($scope.randomCar);
			$scope.randomPhoto = result[randomIndex].src;
		}, function errorCallback(status){
			console.log(status);
		});
	}

	function vote(voteOption){
		$http({
			method: 'POST',
			url: apiUrl + '/vote/' + voteOption,
			data: {name: $scope.randomCar}
		}).then(function successCallback(response){
			//console.log(response);
			showRandomCar();
		}, function errorCallback(status){
			console.log(status);
		});
	}

});


electricApp.controller('standingsController', function($scope, $http){
	
	$scope.getStandings = function(){
		$http({
			method: 'GET',
			url: apiUrl + '/standings'
		}).then(function successCallback(response){
			console.log(response);
			$scope.standingsList = response.data;
		}, function errorCallback(status){
			console.log(status);
		});
	}

	$scope.getStandings();
});


electricApp.controller('uploadController', function($scope, $http){
	console.log("This is the upload controller.");
});
