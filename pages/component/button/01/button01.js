define(['ui/button/td.button'], function () {
	var vbutton = avalon.define({
		$id: 'button01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$opt: {
			onclicked: function(ev, vm) {
				alert('default');
			}
		},
		$opt1: {
			onclicked: function(ev, vm) {
				alert('primary');
			}
		},
		$opt2: {
			onclicked: function(ev, vm) {
				alert('success');
			}
		},
		$opt3: {
			onclicked: function(ev, vm) {
				alert('info');
			}
		},
		$opt4: {
			onclicked: function(ev, vm) {
				alert('warning');
			}
		},
		$opt5: {
			onclicked: function(ev, vm) {
				alert('danger');
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