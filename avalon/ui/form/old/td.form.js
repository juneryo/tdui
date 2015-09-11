define(["avalon", "text!./td.form.html", "css!./td.form.css"], function(avalon, template) {
	var widget = avalon.ui.form = function(element, data, vmodels) {
		var options = data.formOptions;  //必须为UI名+Options(form + Options)
		options.template = options.getTemplate(template, options);
		var vm = avalon.define({
			initId: new Date().getTime(),
			$id: data.formId,        //必须为UI名+Id(form + Id)
			$inited: false,
			_eles: options.eles,     //form元素
			activeEleIdx: -1,
			//表单元素获取焦点时的操作
			eleFocus: function(idx, name) {
				vm.activeEleIdx = idx;
			},
			eleBlur: function(idx, name) {
				vm.activeEleIdx = -1;
			},
			$init: function(continueScan) {
				if (vm.$inited) return;
				vm.$inited = true;
				var pageHTML = options.template;
				element.style.display = "none";
				element.innerHTML = pageHTML;
				element.style.display = "block";
				if(continueScan){
					continueScan();
				}else{
					avalon.scan(element, _vmodels)
					if (typeof options.onInit === "function") {
							options.onInit.call(element, vmodel, options, vmodels)
					}
				}
			},
			$remove: function() {
				element.innerHTML = element.textContent = ""
			}
		});
		return vm;
	}
	
	widget.vertion = 0.1;
	widget.defaults = {
		eles: [],
		onInit: avalon.noop, //@optMethod onInit(vmodel, options, vmodels) 完成初始化之后的回调,call as element's method
		getTemplate: function(tmpl, opts, tplName) {
			return tmpl;
		}, //@optMethod getTemplate(tpl, opts, tplName) 定制修改模板接口
		$author: 'yu_jun@tangdi.net'
	}
});