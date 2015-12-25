define(['avalon', 'text!./td.button.html'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:button", {
		//外部参数
		value: '',
		badge: '',
		type: 'default',  //default, primary, success, info, warning, danger
		size: 'normal',   //large, mormal, small, xsmall
		pull: '',
		disabled: false,
		isAction: false,
		onclicked: null,
		actions: [],
		//内部属性
		_bindFun: null,
		//view接口
		toggleAction: _interface,
		doClick: _interface,
		doAction: _interface,
		click: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options; //返回VM的定义对象
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm._bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.toggleAction = function(ev) {
				if(vm.disabled === false) {
					vm.isAction = !vm.isAction;
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.doClick = function(ev) {
				if(typeof vm.onclicked == 'function' && vm.disabled === false) {
					vm.onclicked(ev, vm);
				}
				vm.isAction = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.doAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.isAction = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			//对外方法
			vm.click = function() {
				if(vm.disabled === false) {
					elem.getElementsByTagName('a')[0].click();
				}
			}
			//绑定事件
			vm._bindFun = function() {
				if(vm.isAction == true) {
					vm.isAction = false;
				}
			}
			avalon.bind(document, 'click', vm._bindFun, false);
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:button"];
  widget.regionals = {};
});