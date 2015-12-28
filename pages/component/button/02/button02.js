define(['ui/button/td.button'], function () {
	var vbutton = avalon.define({
		$id: 'button02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$opt: {
			onclicked: function(ev, vm) {
				TD.alert('default');
			},
			actions: [{display: '操作1', fun: function(ev, vm) {
				TD.alert('primary操作1');
			}},{display: '操作2', fun: function(ev, vm) {
				TD.alert('primary操作2');
			}}, {
				type: 'split'
			}, {
				display: '操作3', fun: function(ev, vm) {
				TD.alert('primary操作3');
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
		$ctrl.$vmodels = [vbutton];
	});
});