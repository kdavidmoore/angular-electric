var electricApp = angular.module('electricApp', []);

electricApp.controller('mainController', function($scope, $http){
	// connect to the Expresss/Node app that's already running
	// this is the API endpoint
	var apiUrl = 'http://localhost:3000';
	// on load, get all cars in the database
	showRandomCar();

	$scope.isElectric = function(){
		$http({
			method: 'POST',
			url: apiUrl + '/vote/electric',
			data: {name: $scope.randomCar}
		}).then(function successCallback(response){
			console.log(response);
			showRandomCar();
		}, function errorCallback(status){
			console.log(status);
		});
	}

	$scope.isNot = function(){
		$http({
			method: 'POST',
			url: apiUrl + '/vote/not',
			data: {name: $scope.randomCar}
		}).then(function successCallback(response){
			console.log(response);
			showRandomCar();
		}, function errorCallback(status){
			console.log(status);
		});
	}

	function showRandomCar(){
		// make an http get request that returns all the cars
		$http({
			method: 'GET',
			url: apiUrl,
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

});