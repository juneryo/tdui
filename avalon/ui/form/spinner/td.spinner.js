define(['avalon', 'text!./td.spinner.html', 'css!./td.spinner.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:spinner", {
		//外部属性
		disabled: false,
		label: '',
		name: 'spinner',
		value: '',
		max: '',
		min: '',
		//外部参数
		onupclicked: null,
		ondownclicked: null,
		onchanged: null,
		//view接口
		clickUp: _interface,
		clickDown: _interface,
		checkKeydown: _interface,
		checkInput: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//内部方法
			vm._trigger = function(ev, type) {
				switch (type) {
					case 'changed':
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					case 'upclicked':
						if(typeof vm.onupclicked == 'function') {
							vm.onupclicked(ev, vm);
						}
						break;
					case 'downclicked':
						if(typeof vm.ondownclicked == 'function') {
							vm.ondownclicked(ev, vm);
						}
						break;
					default: break;
				}
			}
			//接口方法
			vm.clickUp = function(ev) {
				if(!vm.disabled) {
					vm._trigger(ev, 'upclicked');
					var val = (vm.value === '' ? (vm.min == '' ? 0 : vm.min) : (parseInt(vm.value) + 1));
					if(vm.max != '' && parseInt(vm.max) < val) {
						val = vm.max;
					}
					var changed = (!(vm.value == val) || vm.value === '');
					vm.value = val;
					if(changed) {
						vm._trigger(ev, 'changed');
					}
				}
			}
			vm.clickDown = function(ev) {
				if(!vm.disabled) {
					vm._trigger(ev, 'downclicked');
					var val = (vm.value === '' ? 0 : (parseInt(vm.value) - 1));
					if(vm.min != '' && parseInt(vm.min) > val) {
						val = vm.min;
					}
					var changed = (!(vm.value == val) || vm.value === '');
					vm.value = val;
					if(changed) {
						vm._trigger(ev, 'changed');
					}
				}
			}
			vm.checkKeydown = function(ev) {
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
			vm.checkInput = function(ev) {
				//配合keydown触发changed事件
				vm._trigger(ev, 'changed')
			}
			//vm.$watch('value', function(newVal, oldVal) {
				//通过vm设置value, 此处会执行2次？
				//vm._trigger({}, 'changed');
			//});
			//对外方法
			vm.getData = function() {
				var data = new Object();
				data[vm.name] = vm.value;
				return data;
			}
		},
		$ready: function (vm) {
			
    }
	});
	
	var widget = avalon.components["td:spinner"];
  widget.regionals = {};
})