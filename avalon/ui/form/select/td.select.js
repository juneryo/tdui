define(['avalon', 'mmRequest', 'text!./td.select.html', 'css!./td.select.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:select", {
		//外部属性
		label: '',
		name: 'select',
		disabled: false,
		muti: false,
		must: false,
		//外部参数
		url: '',
		param: {},
		data: {},
		selected: [],
		onloaded: null,
		onselected: null,
		onchanged: null,
		//内部属性
		value: '',
		selectedValue: '',
		//view属性
		isLoading: false,
		isShow: false,
		isValid: true,
		validInfo: '',
		text: '',
		loadInfo: '',
		//view接口
		isSelected: _interface,
		toggleList: _interface,
		selectOne: _interface,
		
		$template: template,
		// hooks : 定义component中的属性
		//vmOpts : 引用component时的js配置$opt 
		//eleOpts: 使用component时标签中的属性
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			if(hooks.url == '') {
				var selected = vmOpts.selected ? vmOpts.selected : [];
				for(var i = 0; i < selected.length; i ++) {
					hooks.value += (selected[i] + ',');
					hooks.text += (vmOpts.data[selected[i]] + ',');
				}
				hooks.value = hooks.value == '' ? '' : hooks.value.substring(0, hooks.value.length - 1);
				hooks.text = hooks.text == '' ? '' : hooks.text.substring(0, hooks.text.length - 1);
			}
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//内部方法
			vm._trigger = function(ev, type) {
				switch (type) {
					case 'loaded': 
						if(typeof vm.onloaded == 'function') {
							vm.onloaded(ev, vm);
						}
						break;
					case 'changed':
						vm.validValue(null);
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					case 'selected':
						if(typeof vm.onselected == 'function') {
							vm.onselected(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm._buildSelected = function() {
				var val = '', text = '';
				for(var i = 0; i < vm.selected.size(); i ++) {
					if(vm.data[vm.selected[i]] != undefined) {
						val += (vm.selected[i] + ',');
						text += (vm.data[vm.selected[i]] + ',');
					}
				}
				vm.value = val == '' ? '' : val.substring(0, val.length - 1);
				vm.text = text == '' ? '' : text.substring(0, text.length - 1);
			}
			//接口方法
			vm.validValue = function(ev) {
				if(vm.must === true) {
					vm.validInfo = '';
					vm.isValid = true;
					if(vm.getValue() == '') {
						vm.isValid = false;
						vm.validInfo = '请选择项目';
					}
				}
			}
			vm.isSelected = function(key) {
				var flag = false;
				for(var i = 0; i < vm.selected.size(); i ++) {
					if(vm.selected[i] == key) {
						flag = true; break;
					}
				}
				return flag;
			}
			vm.toggleList = function(ev) {
				if(!vm.disabled) {
					vm.isShow = !vm.isShow;
				}
			}
			vm.selectOne = function(ev, key) {
				var selected = false;
				if(!vm.muti) {
					if(vm.selected.size() >= 1) {
						vm.selected.removeAll();
						vm.selected.push(key);
					}else {
						vm.selected.set(0, key);
					}
					vm.isShow = false;
					selected = true;
				}else {
					var removed = false;
					for(var i = 0; i < vm.selected.size(); i ++) {
						if(vm.selected[i] == key) {
							vm.selected.removeAt(i);
							removed = true; break;
						}
					}
					if(!removed) {
						vm.selected.push(key);
						selected = true;
					}
				}
				vm._buildSelected();
				if(selected) {
					vm.selectedValue = key;
					vm._trigger(ev, 'selected');
				}
				vm._trigger(ev, 'changed');
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
				var arr = val.split(',');
				if(vm.selected.sort().toString() != arr.sort().toString()) {
					vm.selected.removeAll();
					vm.selected.pushArray(arr);
					vm._buildSelected();
					vm._trigger({}, 'changed');
				}
			},
			vm.reload = function() {
				if(vm.url != '') {
					vm.loadInfo = '';
					vm.isLoading = true;
					req.ajax({
						type: 'POST',
						url: vm.url,
						data: vm.param,
						headers: {},
						success: function(data, status, xhr) {
							if(data.rspcod == '200') {
								vm.data = data.data;
								vm._buildSelected();
								vm._trigger(data.data, 'loaded');
							}else {
								vm.loadInfo = data.rspmsg;
							}
							vm.validValue(null);
							vm.isLoading = false;
						},
						error: function(data) {
							vm.loadInfo = data.status + '[' + data.statusText + ']';
							vm.isLoading = false;
						}
					});
				}
				vm.validValue(null);
			}
		},
		$ready: function (vm) {
      vm.reload();
    }
	});
	
	var widget = avalon.components["td:select"];
  widget.regionals = {};
})