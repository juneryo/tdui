require(['mmState', 'tdForm', 'tdText', 'tdPassword'], function () {
	var vidx = avalon.define({
		$id: 'login',
		index_view: '',
	});
	
	avalon.state.config({
		onError: function(obj, state) {
			avalon.log('###onError###');
		},
		onBeforeUnload: function(from, to) {
			avalon.log('###onBeforeUnload###');
		},
		onAbort: function(from, to) {
			avalon.log('###onAbort###');
		},
		onUnload: function(from, to) {
			avalon.log('###onAbort###');
		}, 
		onBegin: function(from, to) {
			avalon.log('###onBegin###');
		}, 
		onLoad: function() {
			//vidx.page = mmState.currentState.stateName.split(".")[1];
			avalon.log('###onLoad###');
			avalon.log(arguments);
		},
		onViewEnter: function(newNode, oldNode) {
			avalon.log('###onViewEnter###');
		}
	});

	avalon.history.start({
		//fireAnchor: false
	})
	
	avalon.scan();
});