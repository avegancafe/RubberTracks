(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])