define(['avalon', 'text!./td.dialog.html', 'css!./td.dialog.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:dialog", {
		//外部属性
		title: '',
		size: 'normal',  //large, small
		padding: 15,
		show: false,
		//外部参数
		buttons: [],
		onshowed: null,
		onhided: null,
		//view接口
		btnClick: _interface,
		clickDialog: _interface,
		hideDialog: _interface,
		_trigger: _interface,
		setTitle: _interface,
		getTitle: _interface,
		showDialog: _interface,
		hideDialog: _interface,
		//slot
		content: '',
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
					case 'showed': 
						if(typeof vm.onshowed == 'function') {
							vm.onshowed(ev, vm);
						}
						break;
					case 'hided': 
						if(typeof vm.onhided == 'function') {
							vm.onhided(ev, vm);
						}
						break;
					default: break;
				}
			}
			//接口方法
			vm.btnClick = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
			}
			vm.clickDialog = function(ev) {
				//阻止冒泡(避免点击弹出框时 弹出框关闭)
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
			vm.showDialog = function() {
				vm.show = true;
				vm._trigger({}, 'showed');
			}
			vm.hideDialog = function() {
				vm.show = false;
				vm._trigger({}, 'hided');
			}
		},
		$ready: function (vm) {
      
    }
	});
	
	var widget = avalon.components["td:dialog"];
  widget.regionals = {};
});