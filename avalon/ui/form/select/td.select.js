define(['avalon', 'mmRequest', 'text!./td.select.html', 'css!./td.select.css'], function(avalon, req, template) {
	var _interface = function () {};
	avalon.component("td:select", {
		//外部标签属性
		label: '',
		name: 'select',
		disabled: false,
		muti: false,
		must: false,
		auto: true,
		horizontal: false,
		labelCol: 4,
		//外部配置参数
		url: '',
		param: {},
		data: {},
		selected: [],
		onloaded: null,
		onselected: null,
		onchanged: null,
		onready: null,
		//内部属性
		$val: '',
		$selectedVal: '',
		//内部接口
		$bindFun: null,
		$trigger: _interface,
		$validValue: _interface,
		$buildKeys: _interface,
		$buildSelected: _interface,
		//view属性
		_keys: [],
		_isShow: false,
		_isValid: true,
		_isLoading: false,
		_validInfo: '',
		_text: '',
		_loadInfo: '',
		//view接口
		_isSelected: _interface,
		_toggleList: _interface,
		_selectOne: _interface,
		_checkKeydown: _interface,
		_checkKeyPress: _interface,
		//对外方法
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		removeData: _interface,
		reloadData: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			if(hooks.url == '') {
				var selected = vmOpts.selected ? vmOpts.selected : [];
				for(var i = 0; i < selected.length; i ++) {
					hooks.$val += (selected[i] + ',');
					hooks._text += (vmOpts.data[selected[i]] + ',');
				}
				hooks.$val = hooks.$val == '' ? '' : hooks.$val.substring(0, hooks.$val.length - 1);
				hooks._text = hooks._text == '' ? '' : hooks._text.substring(0, hooks._text.length - 1);
			}
			return options;
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm.$bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
				switch (type) {
					case 'loaded':
						if(typeof vm.onloaded == 'function') {
							vm.onloaded(ev, vm);
						}
						break;
					case 'changed':
						vm.$validValue(null);
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					case 'selected':
						if(typeof vm.onselected == 'function') {
							vm.onselected(ev, vm);
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
			vm.$buildKeys = function(obj) {
				for(var k in obj) {
					if(obj.hasOwnProperty(k)) {
						vm._keys.push(k);
					}
				}
				vm._keys.sort();
			}
			vm.$buildSelected = function() {
				var val = '', text = '';
				for(var i = 0; i < vm.selected.size(); i ++) {
					if(vm.data[vm.selected[i]] != undefined) {
						val += (vm.selected[i] + ',');
						text += (vm.data[vm.selected[i]] + ',');
					}
				}
				vm.$val = val == '' ? '' : val.substring(0, val.length - 1);
				vm._text = text == '' ? '' : text.substring(0, text.length - 1);
			}
			vm.$validValue = function(ev) {
				if(vm.must === true) {
					vm._validInfo = '';
					vm._isValid = true;
					if(vm.getValue() == '') {
						vm._isValid = false;
						vm._validInfo = '请选择项目';
					}
				}
			}
			vm.$bindFun = function() {
				if(vm._isShow == true) {
					vm._isShow = false;
				}
			}
			vm._isSelected = function(key) {
				var flag = false;
				for(var i = 0; i < vm.selected.size(); i ++) {
					if(vm.selected[i] == key) {
						flag = true; break;
					}
				}
				return flag;
			}
			vm._toggleList = function(ev) {
				if(!vm.disabled) {
					vm._isShow = !vm._isShow;
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._selectOne = function(ev, key) {
				var selected = false;
				if(!vm.muti) {
					if(vm.selected.size() >= 1) {
						vm.selected.removeAll();
						vm.selected.push(key);
					}else {
						vm.selected.set(0, key);
					}
					vm._isShow = false;
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
				vm.$buildSelected();
				if(selected) {
					vm.$selectedVal = key;
					vm.$trigger(ev, 'selected');
				}
				vm.$trigger(ev, 'changed');
				if(vm.muti) {
					ev.stopPropagation();
					ev.cancelBubble = true;
				}
			}
			vm._checkKeydown = function(ev) {
				ev.preventDefault();
			}
			vm._checkKeyPress = function(ev) {
				ev.preventDefault();
			}
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.$val;
				return data;
			}
			vm.getValue = function() {
				return vm.$val;
			}
			vm.setValue = function(val) {
				var arr = val.split(',');
				if(vm.selected.sort().toString() != arr.sort().toString()) {
					vm.selected.removeAll();
					vm.selected.pushArray(arr);
					vm.$buildSelected();
					vm.$trigger({}, 'changed');
				}
			},
			vm.removeData = function() {
				vm.data = {};
				vm._keys.removeAll();
				vm.selected.removeAll();
				vm.$buildSelected();
			}
			vm.reloadData = function(p) {
				if(vm.url != '') {
					if(p && typeof p == 'object') {
						vm.param = p;
					}
					vm._loadInfo = '';
					vm._isLoading = true;
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
								vm.$buildKeys(vm.data);
								vm.selected.removeAll();
								vm.$buildSelected();
								vm.$trigger(dat.data, 'loaded');
							}else {
								vm._loadInfo = dat.rspmsg;
							}
							vm.$validValue(null);
							vm._isLoading = false;
						},
						error: function(dat) {
							vm._loadInfo = dat.status + '[' + dat.statusText + ']';
							vm._isLoading = false;
						}
					});
				}
				vm.$validValue(null);
			}
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm, elem) {
			if(vm.auto === true && vm.url != '') {
				vm.reloadData();
			}else {
				if(vm.url == '') {
					vm.$buildKeys(vm.data);
				}
			}
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:select"];
  widget.regionals = {};
})