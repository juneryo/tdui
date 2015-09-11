define(['avalon', 'text!./td.radio.html', 'css!./td.radio.css'], function(avalon, template) {
	var _interface = function () {};
	
	avalon.component("td:radio", {
		//外部参数
		
		//view属性
		label:"",
		checked: false,
		disabled: false,
		
		//view接口
		clickRadio: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//在此进行事件的实现
			vm.clickRadio = function(ev) {
				if(!vm.disabled) {
					vm.checked = !vm.checked;
				}
			}
		},
		$ready: function (vm) {
            avalon.log("构建完成");
        }
	});
	
	//定义标签名称
	var widget = avalon.components["td:radio"];
    widget.regionals = {};
})