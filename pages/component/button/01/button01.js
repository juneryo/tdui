define(['ui/button/td.button'], function () {
	var vbutton = avalon.define({
		$id: 'button01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$opt: {
			onclicked: function(ev, vm) {
				TD.alert('default');
			}
		},
		$opt1: {
			onclicked: function(ev, vm) {
				TD.alert('primary');
			}
		},
		$opt2: {
			onclicked: function(ev, vm) {
				TD.alert('success');
			}
		},
		$opt3: {
			onclicked: function(ev, vm) {
				TD.alert('info');
			}
		},
		$opt4: {
			onclicked: function(ev, vm) {
				TD.alert('warning');
			}
		},
		$opt5: {
			onclicked: function(ev, vm) {
				TD.alert('danger');
			}
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