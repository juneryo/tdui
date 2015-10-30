define(['avalon', 'text!./td.button.html'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:button", {
		//外部参数
		value: '',
		badge: '',
		type: 'default',  //default, primary, success, info, warning, danger
		size: 'normal',   //large, mormal, small, xsmall
		pull: '',
		disabled: false,
		isAction: false,
		onclicked: null,
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
				if(typeof vm.onclicked == 'function' && !vm.disabled) {
					vm.onclicked(ev, vm);
				}
			}
			vm.doAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.isAction = !vm.isAction;
			}
			//对外方法
			vm.click = function() {
				if(!vm.disabled) {
					elem.getElementsByTagName('a')[0].click();
				}
			}
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:button"];
  widget.regionals = {};
});