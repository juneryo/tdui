define(['avalon', 'text!./td.radio.html', 'css!./td.radio.css'], function(avalon, template) {
	var _interface = function () {};
	
	avalon.component("td:radio", {
		//外部属性
		label: '',
		checked: false,
		disabled: false,
		//外部参数
		onchecked: null,
		onchanged: null,
		//view接口
		clickRadio: _interface,
		
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
			//接口方法
			vm.clickRadio = function(ev) {
				if(!vm.disabled) {
					vm.checked = !vm.checked;
					if(vm.checked) {
						vm._trigger(ev, 'checked');
					}
					vm._trigger(ev, 'changed');
				}
			}
			//对外方法
		},
		$ready: function (vm) {
            
		}
	});
	
	//定义标签名称
	var widget = avalon.components["td:radio"];
	widget.regionals = {};
})