define(['ui/dialog/td.dialog', 'ui/button/td.button'], function () {
	var vdialog = avalon.define({
		$id: 'dialog01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$button_opt: {
			onclicked: function() {
				avalon.vmodels['base_dialog'].showDialog();
			}
		},
		$dialog_opt: {
			
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vdialog];
	});
});