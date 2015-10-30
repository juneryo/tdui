define(['ui/tab/td.tab'], function () {
	var vtab = avalon.define({
		$id: 'tab01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$tab_tab_opt: {
			tabs: [{title: 'UI简介'}, {title: 'UI所属'}]
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