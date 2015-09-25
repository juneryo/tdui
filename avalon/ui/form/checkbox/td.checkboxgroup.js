define(['avalon', 'text!./td.checkboxgroup.html', 'css!./td.checkbox.css'], function(avalon, template) {
	var _interface = function () {};
	
	avalon.component("td:checkboxgroup", {
		//外部属性
		label: '',
		name: 'checkboxgroup',
		//外部参数
		checkboxes: [], 
		//view接口
		clickCheckbox: _interface,
		
		$computed:{
			value:{
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
		},
		$ready: function (vm) {
			
		}
	});
	
	var widget = avalon.components["td:checkboxgroup"];
	widget.regionals = {};
})