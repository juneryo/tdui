define(['avalon', 'text!./td.navbar.html', 'css!./td.navbar.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:navbar", {
		//外部标签属性
		title: '',
		operation: '操作',
		href: 'javascript:void(0)',
		form: false,
		margin: 20,
		padding: 0,
		//外部配置参数
		operations: [],  //自定义下拉操作列表
		buttons: [],
		ontitleclicked: null,
		onsubmited: null,
		//内部接口
		$trigger: _interface,
		$bindFun: _interface,
		//view参数
		_showOperations: false,
		_showButtons: false,
		//view接口
		_toggleOperations: _interface,
		_toggleButtons: _interface,
		_doOperate: _interface,
		_doSubmit: _interface,
		_clickTitle: _interface,
		_clickInput: _interface,
		_clickBtn: _interface,
		//对外方法
		setTitle: _interface,
		getTitle: _interface,
		setOperation: _interface,
		getOperation: _interface,
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
			vm.$trigger = function(ev, type) {
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
			vm.$bindFun = function() {
				if(vm._showOperations == true) {
					vm._showOperations = false;
				}else if(vm._showButtons == true) {
					vm._showButtons = false;
				}
			}
			vm._clickTitle = function(ev) {
				vm.$trigger(ev, 'titleclicked');
			}
			vm._doSubmit = function(ev) {
				if(ev.keyCode==13) {
					vm.$trigger(ev, 'submited');
				}
			}
			vm._clickInput = function(ev) {
				vm._showOperations = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._clickBtn = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm._showOperations = false;
				ev.cancelBubble = true;
			}
			vm._toggleOperations = function(ev) {
				vm._showOperations = !vm._showOperations;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._toggleButtons = function(ev) {
				vm._showButtons = !vm._showButtons;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._doOperate = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm._showOperations = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
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
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm) {}
	});
	var widget = avalon.components["td:navbar"];
  widget.regionals = {};
});