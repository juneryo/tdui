define(['avalon', 'text!./td.button.html'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:button", {
		//外部标签属性
		value: '',
		badge: '',
		type: 'default',  //default, primary, success, info, warning, danger
		size: 'normal',   //large, mormal, small, xsmall
		pull: '',
		disabled: false,
		isAction: false,
		onclicked: null,
		actions: [],
		//内部接口
		$bindFun: _interface,
		//view接口
		_toggleAction: _interface,
		_doClick: _interface,
		_doAction: _interface,
		//对外方法
		click: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm.$bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$bindFun = function() {
				if(vm.isAction == true) {
					vm.isAction = false;
				}
			}
			vm._toggleAction = function(ev) {
				if(vm.disabled === false) {
					vm.isAction = !vm.isAction;
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._doClick = function(ev) {
				if(typeof vm.onclicked == 'function' && vm.disabled === false) {
					vm.onclicked(ev, vm);
				}
				vm.isAction = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._doAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.isAction = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.click = function() {
				if(vm.disabled === false) {
					elem.getElementsByTagName('a')[0].click();
				}
			}
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm) {}
	});
	var widget = avalon.components["td:button"];
  widget.regionals = {};
});