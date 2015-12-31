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
		auto: true,
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
		keys: [],
		_bindFun: null,
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
		_trigger: _interface,
		_buildSelected: _interface,
		validValue: _interface,
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		removeData: _interface,
		reloadData: _interface,
		_buildKeys: _interface,
		checkKeydown: _interface,
		checkKeyPress: _interface,
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
			avalon.unbind(document, 'click', vm._bindFun);
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
			vm._buildKeys = function(obj) {
				for(var k in obj) {
					if(obj.hasOwnProperty(k)) {
						vm.keys.push(k);
					}
				}
				vm.keys.sort();
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
				ev.stopPropagation();
				ev.cancelBubble = true;
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
				if(vm.muti) {
					ev.stopPropagation();
					ev.cancelBubble = true;
				}
			}
			vm.checkKeydown = function(ev) {
				ev.preventDefault();
			}
			vm.checkKeyPress = function(ev) {
				ev.preventDefault();
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
			vm.removeData = function() {
				vm.data = {};
				vm.keys.removeAll();
				vm.selected.removeAll();
				vm._buildSelected();
			}
			vm.reloadData = function(p) {
				if(vm.url != '') {
					if(p && typeof p == 'object') {
						vm.param = p;
					}
					vm.loadInfo = '';
					vm.isLoading = true;
					var obj = {};
					for(var k in vm.param) {
						if(vm.param.hasOwnProperty(k)) {
							obj[k] = vm.param[k];
						}
					}
					req.ajax({
						type: 'POST',
						url: vm.url,
						data: obj,
						headers: {},
						success: function(dat, status, xhr) {
							if(dat.rspcod == '200') {
								vm.data = dat.data;
								vm._buildKeys(vm.data);
								vm.selected.removeAll();
								vm._buildSelected();
								vm._trigger(dat.data, 'loaded');
							}else {
								vm.loadInfo = dat.rspmsg;
							}
							vm.validValue(null);
							vm.isLoading = false;
						},
						error: function(dat) {
							vm.loadInfo = dat.status + '[' + dat.statusText + ']';
							vm.isLoading = false;
						}
					});
				}
				vm.validValue(null);
			}
			//绑定事件
			vm._bindFun = function() {
				if(vm.isShow == true) {
					vm.isShow = false;
				}
			}
			avalon.bind(document, 'click', vm._bindFun, false);
		},
		$ready: function (vm) {
			if(vm.auto === true && vm.url != '') {
				vm.reloadData();
			}else {
				if(vm.url == '') {
					vm._buildKeys(vm.data);
				}
			}
    }
	});

	var widget = avalon.components["td:select"];
  widget.regionals = {};
})
