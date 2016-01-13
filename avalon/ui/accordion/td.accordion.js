define(['avalon', 'text!./td.accordion.html', 'css!./td.accordion.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:accordion", {
		//外部标签属性
		active: 0,
		padding: 15,
		height: '',
		//外部配置参数
		panels: [],
		onchanged: null,
		onready: null,
		//内部属性
		$isInit: true,
		$lastActive: 0,
		$oneHeight: '',
		$bodys: [],
		//内部接口
		$trigger: _interface,
		$initBodys: _interface,
		//view属性
		_bodysH: [],
		//view接口
		_renderContent: _interface,
		_clickPanel: _interface,
		//对外方法
		setActive: _interface,
		getActive: _interface,
		setHeight: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			if(vmOpts.panels != undefined) {
				for(var i = 0; i < vmOpts.panels.length; i ++) {
					hooks['content' + i] = '';  //初始化slot标签页内容用属性
					hooks['_bodysH'].push('');
				}
			}
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
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
			vm.$initBodys = function() {
				var elems = TD.getElementsByClassName('panel-collapse', elem);
				for(var i = 0; i < elems.length; i ++) {
					var ele = elems[i];
					if(ele.parentNode.parentNode.parentNode == elem) {
						vm.$bodys.push(ele);
					}
				}
			}
			vm._renderContent = function(idx) {
				return vm['content' + idx];
			}
			vm._clickPanel = function(ev, idx) {
				if(idx != vm.active) {
					vm.active = idx;
					//设置高度用于伸缩动画效果
					vm._bodysH.set(vm.$lastActive, 0);
					if(vm._bodysH[idx] == undefined || vm._bodysH[idx] == 0) {
						vm._bodysH.set(idx, (vm.$oneHeight == '' ? vm.$bodys[idx].scrollHeight : vm.$oneHeight));
					}
					//设置,获取高度用于伸缩动画效果END
					vm.$lastActive = idx;
				}
			}
			vm.$watch('active', function(newVal, oldVal) {
				vm.$trigger({newVal: newVal, oldVal: oldVal}, 'changed');
				if(typeof vm.panels[newVal].fun == 'function') {
					vm.panels[newVal].fun({newVal: newVal, oldVal: oldVal}, vm);
				}
			});
			vm.setActive = function(idx) {
				vm.active = idx;
			}
			vm.getActive = function() {
				return vm.active;
			},
			vm.setHeight = function(hei) {
				if(hei) {
					vm.height = parseFloat(hei);
					vm.$oneHeight = vm.height - vm.panels.size() * 38;  //38为head高度
				}
				for(var i =0; i < vm.$bodys.length; i ++) {
					if(i == vm.active) {
						var h = (vm.$oneHeight == '' ? TD.css.getSize(vm.$bodys[i], 'height') : vm.$oneHeight);
						vm._bodysH.set(i, h);
					}else {
						vm._bodysH.set(i, 0);
					}
				}
			}
		},
		$ready: function (vm, elem) {
			vm.$initBodys();
			vm.$lastActive = vm.active;
			vm.setHeight(vm.height);
			vm.$isInit = false;
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:accordion"];
  widget.regionals = {};
});