var express = require("express");
var app = express();

var request = require("request");
var async = require("async");
var compression = require("compression");

var samples;
var filters;

async.parallel([
	function (cb) {
		request("https://hackathon.indabamusic.com/samples", function (req, res) {
			samples = JSON.parse(res.body);
			console.log("Loaded samples");
			cb();
		});
	},
	function (cb) {
		request("http://hackathon.indabamusic.com/samples?filters_only=true", function (req, res) {
			filters = JSON.parse(res.body);
			delete filters.packages;
			console.log("Loaded filters");
			cb();
		});
	}
],
function () {
	console.log("Loaded all data");
});

app.use(compression());

app.get("/samples", function (req, res) {
	if (samples) {
		res.json(samples);
	} else {
		res.status(503).send({error: "data not loaded yet"});
	}
});

app.get("/filters", function (req, res) {
	if (filters) {
		res.json(filters);
	} else {
		res.status(503).send({error: "data not loaded yet"});
	}
})

app.use(express.static("./"))
app.use(express.static("public"));


app.listen(3000, function () {
    console.log("Listening at localhost:3000...");
});
