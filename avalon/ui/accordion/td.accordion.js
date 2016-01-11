define(['avalon', 'text!./td.accordion.html', 'css!./td.accordion.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:accordion", {
		//外部标签属性
		active: 0,
		padding: 15,
		//外部配置参数
		panels: [],
		onchanged: null,
		//内部属性
		$isInit: true,
		$lastActive: 0,
		$bodys: [],
		$bodysH: [],
		//内部接口
		$trigger: _interface,
		$initUI: _interface,
		//view接口
		_renderContent: _interface,
		_clickPanel: _interface,
		//对外方法
		setActive: _interface,
		getActive: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			if(vmOpts.panels != undefined) {
				for(var i = 0; i < vmOpts.panels.length; i ++) {
					hooks['content' + i] = '';  //初始化slot标签页内容用属性
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
					default: break;
				}
			}
			vm.$initUI = function() {
				vm.$lastActive = vm.active;
				//计算高度用于伸缩动画效果
				var elems = TD.getElementsByClassName('panel-collapse', elem);
				for(var i = 0; i < elems.length; i ++) {
					var ele = elems[i];
					if(ele.parentNode.parentNode.parentNode == elem) {
						vm.$bodys.push(ele);
						if(vm.active == vm.$bodys.length - 1) {
							var h = TD.css.getSize(ele, 'height');
							ele.style.height = h + 'px';
							vm.$bodysH[vm.active] = h;
						}else {
							ele.style.height = '0px';
						}
					}
				}
				//计算高度用于伸缩动画效果END
				//if(typeof vm.panels[vm.active].fun == 'function') {
				//	vm.panels[vm.active].fun({}, vm);
				//}
				vm.$isInit = false;
			}
			vm._renderContent = function(idx) {
				return vm['content' + idx];
			}
			vm._clickPanel = function(ev, idx) {
				if(idx != vm.active) {
					vm.active = idx;
					//设置高度用于伸缩动画效果
					vm.$bodys[vm.$lastActive].style.height = '0px';
					if(vm.$bodysH[idx] == undefined || vm.$bodysH[idx] == 0) {
						vm.$bodysH[idx] = vm.$bodys[idx].scrollHeight;
					}
					vm.$bodys[idx].style.height = vm.$bodysH[idx] + 'px';
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
			}
		},
		$ready: function (vm, elem) {
			vm.$initUI();
    }
	});
	var widget = avalon.components["td:accordion"];
  widget.regionals = {};
});