/*
 * Import the datasets
 */

var schoolData = null;
var overallData = null;
var colours = null;
var coloursAlpha = null;

var overallSingModel;
var schoolSingModel;
var overalSchoolModel;

//get overall data
getJSON('data/2014_results_overall.json',
	function(data) {
		overallData = data;
	},
	function(status) {
		console.log('there was an error: ' + status);
	});

//get school data
getJSON('data/2014_results_school.json',
	function(data) {
		schoolData = data;
	},
	function(status) {
		console.log('there was an error: ' + status);
	});

//get colours
getJSON('data/colours.json',
	function(data) {
		colours = data;
	},
	function(status) {
		console.log('there was an error: ' + status);
	});

//get colours Alpha
getJSON('data/colours-alpha.json',
	function(data) {
		coloursAlpha = data;
	},
	function(status) {
		console.log('there was an error: ' + status);
	});

//Manage full screen mode
var displayContainer = document.getElementById('container');
document.addEventListener('keydown', function(e) {
  if (e.keyCode == 13) {
    toggleFullScreen(displayContainer);
  }
}, false);

/*
 * Structure the datasets
 */

//Data Pair is for Lines, Bars and Radar charts
var dataPair = {
	labels: [],
	datasets: [{
		data: null,
		fillColor: null
	}],
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

		thisObj = {
			label: null,
			value: null
		};

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

	var x = 0;
	var y = 0;
	var z = 0;
	//Run through each data set
	for (var j = 0; j < arguments.length; j++) {

		var thisDataSet = arguments[j];

		this.datasets[j] = {
			data: [],
			fillColor: ''
		};

		dataSetLoop:
		for (var i = 0; i < thisDataSet.length; i++) {
			var thisObj = thisDataSet[i];
			
			objectLoop:
			for (var prop in thisObj) {
				//extract numbers
				if (prop === 'Series') {
					this.datasets[j].data.push(thisObj[prop]);
				}
				//Only get labels when in 1st dataset
				if (j > 0) {
					continue objectLoop;
				}
				else {
					//extract labels
					if (prop === 'Label') {
						this.labels.push(thisObj[prop]);
					}
				}
			}

			this.datasets[j].fillColor = coloursAlpha[j].fillColor;
			this.datasets[j].strokeColor = coloursAlpha[j].strokeColor;
			this.datasets[j].pointColor = coloursAlpha[j].pointColor;
		}
	}
}

function structureData() {
	//Data Single Node is for Pies, Donuts and Polar area charts
	overallSingModel = new SingleDataConstructor(overallData);
	schoolSingModel = new SingleDataConstructor(schoolData);
	overalSchoolModel = new MultiDataConstructor(overallData, schoolData);
}

/*
 * Init app
 */
structureData();
var myChart = undefined;
var ctx = document.getElementById('myChart').getContext('2d');
var options = {
	legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
}

/*
 * Manage charts
 */
function chartLoader(chartType, update) {
	//remove any previous instances
	if (update === true) {
		myChart.update();
	}
	else if (myChart !== undefined) {
		//console.log('myChart', myChart);
		myChart.destroy();
	}
	if (chartType === 'Line') {
		myChart = new Chart(ctx).Line(overalSchoolModel, options);
	} else if (chartType === 'Bar') {
		myChart = new Chart(ctx).Bar(overalSchoolModel);
	} else if (chartType === 'Radar') {
		myChart = new Chart(ctx).Radar(overalSchoolModel);
	} else if (chartType === 'Pie') {
		myChart = new Chart(ctx).Pie(overallSingModel.arr);
	} else if (chartType === 'Polar') {
		myChart = new Chart(ctx).PolarArea(overallSingModel.arr);
	} else {
		console.log('Incorrect chart type string');
	}
	myChart.generateLegend();
}

/*
 * Init
 */
Chart.defaults.global.responsive = true;
chartLoader('Line');

var updateBtn = document.getElementById('update');
updateBtn.addEventListener('click', function() {
	chartLoader('Line', true);	
});

/*
 * Button handlers
 */
//Get parent DOM node
var controlsContainer = document.getElementById('controls');
//Load charts based on text content of child nodes
controlsContainer.addEventListener('click', function(e) {
	Array.prototype.forEach.call(controlsContainer.querySelectorAll('.btn'), function(el) {
		if (el === e.target) {
			var text = e.target.innerText || e.target.textContent.replace( /\s/g, '' );
			console.log('text', text);
			chartLoader(text);
		}
	});
});