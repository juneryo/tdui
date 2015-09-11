define(['avalon', 'text!./td.checkbox.html', 'css!./td.checkbox.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:checkbox", {
		//外部参数
		
		//view属性
		checked: false,
		disabled: false,
		
		//view接口
		clickCheckbox: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.clickCheckbox = function(ev) {
				if(!vm.disabled) {
					vm.checked = !vm.checked;
				}
			}
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:checkbox"];
  widget.regionals = {};
})