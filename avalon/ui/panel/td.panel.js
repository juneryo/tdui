define(['avalon', 'text!./td.panel.html', 'css!./td.panel.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:panel", {
		//外部标签属性
		title: '',
		//外部配置参数
		buttons: [],
		//slot
		content: '',
		footer: '',
		//view属性
		_showButtons: false,
		//view接口
		_btnClick: _interface,
		_toggleButtons: _interface,
		//对外方法
		setTitle: _interface,
		getTitle: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm._btnClick = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
			}
			vm._toggleButtons = function(ev) {
				vm._showButtons = !vm._showButtons;
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
		$ready: function (vm) {}
	});
	var widget = avalon.components["td:panel"];
  widget.regionals = {};
});