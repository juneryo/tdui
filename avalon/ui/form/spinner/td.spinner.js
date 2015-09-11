define(['avalon', 'text!./td.spinner.html', 'css!./td.spinner.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:spinner", {
		//外部参数
		disabled: false,
		label: '',
		name: 'spinner',
		value: '',
		max: '',
		min: '',
		//view属性
		
		//view接口
		clickUp: _interface,
		clickDown: _interface,
		checkInput: _interface,
		verifyInput: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.clickUp = function(ev) {
				if(!vm.disabled) {
					var val = (vm.value === '' ? 0 : (parseInt(vm.value) + 1));
					if(vm.max != '' && parseInt(vm.max) < val) {
						vm.value = vm.max;
					}else {
						vm.value = val;
					}
				}
			}
			vm.clickDown = function(ev) {
				if(!vm.disabled) {
					var val = (vm.value === '' ? 0 : (parseInt(vm.value) - 1));
					if(vm.min != '' && parseInt(vm.min) > val) {
						vm.value = vm.min;
					}else {
						vm.value = val;
					}
				}
			}
			vm.checkInput = function(ev) {
				if(ev.keyCode == 8) {
					//支持退格
				}else if((ev.keyCode >= 96 && ev.keyCode <= 105) || (ev.keyCode >= 48 && ev.keyCode <= 57)) {
					//支持数字输入
					var c = '';
					if(ev.keyCode >=96) {
						c = (ev.keyCode - 96).toString();
					}else {
						c = (ev.keyCode - 48).toString();
					}
					var nextVal = parseInt(vm.value + c);
					if((vm.max != '' && nextVal > vm.max) || (vm.min != '' && nextVal < vm.min)) {
						ev.preventDefault();
					}
				}else {
					ev.preventDefault();
				}
			}
			vm.getData = function() {
				var data = new Object();
				data[vm.name] = vm.value;
				return data;
			}
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:spinner"];
  widget.regionals = {};
})