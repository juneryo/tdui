define(['avalon', 'text!./td.tab.html', 'css!./td.tab.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:tab", {
		//外部标签属性
		active: 0,
		padding: 15,
		anime: 'normal',  //cool
		//外部配置参数
		tabs: [],
		onchanged: null,
		onready: null,
		//内部属性
		$isInit: true,
		//内部接口
		$trigger: _interface,
		//view接口
		_renderContent: _interface,
		_clickTab: _interface,
		//对外方法
		setActive: _interface,
		getActive: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			if(vmOpts.tabs != undefined) {
				for(var i = 0; i < vmOpts.tabs.length; i ++) {
					hooks['content' + i] = ''; //初始化slot标签页内容用属性
				}
			}
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
				switch (type) {
					case 'changed': 
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm._renderContent = function(idx) {
				return vm['content' + idx];
			}
			vm._clickTab = function(ev, idx) {
				if(idx != vm.active) {
					vm.active = idx;
				}
			}
			vm.$watch('active', function(newVal, oldVal) {
				vm.$trigger({newVal: newVal, oldVal: oldVal}, 'changed');
				if(typeof vm.tabs[newVal].fun == 'function') {
					vm.tabs[newVal].fun({newVal: newVal, oldVal: oldVal}, vm);
				}
			});
			//对外方法
			vm.setActive = function(idx) {
				vm.active = idx;
			}
			vm.getActive = function() {
				return vm.active;
			}
		},
		$ready: function(vm, elem) {
      vm.$isInit = false;
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:tab"];
  widget.regionals = {};
});