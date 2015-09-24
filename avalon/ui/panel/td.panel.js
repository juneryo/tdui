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
			vm.setTitle = function(title) {
				vm.title = title;
			}
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:panel"];
  widget.regionals = {};
});