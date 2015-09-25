define(['avalon', 'text!./td.radiogroup.html', 'css!./td.radio.css'], function(avalon, template) {
	var _interface = function () {};
	
	avalon.component("td:radiogroup", {
		//外部参数
		label: '',
		name: 'radiogroup',
		//外部属性
		radios: [],
		onchanged: null,
		//view接口
		clickRadio: _interface,
		
		$computed:{
			value:{
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
			vm._trigger = function(radio, ev, type) {
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
					default: break;
				}
			}
			//接口方法
			vm.clickRadio = function(ev, idx) {
				var radio = vm.radios[idx];
				if(!radio.disabled) {
					var changed = false;
					for(var i = 0; i < vm.radios.length; i ++) {
						if(idx == i) {
							changed = (vm.radios[i].checked == false);
							radio.checked = true;
							vm._trigger(radio, ev, 'checked');
							if(changed) {
								vm._trigger(radio, ev, 'changed');
							}
						}else {
							changed = (vm.radios[i].checked == true);
							vm.radios[i].checked = false;
							if(changed) {
								vm._trigger(vm.radios[i], ev, 'changed');
							}
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
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:radiogroup"];
  widget.regionals = {};
})