define(['avalon', 'mmRequest', 'text!./td.autocomplete.html', 'css!./td.autocomplete.css'], function(avalon, req, template) {
	var _interface = function () {};
	avalon.component("td:autocomplete", {
		//外部标签属性
		label: '',
		name: 'autocomplete',
		disabled: false,
		must: false,
		horizontal: false,
		labelCol: 4,
		//外部配置参数
		url: '',
		param: {},
		data: {},
		onloaded: null,
		onselected: null,
		onready: null,
		//内部属性
		$val: '',
		//内部接口
		$bindFun: null,
		$trigger: _interface,
		$validValue: _interface,
		$buildKeys: _interface,
		$buildData: _interface,
		$reloadData: _interface,
		//view属性
		_keys: [],
		_isShow: false,
		_isValid: true,
		_isLoading: false,
		_needLoad: false,
		_validInfo: '',
		_text: '',
		_loadInfo: '',
		//view接口
		_selectOne: _interface,
		_clickInput: _interface,
		_checkKeyDown: _interface,
		//对外方法
		getData: _interface,
		getText: _interface,
		getValue: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			return avalon.mix(hooks, vmOpts, elemOpts);
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
			vm.$buildKeys = function(val) {
				vm._keys.removeAll();
				for(var k in vm.data) {
					if(vm.data.hasOwnProperty(k)) {
						vm.data[k] = vm.data[k].replace('<span>', '').replace('</span>', '');
						if(vm.data[k].indexOf(val) != -1) {
							vm.data[k] = vm.data[k].replace(val, '<span>' + val + '</span>');
							vm._keys.push(k);
						}
					}
				}
				vm._keys.sort();
				if(vm._keys.size() == 0) {
					vm._isShow = false;
				}else {
					vm._isShow = true;
				}
			}
			vm.$validValue = function() {
				if(vm.must === true) {
					vm._validInfo = '';
					vm._isValid = true;
					if(vm.getValue() == '') {
						vm._isValid = false;
						vm._validInfo = '请选择项目';
					}
				}
			}
			vm.$reloadData = function(p) {
				vm._loadInfo = '';
				vm._isLoading = true;
				var obj = (p && typeof p == 'object') ? p : {};
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
							vm.$buildKeys(p[vm.name]);
							vm.$trigger(dat.data, 'loaded');
						}else {
							vm._loadInfo = dat.rspmsg;
						}
						vm.$validValue();
						vm._isLoading = false;
					},
					error: function(dat) {
						vm._loadInfo = dat.status + '[' + dat.statusText + ']';
						vm._isLoading = false;
					}
				});
				vm.$validValue();
			}
			vm.$buildData = function(v) {
				if(vm.url != '') {
					var obj = {};
					obj[vm.name] = v;
					vm.$reloadData(obj);
				}else {
					vm.$buildKeys(v);
				}
			}
			vm.$bindFun = function() {
				if(vm._isShow == true) {
					vm._isShow = false;
				}
			}
			vm._selectOne = function(ev, val) {
				vm._needLoad = false;
				vm.$val = val;
				vm._text = vm.data[val].replace('<span>', '').replace('</span>', '');
				vm._isShow = false;
				vm.$trigger(ev, 'selected');
				vm.$validValue();
			}
			vm._clickInput = function(ev) {
				if(vm._text != '') {
					vm.$buildData(vm._text);
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._checkKeyDown = function(ev) {
				vm._needLoad = true;
			}
			vm.getData = function(typ) {
				var data = {};
				data[vm.name] = (typ ? vm.$val : vm._text);
				return data;
			}
			vm.getText = function() {
				return vm._text;
			}
			vm.getValue = function() {
				return vm.$val;
			}
			vm.$watch('_text', function(newVal, oldVal) {
				if(newVal != '' && vm._needLoad) {
					vm._isShow = true;
					vm.$buildData(newVal);
				}else {
					vm._isShow = false;
				}
			});
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm, elem) {
			vm.$validValue();
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:autocomplete"];
  widget.regionals = {};
})