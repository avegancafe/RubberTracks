require("angular");

var app = angular.module("RubberTracks", []);

app.controller("MainController", function ($scope, $http) {
	console.log("Controller initialized");
	$http(
		{
			method: "GET",
			url: "https://hackathon.indabamusic.com/samples"
		}
	).then(function success(response) {
		console.log(response.data);

	}, function failure(response) {
		console.log(response);
	});
});