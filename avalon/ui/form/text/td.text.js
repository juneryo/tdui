define(['avalon', 'text!./td.text.html', 'css!./td.text.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:text", {
		//外部属性
		label: '',
		value: '',
		name: 'text',
		valid: '',
		max: '',
		min: '',
		maxlen: -1,   //最大长度
		width: '100%',
		must: false,  //也可为数字 代表必须的长度(会将覆盖length)
		disabled: false,
		//外部参数
		onchanged: null,
		onclicked: null,
		
		//view属性
		isValid: true,
		validInfo: '',
		//view接口
		validValue: _interface,
		doClick: _interface,
		
		$template: template,
		// hooks : 定义component中的属性
		//vmOpts : 引用component时的js配置$opt 
		//eleOpts: 使用component时标签中的属性
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
			//内部方法
			vm._trigger = function(ev, type) {
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
					default: break;
				}
			}
			
			//接口方法
			vm.doClick = function(ev) {
				vm._trigger(ev, 'clicked');
			}
			vm.validValue = function(ev) {
				vm.validInfo = TD.validate(vm.value, vm.valid);
				vm.isValid = vm.validInfo == '' ? true : false;
				if(vm.isValid) {
					if(vm.must === true && vm.value.trim() == '') {
						vm.isValid = false; vm.validInfo = '该字段为必填字段';
					}else if(typeof vm.must == 'number' && vm.value.length != vm.must) {
						vm.isValid = false; vm.validInfo = '该字段长度有误';
					}else if(vm.valid.indexOf('int') != -1 || vm.valid.indexOf('float') != -1) {
						if(vm.max != '' && vm.value > vm.max) {
							vm.isValid = false; vm.validInfo = '超过最大限制';
						} else if(vm.min != '' && vm.value < vm.min) {
							vm.isValid = false; vm.validInfo = '低于最小限制';
						}
					}
				}
			}
			
			//对外方法
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
					vm.validValue(null);
				}
			}
			
			vm.$watch('value', function(newVal, oldVal) {
				vm._trigger({newVal: newVal, oldVal: oldVal}, 'changed');
			});
		},
		$ready: function (vm) {
      vm.validValue(null);
    }
	});
	
	var widget = avalon.components["td:text"];
  widget.regionals = {};
})