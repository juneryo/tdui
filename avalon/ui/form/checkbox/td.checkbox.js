define(['avalon', 'text!./td.checkbox.html', 'css!./td.checkbox.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:checkbox", {
		//外部标签属性
		label: '',
		checked: false,
		disabled: false,
		//外部配置参数
		onchecked: null,
		onchanged: null,
		//内部接口
		$trigger: _interface,
		//view接口
		_clickCheckbox: _interface,
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
					case 'checked':
						if(typeof vm.onchecked == 'function') {
							vm.onchecked(ev, vm);
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
			vm._clickCheckbox = function(ev) {
				if(!vm.disabled) {
					vm.checked = !vm.checked;
					if(vm.checked) {
						vm.$trigger(ev, 'checked');
					}
					vm.$trigger(ev, 'changed');
				}
			}
		},
		$ready: function (vm) {}
	});
	var widget = avalon.components["td:checkbox"];
  widget.regionals = {};
})