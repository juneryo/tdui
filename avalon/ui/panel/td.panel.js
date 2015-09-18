define(['avalon', 'text!./td.panel.html', 'css!./td.panel.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:panel", {
		//外部参数
		title: '',
		//view接口
		//slot
		content: '',
		footer: '',
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options; //返回VM的定义对象
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			avalon.log(vm.footer)
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:panel"];
  widget.regionals = {};
});