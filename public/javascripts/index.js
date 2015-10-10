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
	$scope.allData = {};
	$scope.currentSegmentItems = ["test"];

	$scope.addSample = function (item) {

	};

	$scope.fetchSegmentData = function (segment, currentFilter) {
		console.log(segment, currentFilter);
		$http({
			method: "GET",
			url: "http://hackathon.indabamusic.com/samples?"+currentFilter+"="+segment.name
		}).then(function success(res) {
			$scope.currentSegmentItems = res.data;
		}, function err(res) {
			console.log("ERROR");
		});
	};

	console.log("Controller initialized");
	$http(
		{
			method: "GET",
			url: "/filters"
		}
		).then(function success(response) {
			$scope.filterList = Object.keys(response.data);
			$scope.filters = response.data;
			console.log("fetched keys");
			$scope.filterList.forEach(function (filter) {
				$scope.filters[filter].forEach(function (el, i) {
					$http({
						method: "GET",
						url: "http://hackathon.indabamusic.com/samples?count_only=true&"+filter+"="+el
					}).then(
					function (res) {
						// console.log("There are", res.data, "samples for", el);
						$scope.filters[filter][i] = {name: el, count: res.data.count};
					},
					function err (res) {
						console.log("Cannot fetch count for", el);
					});
				})
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
		$scope.allData = response.data;
		console.log($scope.allData);
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