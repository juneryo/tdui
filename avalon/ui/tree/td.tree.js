define(['avalon', 'text!./td.tree.html', 'css!./td.tree.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:tree", {
		//外部属性
		active: '',
		checkbox: false,
		//外部参数
		data: [],
		onclicked: null,
		onexpanded: null,
		oncollapsed: null,
		//内部属性
		tmpid: '',
		isInit: true,
		//view接口
		clickNode: _interface,
		clickParent: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			hooks.tmpid = TD.util.genId('TREE');
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
					case 'clicked': 
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
						}
						break;
					case 'expanded': 
						if(typeof vm.onexpanded == 'function') {
							vm.onexpanded(ev, vm);
						}
						break;
					case 'collapsed':
						if(typeof vm.oncollapsed == 'function') {
							vm.oncollapsed(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm._setCheckbox = function(el, checked) {
				//通过递归方式处理子checkbox
				el.checked = checked;
				if(el.children != undefined && el.children.length > 0) {
					for(var i = 0; i < el.children.length; i ++) {
						vm._setCheckbox(el.children[i], checked);
					}
				}
			}
			//接口方法
			vm.clickNode = function(ev, idx, el, type) {
				switch(type) {
					case 'oper':
						if(el.children != undefined && el.children.length > 0) {
							el.expand = !el.expand;
							el.expand ? vm._trigger(el, 'expanded') : vm._trigger(el, 'collapsed');
						}
						break;
					case 'checkbox':
						vm._setCheckbox(el, !el.checked);
						break;
					case 'node':
						vm._trigger(el, 'clicked');
						break;
					default:
						break;
				}
			}
			vm.clickParent = function(ev, idx, el) {
				//通过冒泡方式处理父级checkbox
				if(vm.checkbox === true && el.children != undefined && el.children.length > 0) {
					var allChecked = true;
					for(var i = 0; i < el.children.length; i ++) {
						if(el.children[i].checked !== true) {
							allChecked = false; 
							break;
						}
					}
					el.checked = allChecked;
				}
			}
			//对外方法
			
			//观测方法
			
		},
		$ready: function (vm) {
      vm.isInit = false;
    }
	});
	
	var widget = avalon.components["td:tree"];
  widget.regionals = {};
});