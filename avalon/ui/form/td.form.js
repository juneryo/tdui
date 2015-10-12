define(['avalon', 'text!./td.form.html', 'css!./td.form.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:form", {
		//外部属性
		title: '',
		//外部参数

		
		//view属性

		//view接口
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
			
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:form"];
  widget.regionals = {};
})