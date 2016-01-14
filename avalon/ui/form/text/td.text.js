define(['avalon', 'text!./td.text.html', 'css!./td.text.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:text", {
		//外部标签属性
		label: '',
		value: '',
		name: 'text',
		valid: '',
		max: '',
		min: '',
		maxlen: 999,  //最大长度
		width: '100%',
		must: false,  //可为数字,代表必须的长度(会将覆盖length)
		disabled: false,
		horizontal: false,
		labelCol: 4,
		//外部配置参数
		onchanged: null,
		onclicked: null,
		onready: null,
		//内部接口
		$trigger: _interface,
		//view属性
		_isValid: true,
		_validInfo: '',
		//view接口
		_validValue: _interface,
		_doClick: _interface,
		//对外方法
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			if(typeof elemOpts.must == 'number') {
				elemOpts.maxlen = elemOpts.must;
			}
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
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
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
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
			vm._doClick = function(ev) {
				vm.$trigger(ev, 'clicked');
			}
			vm._validValue = function(ev) {
				vm._validInfo = TD.validate(vm.value, vm.valid);
				vm._isValid = vm._validInfo == '' ? true : false;
				if(vm._isValid) {
					if(vm.must === true && vm.value.trim() == '') {
						vm._isValid = false; vm._validInfo = '该字段为必填字段';
					}else if(typeof vm.must == 'number' && vm.value.length != vm.must) {
						vm._isValid = false; vm._validInfo = '该字段长度有误';
					}else if(vm.valid.indexOf('int') != -1 || vm.valid.indexOf('float') != -1) {
						if(vm.max != '' && vm.value > vm.max) {
							vm._isValid = false; vm._validInfo = '超过最大限制';
						} else if(vm.min != '' && vm.value < vm.min) {
							vm._isValid = false; vm._validInfo = '低于最小限制';
						}
					}
				}
			}
			vm.$watch('value', function(newVal, oldVal) {
				vm.$trigger({newVal: newVal, oldVal: oldVal}, 'changed');
			});
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.value;
				return data;
			}
			vm.getValue = function() {
				return vm.value;
			}
			vm.setValue = function(val) {
				if(val != vm.value) {
					vm.value = val;
					vm._validValue(null);
				}
			}
		},
		$ready: function (vm, elem) {
      vm._validValue(null);
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:text"];
  widget.regionals = {};
})