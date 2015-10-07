/*
 * Import the datasets
 */

var schoolData = null;
var overallData = null;
var colours = null;

function getData(url, success, failure) {
	var readyStates = ['UNSENT', 'OPENED', 'HEADERS_RECEIVED', 'LOADING', 'DONE'];
	var request = new XMLHttpRequest();
	request.open('GET', url, false);

	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			//store response
			var response = request.response;
			var responseType = request.getResponseHeader('content-type');
			//handle JSON
			var jsonText = request.responseText;
			var jsonResponse = JSON.parse(jsonText);
			//console.log(jsonResponse);
			success(jsonResponse);
		}
		else if (request.status === 404) {
			failure(request.status + readyStates[request.readyState]);
		}
	}
	request.send(null);
}

//get overall data
getData('data/2014_results_overall.json', 
	function(data) {
		//console.log('data', data);
		overallData = data;
},
	function(status) {
		console.log('there was an error: ' + status);
});

//get school data
getData('data/2014_results_school.json', 
	function(data) {
		//console.log('data', data);
		schoolData = data;
},
	function(status) {
		console.log('there was an error: ' + status);
});

//get colours
getData('data/colours.json', 
	function(data) {
		//console.log('data', data);
		colours = data;
},
	function(status) {
		console.log('there was an error: ' + status);
});

/*
 * Structure the datasets
 */

//Data Pair is for Lines, Bars and Radar charts
var dataPair = {
	labels: [],
	datasets: [{data: null, fillColor: null}],
}

//Singular level model constructor
function DataSingularNode(obj) {
	this.label = obj.label;
	this.value = obj.value;
	this.color = obj.color;
	this.highlight = obj.highlight;
}

//Singular level model constructor
function DataDuelModel(obj) {
	this.labels = obj.labels;
	this.datasets = obj.datasets;
}

function getHighestNumber(prop) {
	//get highest number
	highestNum = 0;
	if (typeof prop === 'number') {
		if (prop > highestNum) {
			highestNum = prop;
		}
	}
	return highestNum;
}

function SingleDataConstructor(data) {
	this.arr = [];

	for (var i = 0; i < data.length; i++) {
		var thisDataNode = data[i];

		thisObj = {label: null, value: null};

		for (var prop in thisDataNode) {
			//extract labels
			if (prop === 'Label') {
				thisObj.label = thisDataNode[prop];
			}
			//extract numbers
			else if (prop === 'Series') {
				thisObj.value = thisDataNode[prop];
			}
		}
		//build new models
		thisObj.color = colours[i];
		thisObj.highlight = colours[i];
		this.arr.push(thisObj);
	}
}

function MultiDataConstructor() {

	this.labels = [];
	this.datasets = [];

	//Get number rows
	for (var j = 0; j < arguments.length; j++) {

		var thisData = arguments[j];

		this.datasets[j] = {
			data: [], 
			fillColor: ''
		};

		for (var i = 0; i < thisData.length; i++) {
			var thisObj = thisData[i];

			for (var prop in thisObj) {
				//extract labels
				if (prop === 'Label') {
					this.labels.push(thisObj[prop]);
				}
				//extract numbers
				else if (prop === 'Series') {
					this.datasets[j].data.push(thisObj[prop]);
				}
			}

			this.datasets[j].fillColor = colours[j];
		}
	}
	var labelsLength = this.labels.length;
	this.labels.splice(labelsLength/2, labelsLength/2);
}

//Data Single Node is for Pies, Donuts and Polar area charts
var overallSingModel = new SingleDataConstructor(overallData);
var schoolSingModel = new SingleDataConstructor(schoolData);
var overalSchoolModel = new MultiDataConstructor(overallData, schoolData);
console.log('overallSingModel', overallSingModel);
console.log('overalSchoolModel', overalSchoolModel);

/*
 * Init app
 */
var myChart = undefined;
var ctx = document.getElementById('myChart').getContext('2d');

/*
 * Manage charts
 */
function chartLoader(chartType) {
	//remove any previous instances
	if (myChart !== undefined) {
		console.log('myChart', myChart);
		myChart.destroy();
	}
	if (chartType === 'line') {
		myChart = new Chart(ctx).Line(overalSchoolModel);
	}
	else if (chartType === 'bar') {
		myChart = new Chart(ctx).Bar(overalSchoolModel);
	}
	else if (chartType === 'radar') {
		myChart = new Chart(ctx).Radar(overalSchoolModel);
	}
	else if (chartType === 'pie') {
		myChart = new Chart(ctx).Pie(overallSingModel.arr);
	}
	else if (chartType === 'polar') {
		myChart = new Chart(ctx).PolarArea(overallSingModel.arr);	
	}
	else {
		console.log('Incorrect chart type string');
	}
}

/*
 * Init
 */
Chart.defaults.global.responsive = true;
chartLoader('line');

/*
 * Button handlers
 */
var lineBtn = document.getElementById('line');
var barBtn = document.getElementById('bar');
var radarBtn = document.getElementById('radar');
var pieBtn = document.getElementById('pie');
var polarBtn = document.getElementById('polar');

lineBtn.addEventListener('click', function() {
	chartLoader('line');
});
barBtn.addEventListener('click', function() {
	chartLoader('bar');
});
radarBtn.addEventListener('click', function() {
	chartLoader('radar');
});
pieBtn.addEventListener('click', function() {
	chartLoader('pie');
});
polarBtn.addEventListener('click', function() {
	chartLoader('polar');
});