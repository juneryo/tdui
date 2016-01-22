define(['ui/form/spinner/td.spinner', 'ui/form/datepicker/td.datepicker', 'ui/form/switch/td.switch', 'ui/form/rate/td.rate', 'ui/form/autocomplete/td.autocomplete'], function () {
	var velement = avalon.define({
		$id: 'element02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		spinner_info: '',
		datepicker_info: '',
		switch_info: '',
		rate_info: '',
		auto_info: '',
		$spinner_opt: {
			onclicked: function(ev, vm) {
				velement.spinner_info = '点击事件';
			},
			onchanged: function(ev, vm) {
				velement.spinner_info = '改变事件[' + vm.getValue() + ']';
			},
			onupclicked: function(ev, vm) {
				velement.spinner_info = '点击升事件 会触发改变事件';
			},
			ondownclicked: function(ev, vm) {
				velement.spinner_info = '点击降事件 会触发改变事件';
			}
		},
		$datepicker_opt: {
			onclicked: function(ev, vm) {
				velement.datepicker_info = '点击事件';
			},
			onpicked: function(ev, vm) {
				velement.datepicker_info = '选中事件[' + vm.getValue() + ']';
			},
			onchanged: function(ev, vm) {
				velement.datepicker_info = '改变事件[' + vm.getValue() + '] 选择时会触发选中事件';
			}
		},
		$switch_opt: {
			display: {
				on: '可用',
				off: '禁用'
			},
			onclicked: function(ev, vm) {
				velement.switch_info = '点击事件 会触发改变事件';
			},
			onchanged: function(ev, vm) {
				velement.switch_info = '改变事件[' + vm.getValue() + ']';
			}
		},
		$rate_opt: {
			onclicked: function(ev, vm) {
				velement.rate_info = '点击事件[' + vm.getValue() + '] 会触发改变事件';
			},
			onchanged: function(ev, vm) {
				velement.rate_info = '改变事件[' + vm.getValue() + ']';
			}
		},
		$auto_opt: {
			data: {'china': '中国', 'america': '美国', 'korea': '韩国', 'japan': '日本'},
			url: 'data/td.select.json',
			param: {key: '111'},
			onselected: function(ev, vm) {
				velement.auto_info = '选中事件[' + vm.getValue() + ']';
				avalon.log(vm.getData(true));
				TD.hint('选中' + vm.getText());
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
		$ctrl.$vmodels = [velement];
	});
});