define(['avalon', 'mmRequest', 'text!./td.tree.html', 'css!./td.tree.css'], function(avalon, req, template) {
	var _interface = function () {};
	avalon.component("td:tree", {
		//外部标签属性
		root: true,
		checkbox: false,
		//外部配置参数
		url: '',
		param: {},
		data: [],
		onloaded: null,
		onclicked: null,
		onchecked: null,
		onexpanded: null,
		oncollapsed: null,
		onready: null,
		//内部属性
		$isInit: true,
		//内部接口
		$trigger: _interface,
		$ajax: _interface,
		$getSelected: _interface,
		$setCheckbox: _interface,
		//view属性
		_isLoading: false,
		_loadInfo: '',
		//view接口
		_clickNode: _interface,
		_clickParent: _interface,
		//对外方法
		getChecked: _interface,
		reloadData: _interface,
		setData: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
				switch (type) {
					case 'loaded':
						if(typeof vm.onloaded == 'function') {
							vm.onloaded(ev, vm);
						}
						break;
					case 'clicked': 
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
						}
						break;
					case 'checked': 
						if(typeof vm.onchecked == 'function') {
							vm.onchecked(ev, vm);
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
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm.$ajax = function() {
				vm._isLoading = true;
				vm._loadInfo = '数据加载中...';
				var p = {};
				for(var k in vm.param) {
					if(vm.param.hasOwnProperty(k)) {
						p[k] = vm.param[k];
					}
				}
				req.ajax({
					type: 'POST',
					url: vm.url,
					data: p,
					headers: {},
					success: function(data, status, xhr) {
						if(data.rspcod == '200') {
							vm._loadInfo = '';
							vm.data.pushArray(data.data);
						}else {
							vm._loadInfo = data.rspmsg;
						}
						vm._isLoading = false;
						vm.$trigger(data, 'loaded');
					},
					error: function(data) {
						vm._loadInfo = data.status + '[' + data.statusText + ']';
						vm._isLoading = false;
					}
				});
			}
			vm.$getSelected = function(dat) {
				var val = '';
				for(var i = 0; i < dat.size(); i ++) {
					if(dat[i].checked === true || dat[i].checked === 'true') {
						val += (dat[i].id + ',');
					}
					if(dat[i].children != undefined && dat[i].children.length > 0) {
						val += vm.$getSelected(dat[i].children);
					}
				}
				return val;
			}
			vm.$setCheckbox = function(el, checked) {
				//通过递归方式处理子checkbox	
				if(el.disabled === false || el.disabled === 'false') {
					el.checked = checked;
					if(el.children != undefined && el.children.length > 0) {
						for(var i = 0; i < el.children.length; i ++) {
							vm.$setCheckbox(el.children[i], checked);
						}
					}
				}
			}
			vm._clickNode = function(ev, idx, el, type) {
				switch(type) {
					case 'oper':
						if(el.children != undefined && el.children.length > 0) {
							if(el.expand ===true || el.expand==='true') {
								el.expand = false;
								vm.$trigger(el, 'collapsed')
							}else {
								el.expand = true;
								vm.$trigger(el, 'expanded')
							}
						}
						break;
					case 'checkbox':
						vm.$setCheckbox(el, (el.checked===true||el.checked==='true'?false:true));
						if(el.checked === true || el.checked === 'true') {
							vm.$trigger(el, 'checked');
						}
						break;
					case 'node':
						if(el.disabled === false || el.disabled === 'false') {
							vm.$trigger(el, 'clicked');
						}
						break;
					default:
						break;
				}
			}
			vm._clickParent = function(ev, idx, el) {
				if(el.disabled === true || el.disabled === 'true') {
					ev.stopPropagation();
					ev.cancelBubble = true;
				}else {
					//通过冒泡方式处理父级checkbox
					if(vm.checkbox === true && el.children != undefined && el.children.length > 0) {
						var flag = false;
						for(var i = 0; i < el.children.length; i ++) {
							if(el.children[i].checked === true || el.children[i].checked === 'true') {
								flag = true; break;
							}
						}
						el.checked = flag;
					}
				}
			}
			vm.getChecked = function() {
				var val = '';
				if(vm.checkbox === true) {
					val = vm.$getSelected(vm.data);
					val = val.substring(0, val.length - 1);
				}
				return val;
			}
			vm.reloadData = function() {
				if(vm.url != '') {
					vm.$ajax();
				}
			}
			vm.setData = function(dat) {
				vm.data.removeAll();
				vm.data.pushArray(dat);
			}
		},
		$ready: function (vm, elem) {
			if(vm.url != '') {
				vm.$ajax();
			}
      vm.$isInit = false;
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:tree"];
  widget.regionals = {};
});