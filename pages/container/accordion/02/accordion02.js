define(['ui/accordion/td.accordion'], function () {
	var vaccordion = avalon.define({
		$id: 'accordion02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		count: 0,
		$accordion_opt: {
			onchanged: function(obj, vm) {
				vaccordion.count ++;
			},
			panels: [{title: 'UI简介'}, {title: '其他UI'}, {title: '事件信息', fun: function(obj, vm) {
				avalon.log('当前点击：' + vm.active);
			}}]
		},
		$accordion_tab_opt: {
			tabs: [{title: '标签0'}, {title: '标签1'}, {title: '标签2'}]
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