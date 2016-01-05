define([], function () {
	var vmain = avalon.define({
		$id: 'main',
		testAlert: function(ev) {
			var main = document.getElementById('idx_main');
			var w = TD.css.getSize(main, 'width');
			var h = TD.css.getSize(main, 'height');
			TD.alert('<strong>主页main尺寸</strong>(宽：' + w + 'px,高：' + h + 'px)');
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