define(['ui/dialog/td.dialog', 'ui/button/td.button'], function () {
	var vdialog = avalon.define({
		$id: 'dialog02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$button_opt: {
			onclicked: function() {
				avalon.vmodels['large_dialog'].showDialog();
			}
		},
		$button1_opt: {
			onclicked: function() {
				avalon.vmodels['normal_dialog'].showDialog();
			}
		},
		$lg_dialog_opt: {
			onshowed: function(obj, vm) {
				avalon.log('dialog show');
			},
			onhided: function(obj, vm) {
				avalon.log('dialog hide');
			},
			buttons: [{display: '确定', type: 'primary', fun: function(ev, vm) {
				avalon.vmodels['small_dialog'].showDialog();
			}}, {display: '关闭', fun: function(ev, vm) {
				vm.hideDialog();
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
		$ctrl.$vmodels = [vdialog];
	});
});