define(['avalon', 'text!./td.dropdown.html', 'css!./td.dropdown.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:dropdown", {
		//外部参数
		disabled: false,
		isMulti: true,
		label: '',
		value: '',
		selected: {},
		name: 'dropdown',
		data: {},
		
		//view属性
		isShow: false,
		lastSelectedValue: '',
		//view接口
		toggleList: _interface,
		selectOne: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			
			//根据外部参数data调整内部监控对象selected
			if(vmOpts.data) {
				for(var k in vmOpts.data) {
					hooks.selected[k] = false;
				}
			}
			
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.toggleList = function(ev) {
				vm.isShow = !vm.isShow;
			}
			vm.selectOne = function(ev, key) {
				if(!vm.isMulti) {
					vm.value = vm.data[key];
					vm.lastSelectedValue = key;
					vm.isShow = false;
				}else {
					if(!vm.selected[key]) {
						vm.value = (vm.value == '' ? vm.data[key] : (vm.value + ',' + vm.data[key]));
						vm.lastSelectedValue = key;
						vm.selected[key] = true;
					}else {
						if(vm.value.indexOf(',' + vm.data[key]) != -1) {
							vm.value = vm.value.replace((',' + vm.data[key]), '');
						}else if(vm.value.indexOf(vm.data[key] + ',') != -1) {
							vm.value = vm.value.replace((vm.data[key] + ','), '');
						}else {
							vm.value = vm.value.replace(vm.data[key], '');
						}
						vm.selected[key] = false;
					}
				}
			}
			
			vm.getSelectedValue = function() {
				var val = vm.lastSelectedValue;
				if(vm.isMulti) {
					val = '';
					for(k in vm.selected) {
						if(vm.selected[k] === true) {
							val += (k + ',');
						}
					}
					val = val.substring(0, val.length - 1);
				}
				var data = new Object();
				data[vm.name] = val;
				return data;
			}
			vm.getSelectedText = function() {
				var data = new Object();
				data[vm.name] = vm.value;
				return data;
			}
			
			
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:dropdown"];
  widget.regionals = {};
})