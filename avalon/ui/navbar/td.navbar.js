define(['avalon', 'text!./td.navbar.html', 'css!./td.navbar.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:navbar", {
		//外部参数
		title: '',
		operations: [],      //自定义下拉操作列表
		buttons: [],
		isOperate: false,
		isNav: false,
		//view接口
		toggleOperate: _interface,
		toggleNav: _interface,
		doOperate: _interface,
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
			//切换自定义操作面板
			vm.toggleOperate = function(ev) {
				vm.isOperate = !vm.isOperate;
				ev.cancelBubble = true;
			}
			//切换导航条
			vm.toggleNav = function(ev) {
				vm.isNav = !vm.isNav;
				ev.cancelBubble = true;
			}
			//触发自定义操作
			vm.doOperate = function(ev, fun) {
				fun(ev, vm);
			}
		},
		$ready: function (vm) {
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:navbar"];
  widget.regionals = {};
});