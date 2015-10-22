define(['avalon', 'text!./td.navbar.html', 'css!./td.navbar.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:navbar", {
		//外部属性
		title: '',
		operation: '操作',
		href: 'javascript:void(0)',
		nomargin: false,
		//外部参数
		operations: [],      //自定义下拉操作列表
		buttons: [],
		ontitleclicked: null,
		//view参数
		showOperations: false,
		showButtons: false,
		//view接口
		toggleOperations: _interface,
		toggleButtons: _interface,
		doOperate: _interface,
		clickTitle: _interface,
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
			//内部方法
			vm._trigger = function(ev, type) {
				switch (type) {
					case 'titleclicked': 
						if(typeof vm.ontitleclicked == 'function') {
							vm.ontitleclicked(ev, vm);
						}
						break;
					default: break;
				}
			}
			//view接口
			vm.clickTitle = function(ev) {
				vm._trigger(ev, 'titleclicked');
			}
			//切换自定义操作面板
			vm.toggleOperations = function(ev) {
				vm.showOperations = !vm.showOperations;
				ev.cancelBubble = true;
			}
			//切换导航条
			vm.toggleButtons = function(ev) {
				vm.showButtons = !vm.showButtons;
				ev.cancelBubble = true;
			}
			//触发自定义操作
			vm.doOperate = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
			}
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:navbar"];
  widget.regionals = {};
});