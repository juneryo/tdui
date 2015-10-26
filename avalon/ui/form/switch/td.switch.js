define(['avalon', 'text!./td.switch.html', 'css!./td.switch.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:switch", {
		//外部属性
		label: '',
		name: 'switch',
		disabled: false,
		on: false,
		//外部参数
		display: {},
		onclicked: null,
		onchanged: null,
		//view接口
		clickSwitch: _interface,
		
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
					case 'clicked':
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
						}
						break;
					default: break;
				}
			}
			//接口方法
			vm.clickSwitch = function(ev) {
				if(!vm.disabled) {
					vm.on = !vm.on;
					vm._trigger(ev, 'clicked');
					vm._trigger(ev, 'changed');
				}
			}
			//对外方法
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
					vm._trigger(null, 'changed');
				}
			}
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:switch"];
  widget.regionals = {};
})