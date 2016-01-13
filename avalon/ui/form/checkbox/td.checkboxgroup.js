define(['avalon', 'text!./td.checkboxgroup.html', 'css!./td.checkbox.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:checkboxgroup", {
		//外部标签属性
		label: '',
		name: 'checkboxgroup',
		//外部配置参数
		checkboxes: [], 
		onchanged: null,
		onready: null,
		//内部接口
		$trigger: _interface,
		//view接口
		_clickCheckbox: _interface,
		//计算属性
		$computed:{
			value:{
				set: function(val) {
					var arr = val.split(',');
					for(var j=0; j<this.checkboxes.length; j++) {
						var box = this.checkboxes[j];
						var dealed = false;
						for(var i=0; i<arr.length; i++) {
							if(box.value == arr[i]) {
								if(box.checked == false) {
									box.checked = true;
									this.$trigger(box, null, 'checked');
									this.$trigger(box, null, 'changed');
								}
								dealed = true;
								break;
							}
						}
						if(!dealed) {
							if(box.checked == true) {
								box.checked = false;
								this.$trigger(box, null, 'changed');
							}
						}
					}
				},
				get: function() {
					var val = '';
					this.checkboxes.forEach(function(el){
						if(el.checked){
							val += (el.value + ',');
						}
					});
					if('' != val){
						val = val.substr(0, val.length - 1);
					}
					return val;
				}
			}
		},
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
			vm.$trigger = function(box, ev, type) {
				switch (type) {
					case 'checked':
						if(typeof box.onchecked == 'function') {
							box.onchecked(ev, vm, box);
						}
						break;
					case 'changed':
						if(typeof box.onchanged == 'function') {
							box.onchanged(ev, vm, box);
						}
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
			vm._clickCheckbox = function(ev, idx) {
				var box = vm.checkboxes[idx];
				if(!box.disabled) {
					box.checked = !box.checked;
					if(box.checked) {
						vm.$trigger(box, ev, 'checked');
					}
					vm.$trigger(box, ev, 'changed');
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
	var widget = avalon.components["td:checkboxgroup"];
	widget.regionals = {};
})