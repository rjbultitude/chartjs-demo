function getJSON(url, success, failure) {
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
			success(jsonResponse);
		} else if (request.status === 404) {
			failure(request.status + ' ' + readyStates[request.readyState]);
		}
	}
	request.send(null);
}