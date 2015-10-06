/*
 * Import the datasets
 */

var schoolData = null;
var overallData = null;

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
getData('2014_results_Overall.json', 
	function(data) {
		console.log('data', data);
		overallData = data;
},
	function(status) {
		console.log('there was an error: ' + status);
});

//get school data
getData('2014_results_school.json', 
	function(data) {
		console.log('data', data);
		schoolData = data;
},
	function(status) {
		console.log('there was an error: ' + status);
});

//Init vars
var colours = ['#0086cf', '#6bcf00', '#0058cf', '#cfaf00', '#F5712F', '#79BAF2', '#0086cf', '#6bcf00', '#0058cf', '#cfaf00', '#F5712F', '#79BAF2', '#0086cf', '#6bcf00', '#0058cf', '#cfaf00', '#F5712F', '#79BAF2'];
var myChart = undefined;


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

//structure data
function structureSingleData(data) {
	for (var i = 0; i < data.length; i++) {
		var thisObj = data[i];
		var tempObj = {label: null, value: null};
		var dataSingModel = [];
		var label;
		var series;

		for (var prop in thisObj) {
			//extract labels
			if (prop === 'Label') {
				label = thisObj[prop];
			}
			//extract numbers
			else if (prop === 'Series') {
				series = thisObj[prop];
			}
		}
		//build new models
		tempObj.color = colours[i];
		tempObj.highlight = colours[i];
		var dataSingNode = new DataSingularNode(tempObj);
		dataSingModel.push(dataSingNode);

	}
	return dataSingModel;
}

function structureMultiData() {
	var dataDuelModel = null;
	for (var j = 0; j < arguments.length; j++) {
		var thisData = arguments[j];
		for (var i = 0; i < thisData.length; i++) {
			var thisObj = thisData[i];
			var tempObj = {labels: [], datasets: [{data: [], fillColor: null}]};
			var label = null;
			var series = [];

			for (var prop in thisObj) {
				//extract labels
				if (prop === 'Label') {
					label = thisObj[prop];
				}
				//extract numbers
				else if (prop === 'Series') {
					series.push(thisObj[prop]);
				}
			}
			//build new models
			tempObj.labels.push(label);
			console.log('tempObj', tempObj);
			tempObj.datasets[j].data.push(series);
			tempObj.datasets[j].fillColor = colours[j];
		}
	}
	return dataDuelModel;
}

//Data Single Node is for Pies, Donuts and Polar area charts
var overallSingModel = structureSingleData(overallData);
var schoolSingModel = structureSingleData(schoolData);
var overalSchoolModel = structureMultiData(overallData, schoolData);

/*
 * Canvas init
 */
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
		myChart = new Chart(ctx).Line(dataPair);
	}
	else if (chartType === 'bar') {
		myChart = new Chart(ctx).Bar(dataCompare);
	}
	else if (chartType === 'radar') {
		myChart = new Chart(ctx).Radar(dataPair);
	}
	else if (chartType === 'pie') {
		myChart = new Chart(ctx).Pie(dataSing);
	}
	else if (chartType === 'polar') {
		myChart = new Chart(ctx).PolarArea(dataSing);	
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