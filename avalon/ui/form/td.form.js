define(['avalon', '../base/js/mmRequest', 'text!./td.form.html', 'css!./td.form.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:form", {
		//外部属性
		title: '',
		url: '',
		submit: true,  //是否存在submit按钮
		reset: true,   //是否存在reset按钮
		//外部参数
		submitCallback: null,
		resetCallback: null,
		errorCallback: null,
		//view属性

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
		$textpose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			
			vm.doSubmit = function(ev) {
				if(vm.url != '') {
					req.ajax({
						type: 'POST',
						url: vm.url,
						data: vm.getData(),
						headers: {},
						success: function(data, status, xhr) {
							if(vm.submit === true && typeof vm.submitCallback == 'function') {
								vm.submitCallback(ev, vm);
							}
						},
						error: function(data) {
							if(typeof vm.errorCallback == 'function') {
								vm.errorCallback(ev, vm, data);
							}
						}
					});
				}
			}
			
			vm.doReset = function(ev) {
				if(vm.reset===true && typeof vm.resetCallback == 'function') {
					vm.resetCallback(ev, vm);
				}
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
      
    }
	});
	
	var widget = avalon.components["td:form"];
  widget.regionals = {};
})