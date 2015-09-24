define(['avalon', 'text!./td.checkboxgroup.html', 'css!./td.checkbox.css'], function(avalon, template) {
    var _interface = function () {};
    
    avalon.component("td:checkboxgroup", {
      //外部参数
			label: '',
			disabled: false,
      checkboxes: [], 
      //view属性
        
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
				vm.clickCheckbox = function(ev, el) {
					if(!el.disabled) {
						el.checked = !el.checked;
					}
				}
				
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