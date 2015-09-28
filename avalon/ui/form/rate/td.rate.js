define(['avalon', 'text!./td.rate.html', 'css!./td.rate.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:rate", {
		//外部属性
		label: '',
		name: 'rate',
		num: 5,       //星星默认个数
		default: 0,   //星星默认选中个数
		value: 0,
		half: false,  //是否允许半个星星
		disabled: false,
		//外部属性
		onclicked: null,
		
		//view属性
		stars: [],
		tmpStars: [],
		//view接口
		clickRate: _interface,
		mouseInRate: _interface,
		mouseOutRate: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			//根据外部参数num, half及default 调整内部监控对象stars
			var starsNum = elemOpts.num > 0 ? elemOpts.num : hooks.num;
			var defaultNum = elemOpts.default > 0 ? elemOpts.default : 0;
			for(var i = 0; i < starsNum; i ++) {
				if((i + 0.5) < defaultNum) {
					hooks.stars.push(2);
					hooks.tmpStars.push(2);
				}else if((i + 0.5) == defaultNum) {
					hooks.stars.push(elemOpts.half ? 1 : 2);
					hooks.tmpStars.push(elemOpts.half ? 1 : 2);
				}else {
					hooks.stars.push(0);
					hooks.tmpStars.push(0);
				}
			}
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//内部方法
			//内部方法
			vm._trigger = function(ev, type) {
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
			vm._setRate = function(idx) {
				var val = 2;
				for(var i = 0; i < vm.num; i ++) {
					if(i == idx) {
						if(vm.stars[idx] == 0) {
							val = vm.half ? 1 : 2; 
						}else if(vm.stars[idx] == 2) {
							val = 0;
						}
						vm.stars.set(i, val);
					}else if(i > idx) {
						vm.stars.set(i, 0);
					}else {
						vm.stars.set(i, (i + 0.5 == idx) ? 1 : 2);
					}
				}
				return val;
			}
			//接口方法
			vm.clickRate = function(ev, idx) {
				var val = vm._setRate(idx);
				vm.value = idx + (val > 0 ? (val == 1 ? 0.5 : 1) : 0);
				if(!vm.disabled) {
					vm._trigger(ev, 'clicked');
					//click时肯定会变
					vm._trigger(ev, 'changed');
				}
			}
			//对外方法
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.value;
				return data;
			}
			vm.getValue = function() {
				return vm.value;
			}
			vm.setValue = function(val) {
				vm._setRate(val);
				var changed = !(val == vm.value);
				vm.value = val;
				if(changed) {
					vm._trigger(ev, 'changed');
				}
			}
		},
		$ready: function (vm) {
	    
	  }
	});
	
	var widget = avalon.components["td:rate"];
	widget.regionals = {};
})