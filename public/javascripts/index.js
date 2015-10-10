// require("angular");
// require("angular-ui-bootstrap");

var app = angular.module("RubberTracks", ["ui.bootstrap"]);

app.controller("MainController", function ($scope, $http) {
	$scope.changeFilter = function (newFilter) {
		$scope.currentFilter = newFilter;
	};
	$scope.segments = {};
	$scope.filterList = ["genre"];
	$scope.filters = {};
	$scope.currentFilter = "genres";

	console.log("Controller initialized");
	$http(
		{
			method: "GET",
			url: "/filters"
		}
		).then(function success(response) {
			$scope.filterList = Object.keys(response.data).map(function (el) {
				return el.replace(/_/g, " ");
			});
			$scope.filters = response.data;
			console.log($scope.filters, $scope.currentFilter);
			console.log("fetched keys");
			$scope.filterList.forEach(function (el) {
				$http({
					method: "GET",
					url: "/count/" + el;
				}).then(
				function success (res) {
					console.log(res);
				},
				function err (res) {
					console.log("Cannot fetch count for", el);
				});
			});
		}, function failure(response) {
			console.log("Error loading");
		}
	);

	$http(
		{
			method: "GET",
			url: "/samples"
		}
	).then(function success(response) {
		console.log("Fetched data...");
		var data = response.data;
		for (var i = 0; i < data.length; i++) {
			if (data[i].genres) {
				data[i].genres.forEach(function (el) {
					$scope.segments[el] = $scope.segments[el] + 1 || 1;
				});
			}
		}
		console.log("GENRES:", $scope.segments);
		$scope.genreList = Object.keys($scope.segments).map(function (el) {
			return {name: el, count: $scope.segments[el]};
		});
	}, function failure(response) {
		console.log(response);
	});

});