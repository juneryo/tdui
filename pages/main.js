define([], function () {
	var vmain = avalon.define({
		$id: 'main',
		testAlert: function(ev) {
			TD.alert('<strong>这里是alert</strong>');
		},
		testConfirm: function(ev) {
			TD.confirm('<strong>这里是confirm</strong>', function() {
				TD.hint('点击了确定', 'success');
			}, function() {
				TD.hint('点击了取消');
			});
		},
		testHint: function(ev) {
			TD.hint('这里是hint', 'info');
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vmain];
	});
});