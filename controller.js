var searchApp = angular.module('searchApp', []);

searchApp.controller('searchController', function($scope, $http){
	// connect to the Expresss/Node app that's already running
	// this is the API endpoint
	var apiUrl = 'http://localhost:3000/search';

	function showRandomCar(){
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
	showRandomCar();

	$scope.isElectric = function(){
		$http({
			method: 'POST',
			url: apiUrl,
			data: {name: $scope.randomCar}
		}).then(function successCallback(response){
			console.log(response);
			// update the images (cars) collection by 1
			// db.collection('cars').updateOne(
			// 	{
			// 		name: $scope.randomCar
			// 	},
			// 	{
			// 		$inc: {"totalVotes": 1}
			// 	}, function(error, results){console.log(error);}
			// );

			// // update the users collection to include the photo voted on, the vote, and the IP address of the user
			// db.collection('users').insert(
			// 	{
			// 		ip: 'me',
			// 		car: $scope.randomCar,
			// 		vote: "electric"
			// 	}, function(error, results){console.log(error);}
			// );
			// get another random car
			showRandomCar();
		}, function errorCallback(status){
			console.log(status);
		});
	}

	$scope.isNot = function(){
		$http({
			method: 'POST',
			url: apiUrl,
			data: {name: $scope.randomCar}
		}).then(function successCallback(response){
			console.log(response);
			// update the images (cars) collection by 1
			// db.collection('cars').updateOne(
			// 	{
			// 		name: $scope.randomCar
			// 	},
			// 	{
			// 		$inc: {"totalVotes": -1}
			// 	}, function(error, results){console.log(error);}
			// );

			// // update the users collection to include the photo voted on, the vote, and the IP address of the user
			// db.collection('users').insert(
			// 	{
			// 		ip: 'me',
			// 		car: $scope.randomCar,
			// 		vote: "not"
			// 	}, function(error, results){console.log(error);}
			// );
			// get another random car
			showRandomCar();
		}, function errorCallback(status){
			console.log(status);
		});
	}
});