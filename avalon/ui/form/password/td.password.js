define(['avalon', 'text!./td.password.html', 'css!./td.password.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:password", {
		//外部标签属性
		disabled: false,
		keypad: true,
		order: true,  //键盘是否有序
		label: '',
		value: '',
		name: 'password',
		maxlen: 999,
		minlen: 0,
		must: false,
		//外部配置参数
		onchanged: null,
		onclicked: null,
		//内部接口
		$bindFun: null,
		$trigger: _interface,
		$validValue: _interface,
		//view属性
		_isValid: true,
		_validInfo: '',
		_activePad: 0,
		_showKeypad: false,
		_showSymbol: 1,
		_showLetter: 1,
		_smallLetters: ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'],
		_bigLetters: ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'],
		_numbers: ['1','2','3','4','5','6','7','8','9', '0'],
		_symbols1: ['~','`','!','@','#','$','%','^','&','*','(',')','_','-','+','='],
		_symbols2: ['{','[','}',']','|','\\',':',';','"','\'','<',',','>','.','?','/'],
		//view接口
		_clickPad: _interface,
		_toggleKeypad: _interface,
		_switchTab: _interface,
		_clickKey: _interface,
		_checkKeydown: _interface,
		_checkKeyPress: _interface,
		_checkKeyUp: _interface,
		_doInput: _interface,
		//对外方法
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			return avalon.mix(hooks, vmOpts, elemOpts);
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm.$bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
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
			vm.$validValue = function(ev) {
				if(vm.must === true && vm.value.trim() == '') {
					vm._isValid = false; vm._validInfo = '请输入密码';
				}else if(vm.value.trim().length < vm.minlen) {
					vm._isValid = false; vm._validInfo = '密码长度至少' + vm.minlen + '位';
				}else {
					vm._isValid = true; vm._validInfo = '';
				}
			}
			vm.$bindFun = function() {
				if(vm._showKeypad == true) {
					vm._showKeypad = false;
				}
			}
			vm._clickPad = function(ev) {
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._toggleKeypad = function(ev) {
				if(!vm.disabled) {
					if(vm.keypad === true) {
						vm._showKeypad = !vm._showKeypad;
						if(vm._showKeypad === true) {
							if(vm.order === false) {
								vm._smallLetters.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm._bigLetters.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm._numbers.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm._symbols1.sort(function(){return Math.random() > 0.5 ? -1 : 1});
								vm._symbols2.sort(function(){return Math.random() > 0.5 ? -1 : 1});
							}
						}
					}
					vm.$trigger(ev, 'clicked');
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._switchTab = function(ev, idx) {
				vm._activePad = idx;
			}
			vm._clickKey = function(ev, c) {
				switch(c) {
					case 'back':
						if(vm.value.length > 0) {
							vm.value = vm.value.substring(0, vm.value.length - 1);
							vm.$validValue(ev);
							vm.$trigger(ev, 'changed');
						}
						break;
					case 'next':
						vm._showSymbol = 2;
						break;
					case 'prev':
						vm._showSymbol = 1;
						break;
					case 'up':
						vm._showLetter = 2;
						break;
					case 'low':
						vm._showLetter = 1;
						break;
					default:
						vm.value += c;
						vm.$validValue(ev);
						vm.$trigger(ev, 'changed');
						break;
				}
			}
			vm._checkKeydown = function(ev) {
				if(vm.keypad === true) {
					if(ev.keyCode.toString() == '8' && vm.disabled == false) {  //退格则全部删除
						//在keyUp中处理
					}else {
						ev.preventDefault();
					}
				}
			}
			vm._checkKeyPress = function(ev) {
				if(vm.keypad === true) {
					ev.preventDefault();
				}
			}
			vm._checkKeyUp = function(ev) {
				if(vm.keypad === true) {
					if(ev.keyCode.toString() == '8' && vm.disabled == false) {
						vm.value = '';
						vm.$validValue(ev);
						vm.$trigger(ev, 'changed');
					}
				}
			}
			vm._doInput = function(ev) {
				vm.$trigger(ev, 'changed');
				vm.$validValue(ev);
			}
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
					vm.$trigger(null, 'changed');
				}
			}
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm) {
			vm.$validValue(null);
    }
	});
	var widget = avalon.components["td:password"];
  widget.regionals = {};
})