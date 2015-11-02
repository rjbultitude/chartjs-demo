function toggleFullScreen(el) {
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (el.requestFullscreen) {
			el.requestFullscreen();
		} 
		else if (el.msRequestFullscreen) {
			el.msRequestFullscreen();
		} 
		else if (el.mozRequestFullScreen) {
			el.mozRequestFullScreen();
		} 
		else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} 
	else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} 
		else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} 
		else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} 
		else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}