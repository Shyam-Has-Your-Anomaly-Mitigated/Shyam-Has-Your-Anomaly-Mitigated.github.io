try { 
	window.send = function(msg, audience) { 
		//this fixes an IE8 issue - https://medium.com/@jakob/window-postmessage-and-ie8-9-4a376b9dffe7
		if (typeof window.targetWindow.postMessage === 'object') {
			setTimeout(function() {
				window.targetWindow.postMessage(msg, audience); 
			}, 0)		
		}
		else {
			window.targetWindow.postMessage(msg, audience); 
		}
	};
	window.parent._walkmeInternals.hiddenIframeCallback();
} catch (err) { }