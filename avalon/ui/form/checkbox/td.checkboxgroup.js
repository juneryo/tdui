define(['avalon', 'text!./td.checkboxgroup.html', 'css!./td.checkbox.css'], function(avalon, template) {
	var _interface = function () {};
	
	avalon.component("td:checkboxgroup", {
		//外部属性
		label: '',
		name: 'checkboxgroup',
		//外部参数
		checkboxes: [], 
		onchanged: null,
		//view接口
		clickCheckbox: _interface,
		
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
									this._trigger(box, null, 'checked');
									this._trigger(box, null, 'changed');
								}
								dealed = true;
								break;
							}
						}
						if(!dealed) {
							if(box.checked == true) {
								box.checked = false;
								this._trigger(box, null, 'changed');
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
			vm._trigger = function(box, ev, type) {
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
					default: break;
				}
			}
			//接口方法
			vm.clickCheckbox = function(ev, idx) {
				var box = vm.checkboxes[idx];
				if(!box.disabled) {
					box.checked = !box.checked;
					if(box.checked) {
						vm._trigger(box, ev, 'checked');
					}
					vm._trigger(box, ev, 'changed');
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
				vm.value = val;
			}
		},
		$ready: function (vm) {
			
		}
	});
	
	var widget = avalon.components["td:checkboxgroup"];
	widget.regionals = {};
})