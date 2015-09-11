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