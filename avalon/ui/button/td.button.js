define(['avalon', 'text!./td.button.html'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:button", {
		//外部参数
		value: '',
		type: 'default',  //default, primary, success, info, warning, danger
		size: 'normal',   //large, mormal, small, xsmall
		pull: '',
		disabled: false,
		isAction: false,
		click: null,
		actions: [],
		//view接口
		toggleAction: _interface,
		doClick: _interface,
		doAction: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options; //返回VM的定义对象
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.toggleAction = function(ev) {
				if(!vm.disabled) {
					vm.isAction = !vm.isAction;
				}
			}
			vm.doClick = function(ev) {
				if(typeof vm.click == 'function' && !vm.disabled) {
					vm.click(ev, vm);
				}
			}
			vm.doAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.isAction = !vm.isAction;
			}
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:button"];
  widget.regionals = {};
});