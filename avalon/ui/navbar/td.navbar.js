define(['avalon', 'text!./td.navbar.html', 'css!./td.navbar.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:navbar", {
		//外部属性
		title: '',
		operation: '操作',
		href: 'javascript:void(0)',
		form: false,
		margin: 20,
		padding: 0,
		//外部参数
		operations: [],      //自定义下拉操作列表
		buttons: [],
		ontitleclicked: null,
		onsubmited: null,
		//内部属性
		_bindFun: null,
		//view参数
		showOperations: false,
		showButtons: false,
		//view接口
		toggleOperations: _interface,
		toggleButtons: _interface,
		doOperate: _interface,
		doSubmit: _interface,
		clickTitle: _interface,
		clickInput: _interface,
		clickBtn: _interface,
		_trigger: _interface,
		setTitle: _interface,
		getTitle: _interface,
		setOperation: _interface,
		getOperation: _interface,
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
			//内部方法
			vm._trigger = function(ev, type) {
				switch (type) {
					case 'titleclicked': 
						if(typeof vm.ontitleclicked == 'function') {
							vm.ontitleclicked(ev, vm);
						}
						break;
					case 'submited': 
						if(typeof vm.onsubmited == 'function') {
							vm.onsubmited(ev, vm);
						}
						break;
					default: break;
				}
			}
			//view接口
			vm.clickTitle = function(ev) {
				vm._trigger(ev, 'titleclicked');
			}
			vm.doSubmit = function(ev) {
				if(ev.keyCode==13) {
					vm._trigger(ev, 'submited');
				}
			}
			vm.clickInput = function(ev) {
				vm.showOperations = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.clickBtn = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.showOperations = false;
				ev.cancelBubble = true;
			}
			//切换自定义操作面板
			vm.toggleOperations = function(ev) {
				vm.showOperations = !vm.showOperations;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.toggleButtons = function(ev) {
				vm.showButtons = !vm.showButtons;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			//触发自定义操作
			vm.doOperate = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.showOperations = false;
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
			vm.setOperation = function(oper) {
				vm.operation = oper;
			}
			vm.getOperation = function() {
				return vm.operation;
			}
			//绑定事件
			vm._bindFun = function() {
				if(vm.showOperations == true) {
					vm.showOperations = false;
				}else if(vm.showButtons == true) {
					vm.showButtons = false;
				}
			}
			avalon.bind(document, 'click', vm._bindFun, false);
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:navbar"];
  widget.regionals = {};
});