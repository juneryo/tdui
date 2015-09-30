define(['avalon', 'text!./td.textarea.html', 'css!./td.textarea.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:textarea", {
		//外部属性
		label: '',
		value: '',
		name: 'textarea',
		maxlen: -1,   //最大长度
		width: '100%',
		must: false,
		html: false,
		disabled: false,
		
		//外部参数
		onchanged: null,
		onclicked: null,
		
		//view属性
		isValid: true,
		validInfo: '',
		//view接口
		checkInput: _interface,
		doClick: _interface,
		
		$template: template,
		// hooks : 定义component中的属性
		//vmOpts : 引用component时的js配置$opt 
		//eleOpts: 使用component时标签中的属性
		$construct: function (hooks, vmOpts, elemOpts) {
			if(typeof elemOpts.must == 'number') {
				elemOpts.maxlen = elemOpts.must;
			}
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$textpose: function (vm, elem) {
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
			vm.doClick = function(ev) {
				vm._trigger(ev, 'clicked');
			}
			vm.checkInput = function(ev) {
				vm.isValid = true;
				if(vm.must && vm.value == '') {
					vm.validInfo = '该字段不允许为空';
					vm.isValid = false;
				}
				//禁止输入html内容
				if(!vm.html && vm.isValid) {
					vm.isValid = !/<[^>]+>/.test(vm.value);
					vm.validInfo = vm.isValid ? '' : '不允许输入html标签内容';
				}
			}
			
			//对外方法
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.value;
				return data;
			}
			
			vm.$watch('value', function(newVal, oldVal) {
				vm._trigger({newVal: newVal, oldVal: oldVal}, 'changed');
			});
		},
		$ready: function (vm) {
      vm.checkInput(null);
    }
	});
	
	var widget = avalon.components["td:textarea"];
  widget.regionals = {};
})