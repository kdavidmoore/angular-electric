var searchApp = angular.module('searchApp', []);

searchApp.controller('searchController', function($scope, $http){
	// connect to the Expresss/Node app that's already running
	// this is the API endpoint
	var apiUrl = 'http://localhost:3000/search';

	function getAllCars(){
		// make an http get request that returns all the cars
		$http({
			method: 'GET',
			url: apiUrl,
		}).then(function successCallback(response){
			var result = response.data;
			var randomIndex = Math.floor(Math.random() * result.length);
			$scope.randomCar = result[randomIndex].name;
			$scope.randomPhoto = result[randomIndex].src;
		}, function errorCallback(status){
			console.log(status);
		});
	}

	// on load, get all cars in the database
	getAllCars();

	$scope.isElectric = function(){
		var carVoted = $scope.carVoted;
		console.log(carVoted);
	}

	$scope.isNot = function(){
		var carVoted = $scope.carVoted;
		console.log(carVoted);
	}

});