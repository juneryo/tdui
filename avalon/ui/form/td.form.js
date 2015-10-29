define(['avalon', '../base/js/mmRequest', 'text!./td.form.html', 'css!./td.form.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:form", {
		//外部属性
		title: '',
		buttons: true,  //是否存在submit、reset按钮
		//外部参数
		submitUrl: '',
		loadUrl: '',
		loadParam: {},
		onoksubmited: null,
		onerrsubmited: null,
		onsubmited: null,
		onreseted: null,
		onloaded: null,
		//内部属性
		oriData: {},
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
							vm._trigger(d, 'err');
						}
					});
				}
			}
			vm._checkValid = function() {
				var result = true;
				for(k in vm.$refs) {
					var comp = vm.$refs[k];
					if(comp.isValid != undefined && comp.isValid === false) {
						result = false; break;
					}
				}
				return result;
			}
			vm.doSubmit = function(ev) {
				vm._trigger(ev, 'submited');
				if(vm._checkValid() && vm.submitUrl != '') {
					var dat = vm.getData();
					vm._ajax(vm.submitUrl, dat, function(d) {
						vm.oriData = dat;
						vm._trigger(d, 'ok');
					});
				}
			}
			vm.doReset = function(ev) {
				vm.setData(vm.oriData);
				vm._trigger(ev, 'reseted');
			}
			
			//对外方法
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
				vm.oriData = vm.getData();
			}
			vm.submit = function() {
				vm.doSubmit({});
			}
			vm.reset = function() {
				vm.doReset({});
			}
		},
		$ready: function (vm) {
			vm.oriData = vm.getData();
      if(vm.loadUrl != '') {
				vm._ajax(vm.loadUrl, vm.loadParam, function(d) {
					if(d.rspcod == '200') {
						vm.setData(d.data);
					}
					vm._trigger(d, 'loaded');
				});
			}
    }
	});
	
	var widget = avalon.components["td:form"];
  widget.regionals = {};
})