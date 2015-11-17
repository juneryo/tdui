define(['avalon', 'mmRequest', 'text!./td.tree.html', 'css!./td.tree.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:tree", {
		//外部属性
		root: true,
		checkbox: false,
		//外部参数
		url: '',
		param: {},
		data: [],
		onloaded: null,
		onclicked: null,
		onchecked: null,
		onexpanded: null,
		oncollapsed: null,
		//内部属性
		tmpid: '',		
		isInit: true,
		//view属性
		isLoading: false,
		loadInfo: '',
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
					default: break;
				}
			}
			vm._ajax = function() {
				vm.isLoading = true;
				vm.loadInfo = '数据加载中...';
				req.ajax({
					type: 'POST',
					url: vm.url,
					data: vm.param,
					headers: {},
					success: function(data, status, xhr) {
						if(data.rspcod == '200') {
							vm.loadInfo = '';
							vm.data.pushArray(data.data);
						}else {
							vm.loadInfo = data.rspmsg;
						}
						vm.isLoading = false;
						vm._trigger(data, 'loaded');
					},
					error: function(data) {
						vm.loadInfo = data.status + '[' + data.statusText + ']';
						vm.isLoading = false;
					}
				});
			}
			vm._getSelected = function(dat) {
				var val = '';
				for(var i = 0; i < dat.size(); i ++) {
					if(dat[i].checked === true || dat[i].checked === 'true') {
						val += (dat[i].id + ',');
					}
					if(dat[i].children != undefined && dat[i].children.length > 0) {
						val += vm._getSelected(dat[i].children);
					}
				}
				return val;
			}
			vm._setCheckbox = function(el, checked) {
				//通过递归方式处理子checkbox	
				if(el.disabled === false || el.disabled === 'false') {
					el.checked = checked;
					if(el.children != undefined && el.children.length > 0) {
						for(var i = 0; i < el.children.length; i ++) {
							vm._setCheckbox(el.children[i], checked);
						}
					}
				}
			}
			//接口方法
			vm.clickNode = function(ev, idx, el, type) {
				switch(type) {
					case 'oper':
						if(el.children != undefined && el.children.length > 0) {
							if(el.expand ===true || el.expand==='true') {
								el.expand = false;
								vm._trigger(el, 'collapsed')
							}else {
								el.expand = true;
								vm._trigger(el, 'expanded')
							}
						}
						break;
					case 'checkbox':
						vm._setCheckbox(el, (el.checked===true||el.checked==='true'?false:true));
						if(el.checked === true || el.checked === 'true') {
							vm._trigger(el, 'checked');
						}
						break;
					case 'node':
						if(el.disabled === false || el.disabled === 'false') {
							vm._trigger(el, 'clicked');
						}
						break;
					default:
						break;
				}
			}
			vm.clickParent = function(ev, idx, el) {
				if(el.disabled === true || el.disabled === 'true') {
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
			//对外方法
			vm.getChecked = function() {
				var val = '';
				if(vm.checkbox === true) {
					val = vm._getSelected(vm.data);
					val = val.substring(0, val.length - 1);
				}
				return val;
			}
			vm.reloadData = function() {
				if(vm.url != '') {
					vm._ajax();
				}
			}
			//观测方法
		},
		$ready: function (vm) {
			if(vm.url != '') {
				vm._ajax();
			}
      vm.isInit = false;
    }
	});
	
	var widget = avalon.components["td:tree"];
  widget.regionals = {};
});