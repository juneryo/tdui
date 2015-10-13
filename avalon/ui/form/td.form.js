define(['avalon', '../base/js/mmRequest', 'text!./td.form.html', 'css!./td.form.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:form", {
		//外部属性
		title: '',
		submitUrl: '',
		loadUrl: '',
		loadParam: {},
		submit: true,  //是否存在submit按钮
		reset: true,   //是否存在reset按钮
		//外部参数
		submitCallback: null,
		resetCallback: null,
		errorCallback: null,
		onloaded: null,
		//view属性
		isLoading: false,
		//view接口
		doSubmit: _interface,
		doReset: _interface,
		//slot
		content: '',
		
		$template: template,
		// hooks : 定义component中的属性
		//vmOpts : 引用component时的js配置$opt 
		//eleOpts: 使用component时标签中的属性
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
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
					default: break;
				}
			}
			vm._callback = function(ev, type, data) {
				switch (type) {
					case 'submit': 
						if(vm.submit === true && typeof vm.submitCallback == 'function') {
							vm.submitCallback(ev, vm);
						}
						break;
					case 'reset':
						if(vm.reset===true && typeof vm.resetCallback == 'function') {
							vm.resetCallback(ev, vm);
						}
						break;
					case 'error':
						if(typeof vm.errorCallback == 'function') {
							vm.errorCallback(ev, vm, data);
						}
						break;
					default: break;
				}
			}
			vm._ajax = function(url, data, successCallback) {
				if(url != '') {
					vm.isLoading = true;
					req.ajax({
						type: 'POST',
						url: url,
						data: data,
						headers: {},
						success: function(d, status, xhr) {
							vm.isLoading = false;
							successCallback(d);
						},
						error: function(d) {
							vm.isLoading = false;
							vm._callback(ev, 'error', d);
						}
					});
				}
			}
			
			vm.doSubmit = function(ev) {
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.isValid != undefined && comp.isValid === false) {
						return;
					}
				}
				if(vm.submitUrl != '') {
					vm._ajax(vm.submitUrl, vm.getData(), function(d) {
						vm._callback(ev, 'submit', d);
					});
				}else {
					vm._callback(ev, 'submit', null);
				}
			}
			vm.doReset = function(ev) {
				vm._callback(ev, 'reset', null);
			}
			
			//对外方法
			vm.getData = function() {
				var data = {};
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.name != undefined && comp.value != undefined) {
						data[comp.name] = comp.value;
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
			}
		},
		$ready: function (vm) {
      if(vm.loadUrl != '') {
				vm._ajax(vm.loadUrl, vm.loadParam, function(d) {
					if(d.rspcod == '200') {
						vm.setData(d.data);
					}else {
						alert('数据加载失败');
					}
					vm._trigger(d, 'loaded');
				});
			}
    }
	});
	
	var widget = avalon.components["td:form"];
  widget.regionals = {};
})