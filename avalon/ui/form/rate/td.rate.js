define(['avalon', 'text!./td.rate.html', 'css!./td.rate.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:rate", {
		//外部标签属性
		label: '',
		name: 'rate',
		num: 5,       //星星默认个数
		value: 0,
		half: false,  //是否允许半个星星
		disabled: false,
		//外部配置参数
		onclicked: null,
		onchanged: null,
		//内部接口
		$trigger: _interface,
		$setRate: _interface,
		//view属性
		_stars: [],
		//view接口
		_clickRate: _interface,
		//对外方法
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			//根据外部参数num, half及default 调整内部监控对象stars
			var starsNum = elemOpts.num > 0 ? elemOpts.num : hooks.num;
			var defaultNum = elemOpts.value > 0 ? elemOpts.value : 0;
			for(var i = 0; i < starsNum; i ++) {
				if((i + 0.5) < defaultNum) {
					hooks._stars.push(2);
				}else if((i + 0.5) == defaultNum) {
					hooks._stars.push(elemOpts.half ? 1 : 2);
				}else {
					hooks._stars.push(0);
				}
				hooks.value = defaultNum;
			}
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
					case 'clicked':
						if(typeof vm.onclicked == 'function') {
							vm.onclicked(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm.$setRate = function(idx) {
				var val = 2;
				for(var i = 0; i < vm.num; i ++) {
					if(i == idx) {
						if(vm._stars[idx] == 0) {
							val = vm.half ? 1 : 2; 
						}else if(vm._stars[idx] == 2) {
							val = 0;
						}
						vm._stars.set(i, val);
					}else if(i > idx) {
						vm._stars.set(i, 0);
					}else {
						vm._stars.set(i, (i + 0.5 == idx) ? 1 : 2);
					}
				}
				return val;
			}
			vm._clickRate = function(ev, idx) {
				var val = vm.$setRate(idx);
				vm.value = idx + (val > 0 ? (val == 1 ? 0.5 : 1) : 0);
				if(!vm.disabled) {
					vm.$trigger(ev, 'clicked');  //click时肯定会变
					vm.$trigger(ev, 'changed');
				}
			}
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.value;
				return data;
			}
			vm.getValue = function() {
				return vm.value;
			}
			vm.setValue = function(val) {
				vm.$setRate(val);
				var changed = !(val == vm.value);
				vm.value = val;
				if(changed) {
					vm.$trigger(null, 'changed');
				}
			}
		},
		$ready: function (vm) {}
	});
	var widget = avalon.components["td:rate"];
	widget.regionals = {};
})