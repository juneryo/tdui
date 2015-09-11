define(['avalon', 'text!./td.switch.html', 'css!./td.switch.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:switch", {
		//外部参数
		disabled: false,
		on: false,
		label: '',
		name: 'switch',
		//view属性
		
		//view接口
		clickSwitch: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.clickSwitch = function(ev) {
				if(!vm.disabled) {
					vm.on = !vm.on;
				}
			}
			vm.getData = function() {
				var data = new Object();
				data[vm.name] = vm.on;
				return data;
			}
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:switch"];
  widget.regionals = {};
})