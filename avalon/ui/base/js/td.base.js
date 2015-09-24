//Éú³ÉUUID
function genId(prefix) {
	prefix = prefix.toUpperCase() || 'ID'
	return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix);
}

avalon.config({
	paths: {
		mmRequest: './mmRequest.js',
		mmPromise: './mmPromise.js'
	},
	lmaxRepeatSize: 50
});
if(avalon.library == Function) {
	avalon.library("td", {
		$init: function(){},
		$childReady: function(){},
		$ready: function(){},
		$dispose: function(){}
	});
}