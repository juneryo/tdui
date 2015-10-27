define(['avalon', 'text!./td.password.html', 'css!./td.password.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:password", {
		//外部属性
		disabled: false,
		keypad: true,
		label: '',
		name: 'password',
		value: '',
		maxlen: 999,
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
		smallLetters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		bigLetters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
		numbers: ['0','1','2','3','4','5','6','7','8','9'],
		symbols1: ['~','`','!','@','#','$','%','^','&','*','(',')','_','-','+','='],
		symbols2: ['{','[','}',']','|','\\',':',';','"','\'','<',',','>','.','?','/'],
		//view接口
		toggleKeypad: _interface,
		switchTab: _interface,
		clickKey: _interface,
		checkKeydown: _interface,
		doInput: _interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
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
					case 'changed':
						if(typeof vm.onchanged == 'function') {
							vm.onchanged(ev, vm);
						}
						break;
					default: break;
				}
			}
			//接口方法
			vm.toggleKeypad = function(ev) {
				if(!vm.disabled) {
					if(vm.keypad === true) {
						vm.showKeypad = !vm.showKeypad;
						if(vm.showKeypad === true) {
							vm.smallLetters.sort(function(){return Math.random() > 0.5 ? -1 : 1});
							vm.bigLetters.sort(function(){return Math.random() > 0.5 ? -1 : 1});
							vm.numbers.sort(function(){return Math.random() > 0.5 ? -1 : 1});
							vm.symbols1.sort(function(){return Math.random() > 0.5 ? -1 : 1});
							vm.symbols2.sort(function(){return Math.random() > 0.5 ? -1 : 1});
						}
					}
					vm._trigger(ev, 'clicked');
				}
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
					default:
						vm.value += c;
						vm.validValue(ev);
						vm._trigger(ev, 'changed');
						break;
				}
			}
			vm.checkKeydown = function(ev) {
				if(vm.keypad === true) {
					if(ev.keyCode.toString() != '8') {
						ev.cancelBubble = true;
						ev.preventDefault();
					}
				}
			}
			vm.doInput = function(ev) {
				vm._trigger(ev, 'changed');
				vm.validValue(ev);
			}
			vm.validValue = function(ev) {
				if(vm.isValid && vm.must === true && vm.value.trim() == '') {
					vm.isValid = false; vm.validInfo = '请输入密码';
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
		},
		$ready: function (vm) {
			vm.validValue(null);
    }
	});
	
	var widget = avalon.components["td:password"];
  widget.regionals = {};
})