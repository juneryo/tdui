define(['avalon', 'text!./td.switch.html', 'css!./td.switch.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:switch", {
		//外部标签属性
		label: '',
		name: 'switch',
		disabled: false,
		on: false,
		horizontal: false,
		labelCol: 4,
		//外部配置参数
		display: {},
		onclicked: null,
		onchanged: null,
		onready: null,
		//内部接口
		$trigger: _interface,
		//view接口
		_clickSwitch: _interface,
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
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
				switch (type) {
					case 'changed':
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					case 'clicked':
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
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
			vm._clickSwitch = function(ev) {
				if(!vm.disabled) {
					vm.on = !vm.on;
					vm.$trigger(ev, 'clicked');
					vm.$trigger(ev, 'changed');
				}
			}
			vm.getData = function() {
				var data = new Object();
				data[vm.name] = vm.getValue();
				return data;
			}
			vm.getValue = function() {
				return (vm.on === true || vm.on.toString()) == '1' ? '1' : '0';
			}
			vm.setValue = function(val) {
				var v = (val === true || val.toString() === '1') ? true : false;
				if(v != vm.on) {
					vm.on = v;
					vm.$trigger(null, 'changed');
				}
			}
		},
		$ready: function (vm, elem) {
			vm.$trigger(elem, 'ready');
		}
	});
	var widget = avalon.components["td:switch"];
  widget.regionals = {};
})