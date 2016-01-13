define(['avalon', 'text!./td.spinner.html', 'css!./td.spinner.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:spinner", {
		//外部标签属性
		disabled: false,
		must: false,
		label: '',
		name: 'spinner',
		value: '',
		max: '',
		min: '',
		interval: 1,  //每次增减量
		//外部配置参数
		onupclicked: null,
		ondownclicked: null,
		onchanged: null,
		onclicked: null,
		onready: null,
		//内部接口
		$bindFun: null,
		$trigger: _interface,
		$validValue: _interface,
		//view属性
		_validInfo: '',
		_isValid: true,
		_showBtns: false,
		//view接口
		_clickUp: _interface,
		_clickDown: _interface,
		_toggleBtns: _interface,
		_checkKeydown: _interface,
		_checkKeyPress: _interface,
		_checkKeyUp: _interface,
		//对外方法
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm.$bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
				switch (type) {
					case 'clicked':
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
						}
						break;
					case 'changed':
						vm.$validValue();
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
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm.$validValue = function() {
				vm._validInfo = '';
				vm._isValid = true;
				if(vm.must === true && vm.getValue() == '') {
					vm._isValid = false;
					vm._validInfo = '该字段为必填字段';
				}else if(vm.min != '' && vm.getValue() == '') {
					vm._isValid = false;
					vm._validInfo = '该字段最小值为' + vm.min;
				}
			}
			vm.$bindFun = function() {
				if(vm._showBtns == true) {
					vm._showBtns = false;
				}
			}
			vm._clickUp = function(ev) {
				if(!vm.disabled) {
					var val = (vm.value === '' ? (vm.min == '' ? 0 : vm.min) : (parseInt(vm.value) + vm.interval));
					if(vm.max != '' && parseInt(vm.max) < val) {
						val = vm.max;
					}
					var changed = (!(vm.value == val) || vm.value === '');
					vm.value = val;
					vm.$trigger(ev, 'upclicked');
					if(changed) {
						vm.$trigger(ev, 'changed');
					}
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._clickDown = function(ev) {
				if(!vm.disabled) {
					var val = (vm.value === '' ? 0 : (parseInt(vm.value) - vm.interval));
					if(vm.min != '' && parseInt(vm.min) > val) {
						val = vm.min;
					}
					var changed = (!(vm.value == val) || vm.value === '');
					vm.value = val;
					vm.$trigger(ev, 'downclicked');
					if(changed) {
						vm.$trigger(ev, 'changed');
					}
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._toggleBtns = function(ev) {
				if(!vm.disabled) {
					vm._showBtns = !vm._showBtns;
					vm.$trigger(ev, 'clicked');
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._checkKeydown = function(ev) {
				if(!vm.disabled) {
					if(ev.keyCode.toString() == '8' && vm.disabled == false) {
						//keyUp中处理
					}else {
						ev.preventDefault();
					}
				}
			}
			vm._checkKeyPress = function(ev) {
				ev.preventDefault();
			}
			vm._checkKeyUp = function(ev) {
				if(ev.keyCode.toString() == '8' && vm.disabled == false) {
					vm.setValue('');
					vm.$validValue();
				}
			}
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
					vm.$trigger({}, 'changed');
				}
			}
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm, elem) {
			vm.$validValue();
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:spinner"];
  widget.regionals = {};
})