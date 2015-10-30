define(['ui/accordion/td.accordion'], function () {
	var vaccordion = avalon.define({
		$id: 'accordion01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$accordion_opt: {
			panels: [{title: 'UI简介'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vaccordion];
	});
});