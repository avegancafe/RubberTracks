(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var a, b, c, d, e, f, g, h;



/*
window.onkeyup = function (e) {
    switch(e.keyCode) {
        case 65:
            a.stop();
            break;
        case 83:
            b.stop();
            break;
        case 68:
            c.stop();
            break;
        case 70:
            d.stop();
            break;
        case 74:
            e.stop();
            break;
        case 75:
            f.stop();
            break;
        case 76:
            g.stop();
            break;
        case 186:
            h.stop();
            break;
    }
}

*/

window.onkeydown = function (e) {
    switch(e.keyCode) {
        case 65:
            a.play();
            break;
        case 83:
            b.play();
            break;
        case 68:
            c.play();
            break;
        case 70:
            d.play();
            break;
        case 74:
            e.play();
            break;
        case 75:
            f.play();
            break;
        case 76:
            g.play();
            break;
        case 186:
            h.play();
            break;
    }
}

var app = angular.module("RubberTracks", ["ui.bootstrap"]);

app.controller("MainController", function ($scope, $http, $uibModal) {

    $scope.open = function (size, segment, currentFilter) {
        $http({
            method: "GET",
            url: "http://hackathon.indabamusic.com/samples?"+currentFilter+"="+segment.name
        }).then(function success(res) {
            $scope.currentSegmentItems = res.data;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    currentSegmentItems: function () {
                      return $scope.currentSegmentItems;
                    }
                }
            });
            modalInstance.result.then($scope.addSample, function (res) {
                console.log("ERROR");
            });
        }, function err(res) {
            console.log("ERROR");
        })
    };

    $scope.changeFilter = function (newFilter) {
        $scope.currentFilter = newFilter;
    };
    $scope.segments = {};
    $scope.filterList = ["genre"];
    $scope.filters = {};
    $scope.currentFilter = "genres";
    $scope.allData = {};
    $scope.currentSegmentItems = ["test"];
    $scope.selected = [];
    $scope.lastPad = a;

    $scope.addSample = function (item) {
        if ($scope.selected.length < 8) {
            $scope.selected.push(item);
            switch ($scope.lastPad) {
                case a:
                    a = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = b;
                    break;
                case b:
                    b = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = c;
                    break;
                case c:
                    c = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = d;
                    break;
                case d:
                    d = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = e;
                    break;
                case e:
                    e = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = f;
                    break;
                case f:
                    f = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = g;
                    break;
                case g:
                    g = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = h;
                    break;
                case h:
                    h = new Howl({urls: ["https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3")], buffer: true});
                    $scope.lastPad = a;
                    break;
            }
            console.log(a);
        }

    };

    $scope.fetchSegmentData = function (segment, currentFilter) {
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

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, currentSegmentItems) {
    $scope.currentSegmentItems = currentSegmentItems;

    $scope.ok = function (item) {
        $modalInstance.close(item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
},{}]},{},[1])