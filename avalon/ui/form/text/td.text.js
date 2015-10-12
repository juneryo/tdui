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
		$textpose: function (vm, elem) {
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
				vm.isValid = true;
				var reg = null;
				switch(vm.valid) {
					case 'int':
						reg = /^\-?\d+$/;
						vm.validInfo = '请输入正确的整数'; break;
					case '+int':
						reg = /^\+?[1-9][0-9]*$/;
						vm.validInfo = '请输入正确的正整数'; break;
					case '-int':
						reg = /^\-[1-9][0-9]*$/;
						vm.validInfo = '请输入正确的负整数'; break;
					case 'float':
						reg = /^(-?\d+)(\.\d+)?/; 
						vm.validInfo = '请输入正确的浮点数'; break;
					case '+float':
						reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/; 
						vm.validInfo = '请输入正确的正浮点数'; break;
					case '-float':
						reg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; 
						vm.validInfo = '请输入正确的负浮点数'; break;
					case 'ip':
						reg = /^(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/;
						vm.validInfo = 'IP地址有误'; break;
					case 'email': 
						reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{2,5}$/;
						vm.validInfo = '电子邮件地址有误'; break;
					case 'phone': 
						reg = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
						vm.validInfo = '电话号码有误'; break;
					case 'mobile':
						reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
						vm.validInfo = '手机号码有误'; break;
					default:
						break;
				}
				if(reg != null) {
					vm.isValid = reg.test(vm.value);
					vm.validInfo = vm.isValid ? '' : vm.validInfo;
					if(vm.valid.indexOf('int') != -1 || vm.valid.indexOf('float') != -1) {
						if(vm.max != '' && vm.value > vm.max) {
							vm.isValid = false; vm.validInfo = '超过最大限制';
						}
						if(vm.min != '' && vm.value < vm.min) {
							vm.isValid = false; vm.validInfo = '低于最小限制';
						}
					}
				}else {
					if(vm.must === true && vm.value == '') {
						vm.isValid = false; vm.validInfo = '该字段为必填字段';
					}else if(typeof vm.must == 'number' && vm.value.length != vm.must) {
						vm.isValid = false; vm.validInfo = '该字段长度有误';
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