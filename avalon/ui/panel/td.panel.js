define(['avalon', 'text!./td.panel.html', 'css!./td.panel.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:panel", {
		//外部属性
		title: '',
		//外部参数
		buttons: [],
		//view参数
		showButtons: false,
		//view接口
		btnClick: _interface,
		toggleButtons: _interface,
		setTitle: _interface,
		getTitle: _interface,
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
			//接口方法
			vm.btnClick = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
			}
			//切换导航条
			vm.toggleButtons = function(ev) {
				vm.showButtons = !vm.showButtons;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			//对外方法
			vm.setTitle = function(title) {
				vm.title = title;
			}
			vm.getTitle = function() {
				return vm.title;
			}
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:panel"];
  widget.regionals = {};
});