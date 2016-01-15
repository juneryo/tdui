define(['avalon', 'text!./td.radiogroup.html', 'css!./td.radio.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:radiogroup", {
		//外部标签属性
		label: '',
		name: 'radiogroup',
		horizontal: false,
		labelCol: 4,
		//外部配置参数
		radios: [],
		onchanged: null,
		onready: null,
		//内部接口
		$trigger: _interface,
		//计算属性
		$computed:{
			value:{
				set: function(val) {
					for(var i=0; i<this.radios.length; i++) {
						var radio = this.radios[i];
						if(radio.value == val) {
							if(radio.checked == false) {
								radio.checked = true;
								this.$trigger(radio, null, 'checked');
								this.$trigger(radio, null, 'changed');
							}
						}else {
							if(radio.checked == true) {
								radio.checked = false;
								this.$trigger(radio, null, 'changed');
							}
						}
					}
				},
				get: function() {
					var val = '';
					for(var i=0; i<this.radios.length; i++) {
						if(this.radios[i].checked) {
							val = this.radios[i].value;
							break;
						}
					}
					return val;
				}
			}
		},
		//view接口
		_clickRadio: _interface,
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
			vm.$trigger = function(radio, ev, type) {
				switch (type) {
					case 'checked':
						if(typeof radio.onchecked == 'function') {
							radio.onchecked(ev, vm, radio);
						}
						break;
					case 'changed':
						if(typeof radio.onchanged == 'function') {
							radio.onchanged(ev, vm, radio);
						}
						if(typeof vm.onchanged == 'function' && radio.checked == true) {
							vm.onchanged(ev, vm, radio);
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
			vm._clickRadio = function(ev, idx) {
				var radio = vm.radios[idx];
				if(!radio.disabled) {
					var changed = false;
					for(var i = 0; i < vm.radios.length; i ++) {
						if(idx == i) {
							changed = (vm.radios[i].checked == false);
							radio.checked = true;
							vm.$trigger(radio, ev, 'checked');
							if(changed) {
								vm.$trigger(radio, ev, 'changed');
							}
						}else {
							changed = (vm.radios[i].checked == true);
							vm.radios[i].checked = false;
							if(changed) {
								vm.$trigger(vm.radios[i], ev, 'changed');
							}
						}
					}
				}
			}
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.value;
				return data;
			}
			vm.getValue = function() {
				return vm.value;
			}
			vm.setValue = function(val) {
				vm.value = val;
			}
		},
		$ready: function (vm, elem) {
			vm.$trigger(elem, 'ready');
		}
	});
	var widget = avalon.components["td:radiogroup"];
  widget.regionals = {};
})