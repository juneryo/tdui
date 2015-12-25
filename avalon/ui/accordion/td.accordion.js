define(['avalon', 'text!./td.accordion.html', 'css!./td.accordion.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:accordion", {
		//外部属性
		active: 0,
		padding: 15,
		//外部参数
		panels: [],
		onchanged: null,
		//内部属性
		isInit: true,
		//view接口
		renderContent: _interface,
		clickPanel: _interface,
		_trigger: _interface,
		setActive: _interface,
		getActive: _interface,
		
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			if(vmOpts.panels != undefined) {
				//初始化slot标签页内容用属性
				for(var i=0; i<vmOpts.panels.length; i++) {
					hooks['content' + i] = '';
				}
			}
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
					case 'changed': 
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					default: break;
				}
			}
			//接口方法
			vm.renderContent = function(idx) {
				return vm['content' + idx];
			}
			vm.clickPanel = function(ev, idx) {
				if(idx != vm.active) {
					vm.active = idx;
				}
			}
			//对外方法
			vm.setActive = function(idx) {
				vm.active = idx;
			}
			vm.getActive = function() {
				return vm.active;
			}
			//观测方法
			vm.$watch('active', function(newVal, oldVal) {
				vm._trigger({newVal: newVal, oldVal: oldVal}, 'changed');
				if(typeof vm.panels[newVal].fun == 'function') {
					vm.panels[newVal].fun({newVal: newVal, oldVal: oldVal}, vm);
				}
			});
		},
		$ready: function (vm) {
      vm.isInit = false;
			if(typeof vm.panels[vm.active].fun == 'function') {
				vm.panels[vm.active].fun({}, vm);
			}
    }
	});

	var widget = avalon.components["td:accordion"];
  widget.regionals = {};
});