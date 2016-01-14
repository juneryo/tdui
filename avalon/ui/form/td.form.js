define(['avalon', 'mmRequest', 'text!./td.form.html', 'css!./td.form.css'], function(avalon, req, template) {
	var _interface = function () {};
	avalon.component("td:form", {
		//外部标签属性
		title: '',
		buttons: true,  //是否显示submit、reset按钮
		border: false,
		horizontal: false,
		btnSize: 'normal',
		btnPos: 'left',
		submitMode: 'ajax',
		//外部配置参数
		submitUrl: '',
		loadUrl: '',
		loadParam: {},
		onoksubmited: null,
		onerrsubmited: null,
		onsubmited: null,
		onreseted: null,
		onloaded: null,
		onready: null,
		//slot
		content: '',
		//内部属性
		$oriData: {},
		//内部接口
		$trigger: _interface,
		$ajax: _interface,
		$checkValid: _interface,
		//view属性
		_isLoading: false,
		//view接口
		_doSubmit: _interface,
		_doReset: _interface,
		//对外方法
		getData: _interface,
		setData: _interface,
		submit: _interface,
		reset: _interface,
		reload: _interface,
		getElements: _interface,
		//默认配置
		$template: template,
		//hooks:定义component中的属性 vmOpts:引用component时的js配置$opt eleOpts:使用component时标签中的属性
		$construct: function (hooks, vmOpts, elemOpts) {
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
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
					case 'submited': 
						if(typeof vm.onsubmited == 'function') {
							vm.onsubmited(ev, vm);
						}
						break;
					case 'reseted': 
						if(typeof vm.onreseted == 'function') {
							vm.onreseted(ev, vm);
						}
						break;
					case 'ok':
						if(typeof vm.onoksubmited == 'function') {
							vm.onoksubmited(ev, vm);
						}
					case 'err':
						if(typeof vm.onerrsubmited == 'function') {
							vm.onerrsubmited(ev, vm);
						}
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm.$ajax = function(url, data, successCallback) {
				if(url != '') {
					vm._isLoading = true;
					req.ajax({
						type: 'POST',
						url: url,
						data: data,
						headers: {},
						success: function(d, status, xhr) {
							vm._isLoading = false;
							successCallback(d);
						},
						error: function(d) {
							vm._isLoading = false;
							vm.$trigger(d, 'err');
						}
					});
				}
			}
			vm.$checkValid = function() {
				var result = true;
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.isValid != undefined && comp.isValid === false) {
						result = false; break;
					}
				}
				return result;
			}
			vm._doSubmit = function(ev) {
				vm.$trigger(ev, 'submited');
				if(vm.$checkValid() && vm.submitUrl != '') {
					if(vm.submitMode=='ajax') {
						var dat = vm.getData();
						vm.$ajax(vm.submitUrl, dat, function(d) {
							vm.$oriData = dat;
							vm.$trigger(d, 'ok');
						});
					}else {
						elem.getElementsByTagName('form')[0].submit();
					}
				}
			}
			vm._doReset = function(ev) {
				vm.setData(vm.$oriData);
				vm.$trigger(ev, 'reseted');
			}
			vm.getData = function() {
				var data = {};
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.name != undefined && comp.getValue() != undefined) {
						data[comp.name] = comp.getValue();
					}
				}
				return data;
			}
			vm.setData = function(data) {
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.name != undefined && typeof comp.setValue == 'function') {
						comp.setValue(data[comp.name] == undefined ? '' : data[comp.name]);
					}
				}
				vm.$oriData = vm.getData();
			}
			vm.submit = function() {
				vm._doSubmit({});
			}
			vm.reset = function() {
				vm._doReset({});
			}
			vm.reload = function() {
				if(vm.loadUrl != '') {
					var p = {};
					for(var k in vm.loadParam) {
						if(vm.loadParam.hasOwnProperty(k)) {
							p[k] = vm.loadParam[k];
						}
					}
					vm.$ajax(vm.loadUrl, p, function(d) {
						if(d.rspcod == '200') {
							vm.setData(d.data);
						}
						vm.$trigger(d, 'loaded');
					});
				}
			}
			vm.getElements = function() {
				var arr = [];
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.name != undefined && typeof comp.setValue == 'function') {
						arr.push(comp);
					}
				}
				return arr;
			}
		},
		$ready: function (vm, elem) {
			vm.$oriData = vm.getData();
      vm.reload();
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:form"];
  widget.regionals = {};
})