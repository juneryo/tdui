define(['ui/tab/td.tab', 'ui/panel/td.panel'], function () {
	var vtab = avalon.define({
		$id: 'tab02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		count: 0,
		$tab_tab_opt: {
			onchanged: function(ev, vm) {
				vtab.count ++;
			},
			tabs: [{title: 'UI简介'}, {title: '其他UI'}, {title: '事件信息', fun: function(ev, vm) {
				avalon.log('切换到事件信息标签' + vm.active);
			}}]
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vtab];
	});
});