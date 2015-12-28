define(['avalon', 'text!./td.password.html', 'css!./td.password.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:password", {
		//外部属性
		disabled: false,
		keypad: true,
		order: true,  //键盘是否有序
		label: '',
		name: 'password',
		value: '',
		maxlen: 999,
		minlen: 0,
		must: false,
		//外部参数
		onchanged: null,
		onclicked: null,
		//view属性
		isValid: true,
		validInfo: '',
		activePad: 0,
		showKeypad: false,
		showSymbol: 1,
		showLetter: 1,
		smallLetters: ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'],
		bigLetters: ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'],
		numbers: ['1','2','3','4','5','6','7','8','9', '0'],
		symbols1: ['~','`','!','@','#','$','%','^','&','*','(',')','_','-','+','='],
		symbols2: ['{','[','}',']','|','\\',':',';','"','\'','<',',','>','.','?','/'],
		//内部属性
		_bindFun: null,
		//view接口
		clickPad: _interface,
		toggleKeypad: _interface,
		switchTab: _interface,
		clickKey: _interface,
		checkKeydown: _interface,
		doInput: _interface,
		_trigger: _interface,
		validValue: _interface,
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm._bindFun);
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
					case 'changed':
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					default: break;
				}
			}
			//接口方法
			vm.clickPad = function(ev) {
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.toggleKeypad = function(ev) {
				if(!vm.disabled) {
					if(vm.keypad === true) {
						vm.showKeypad = !vm.showKeypad;
						if(vm.showKeypad === true) {
							if(vm.order === false) {
								vm.smallLetters.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm.bigLetters.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm.numbers.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm.symbols1.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm.symbols2.sort(function(){return Math.random() > 0.5 ? -1 : 1});
							}
						}
					}
					vm._trigger(ev, 'clicked');
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.switchTab = function(ev, idx) {
				vm.activePad = idx;
			}
			vm.clickKey = function(ev, c) {
				switch(c) {
					case 'back':
						if(vm.value.length > 0) {
							vm.value = vm.value.substring(0, vm.value.length - 1);
							vm.validValue(ev);
							vm._trigger(ev, 'changed');
						}
						break;
					case 'next':
						vm.showSymbol = 2;
						break;
					case 'prev':
						vm.showSymbol = 1;
						break;
					case 'up':
						vm.showLetter = 2;
						break;
					case 'low':
						vm.showLetter = 1;
						break;
					default:
						vm.value += c;
						vm.validValue(ev);
						vm._trigger(ev, 'changed');
						break;
				}
			}
			vm.checkKeydown = function(ev) {
				if(vm.keypad === true) {
					//退格则全部删除
					if(ev.keyCode.toString() == '8') {
						vm.value = '';
						vm._trigger(ev, 'changed');
					}
				}
			}
			vm.doInput = function(ev) {
				vm._trigger(ev, 'changed');
				vm.validValue(ev);
			}
			vm.validValue = function(ev) {
				if(vm.must === true && vm.value.trim() == '') {
					vm.isValid = false; vm.validInfo = '请输入密码';
				}else if(vm.value.trim().length < vm.minlen) {
					vm.isValid = false; vm.validInfo = '密码长度至少' + vm.minlen + '位';
				}else {
					vm.isValid = true; vm.validInfo = '';
				}
			}
			//对外方法
			vm.getData = function() {
				var data = new Object();
				data[vm.name] = vm.value;
				return data;
			}
			vm.getValue = function() {
				return vm.value;
			}
			vm.setValue = function(val) {
				if(vm.value != val) {
					vm.value = val;
					vm._trigger(null, 'changed');
				}
			}
			//绑定事件
			vm._bindFun = function() {
				if(vm.showKeypad == true) {
					vm.showKeypad = false;
				}
			}
			avalon.bind(document, 'click', vm._bindFun, false);
		},
		$ready: function (vm) {
			vm.validValue(null);
    }
	});
	
	var widget = avalon.components["td:password"];
  widget.regionals = {};
})