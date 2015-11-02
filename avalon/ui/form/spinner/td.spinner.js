define(['avalon', 'text!./td.spinner.html', 'css!./td.spinner.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:spinner", {
		//外部属性
		disabled: false,
		must: false,
		label: '',
		name: 'spinner',
		value: '',
		max: '',
		min: '',
		interval: 1,  //每次增减量
		//外部参数
		onupclicked: null,
		ondownclicked: null,
		onchanged: null,
		onclicked: null,
		//view属性
		validInfo: '',
		isValid: true,
		showBtns: false,
		//view接口
		clickUp: _interface,
		clickDown: _interface,
		toggleBtns: _interface,
		validValue: _interface,
		checkKeydown: _interface,
		
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
					case 'clicked':
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
						}
						break;
					case 'changed':
						vm.validValue();
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
					var val = (vm.value === '' ? (vm.min == '' ? 0 : vm.min) : (parseInt(vm.value) + vm.interval));
					if(vm.max != '' && parseInt(vm.max) < val) {
						val = vm.max;
					}
					var changed = (!(vm.value == val) || vm.value === '');
					vm.value = val;
					vm._trigger(ev, 'upclicked');
					if(changed) {
						vm._trigger(ev, 'changed');
					}
				}
			}
			vm.clickDown = function(ev) {
				if(!vm.disabled) {
					var val = (vm.value === '' ? 0 : (parseInt(vm.value) - vm.interval));
					if(vm.min != '' && parseInt(vm.min) > val) {
						val = vm.min;
					}
					var changed = (!(vm.value == val) || vm.value === '');
					vm.value = val;
					vm._trigger(ev, 'downclicked');
					if(changed) {
						vm._trigger(ev, 'changed');
					}
				}
			}
			vm.toggleBtns = function(ev) {
				if(!vm.disabled) {
					vm.showBtns = !vm.showBtns;
					vm._trigger(ev, 'clicked');
				}
			}
			vm.checkKeydown = function(ev) {
				if(!vm.disabled) {
					//退格则全部删除
					if(ev.keyCode.toString() == '8') {
						vm.setValue('');
					}
				}
			}
			vm.validValue = function() {
				if(vm.must === true) {
					vm.validInfo = '';
					vm.isValid = true;
					if(vm.getValue() == '') {
						vm.isValid = false;
						vm.validInfo = '该字段为必填字段';
					}
				}
			}
			
			//对外方法
			vm.getData = function() {
				var data = new Object();
				data[vm.name] = vm.value;
				return data;
			}
			vm.getValue = function() {
				return vm.value;
			}
			vm.setValue = function(val) {
				if(vm.value != val) {
					vm.value = val;
					vm._trigger(null, 'changed');
				}
			}
		},
		$ready: function (vm) {
			vm.validValue();
    }
	});
	
	var widget = avalon.components["td:spinner"];
  widget.regionals = {};
})