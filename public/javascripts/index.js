window.onkeyup = function (e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
        case 65:
            document.getElementById("0").play();
            break;
        case 83:
            document.getElementById("1").play();
            break;
        case 68:
            document.getElementById("2").play();
            break;
        case 70:
            document.getElementById("3").play();
            break;
        case 74:
            document.getElementById("4").play();
            break;
        case 75:
            document.getElementById("5").play();
            break;
        case 76:
            document.getElementById("6").play();
            break;
        case 186:
            document.getElementById("7").play();
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
    $scope.lastPad = 0;

    $scope.addSample = function (item) {
    	
        if ($scope.selected.length < 8) {
            $scope.selected.push(item);
            var tag = document.getElementById(""+$scope.lastPad);
            tag.src = "https://d34x6xks9kc6p2.cloudfront.net/" + item.s3_key.replace(/\.wav/g, ".mp3");
            console.log(tag.src);
            $scope.lastPad++;
        }

        if($scope.selected.length == 8){
        	document.getElementById('dwnld-btn').style.visibility = 'visible'
        }

    };

    $scope.download = function () {
   		var xmlhttp = new XMLHttpRequest();

    	var durl = "http://10.207.219.16:8080/samples/"
    	var uuid =  "68a4d4da-6e25-11e5-99ff-0e52404cc67c";
    	var secret = "ab68rlMaeCOGKVCA0sqTE0EdxC4IyFjbSCZjic9K";
		$scope.selected.forEach(function(sample){
			var reqUrl = durl + sample._id + '/download?indaba_uuid=' + uuid; 
			$http({url: reqUrl, method: "GET", headers: {"authorization": btoa("ab68rlMaeCOGKVCA0sqTE0EdxC4IyFjbSCZjic9K" + ":" + Date.now())}})
				.then(function success (res) {
					console.log(arguments);
				}, function err (res) {
					console.log("error");
				});
			// xmlhttp.open('GET', reqUrl );
	  //  		xmlhttp.setRequestHeader("authorization", btoa("ab68rlMaeCOGKVCA0sqTE0EdxC4IyFjbSCZjic9K" + ":" + Date.now()))
			// xmlhttp.send();
		});
    }

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