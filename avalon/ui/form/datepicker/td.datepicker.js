define(['avalon', 'text!./td.datepicker.html', 'css!./td.datepicker.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:datepicker", {
		//外部属性
		label: '',
		name: 'datepicker',
		value: '',
		displayFormat: 'yyyy-MM-dd',
		valueFormat: 'yyyyMMdd',
		disabled: false,
		must: false,
		max: '',
		min: '',
		//外部参数
		onclicked: null,
		onchanged: null,
		onpicked: null,	
		//内部属性
		isInit: true,
		isValid: true,
		_bindFun: null,
		//view属性
		value: '',
		validInfo: '',
		isShow: false,
		showDate: true,
		showMonth: false,
		showYear: false,
		today: null,
		pickYear: '',
		pickMonth: '',
		pickDate: '',
		firstYear: '',
		lastYear: '',
		dateArr: [],
		weekArr: ['一', '二', '三', '四', '五', '六', '日'],
		monthArr: [['一月', '二月', '三月'], ['四月', '五月', '六月'], ['七月', '八月', '九月'], ['十月', '十一月', '十二月']],
		yearArr: [],
		//view接口
		clickPicker: _interface,
		togglePicker: _interface,
		changeMonth: _interface,
		changeYear: _interface,
		displayMonth: _interface,
		showMonthPicker: _interface,
		showYearPicker: _interface,
		doPick: _interface,
		checkKeydown: _interface,
		_trigger: _interface,
		_buildDateArr: _interface,
		_buildYearArr: _interface,
		_setPickMonth: _interface,
		showDatePicker: _interface,
		validValue: _interface,
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		$template: template,
		// hooks : 定义component中的属性
		//vmOpts : 引用component时的js配置$opt 
		//eleOpts: 使用component时标签中的属性
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			hooks.today = new Date();
			hooks.pickMonth = hooks.today.getMonth();
			hooks.pickYear = hooks.today.getFullYear();
			if(hooks.value != '') {
				var dt = hooks.value.toString().toDate();
				hooks.value = dt.format(hooks.displayFormat);
				hooks.pickYear = dt.getFullYear();
				hooks.pickMonth = dt.getMonth();
				hooks.pickDate = dt.getDate();
			}
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
					case 'picked':
						if(typeof vm.onpicked == 'function') {
							vm.onpicked(ev, vm);
						}
						break;
					default: break;
				}
			}
			//构建日期二维数组
			vm._buildDateArr = function(yyyy, MM, dd) {
				var dt = new Date(yyyy + '/' + MM + '/' + dd);
				dt.setDate(1);  //设置为月1号
				var day = dt.getDay();  //获取周(0为周日)
				var leftPad = day == 0 ? 6 : day - 1;
				dt.setMonth(dt.getMonth() + 1); //设置为下月1号
				dt.setDate(0); //设置为月最后一天
				var lastDate = dt.getDate();
				var count = Math.ceil((lastDate + leftPad) / 7);
				vm.dateArr.removeAll();
				for(var i = 0; i < count; i ++) {
					var arr = [];
					for(var j = 0; j < 7; j ++) {
						if(i == 0) {
							if(j < leftPad) {
								arr.push('');
							}else {
								arr.push(j - leftPad + 1);
							}
						}else {
							var d = 7*i - leftPad + j + 1;
							arr.push(d > lastDate ? '' : d);
						}
					}
					vm.dateArr.push(arr);
				}
			}
			//根据当年构建年份二维数组
			vm._buildYearArr = function(yyyy) {
				var dt = new Date(yyyy + '/01/01');
				var fYear = parseInt(yyyy) - 8;
				vm.yearArr.removeAll();
				for(var i = 0; i < 4; i ++) {
					var arr = [];
					for(var j = 0; j < 4; j ++) {
						arr.push(fYear + i*4 + j);
					}
					vm.yearArr.push(arr);
				}
				vm.firstYear = vm.yearArr[0][0];
				vm.lastYear = vm.yearArr[3][3];
			}
			//根据月份二维数组中指定元素设置属性pickMonth(0 - 11)
			vm._setPickMonth = function(val) {
				for(var i = 0; i < vm.monthArr.length; i ++) {
					for(var j = 0; j < vm.monthArr[i].length; j ++) {
						if(vm.monthArr[i][j] == val) {
							vm.pickMonth = (i*3 + j).toString(); return;
						}
					}
				}
			}
			//接口方法
			vm.clickPicker = function(ev) {
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.togglePicker = function(ev) {
				if(!vm.disabled) {
					vm.isShow = !vm.isShow;
					vm._trigger(ev, 'clicked');
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.checkKeydown = function(ev) {
				if(!vm.disabled) {
					//退格则全部删除
					if(ev.keyCode.toString() == '8') {
						vm.setValue('');
					}
				}
			}
			vm.changeMonth = function(ev, oper) {
				if(oper == '+') {
					if(vm.pickMonth == '11') {
						vm.pickMonth = '0'; vm.pickYear ++;
					}else {
						vm.pickMonth ++;
					}
				}else {
					if(vm.pickMonth == '0') {
						vm.pickMonth = '11'; vm.pickYear --;
					}else {
						vm.pickMonth --;
					}
				}
			}
			vm.changeYear = function(ev, oper) {
				var fyear = vm.firstYear - 16;
				if(oper == '+') {
					fyear = vm.lastYear + 1;
				}
				vm._buildYearArr(fyear + 8);
			}
			//根据属性pickMonth在月份二维数组中查找月份
			vm.displayMonth = function() {
				var v = 0;
				for(var i = 0; i < vm.monthArr.length; i++) {
					for(var j=0; j<vm.monthArr[i].length; j++) {
						if((3*i + j).toString() == vm.pickMonth) {
							return vm.monthArr[i][j];
						}
					}
				}
				return '';
			}
			vm.showDatePicker = function(ev) {
				vm.showMonth = false; vm.showYear = false; vm.showDate = true;
			}
			vm.showMonthPicker = function(ev) {
				vm.showDate = false; vm.showYear = false; vm.showMonth = true;
			}
			vm.showYearPicker = function(ev) {
				vm.showDate = false; vm.showMonth = false; vm.showYear = true;
			}
			vm.doPick = function(ev, val, type) {
				switch(type) {
					case 'D':
						vm.pickDate = val; 
						vm._trigger(ev, 'picked');
						vm.isShow = false;
						break;
					case 'M':
						vm._setPickMonth(val); 
						vm.showDatePicker(null);
						break;
					case 'Y':
						vm.pickYear = val; 
						vm.showDatePicker(null);
						break;
					default: break;
				}
			}
			vm.validValue = function() {
				if(vm.must === true && vm.value.trim() == '') {
					vm.isValid = false; vm.validInfo = '请填写日期';
				}else if(vm.max != '' && vm.value != '' && vm.max.toString().toDate().getTime() < vm.value.toDate().getTime()) {
					vm.isValid = false; vm.validInfo = '选中日期大于最大日期';
				}else if(vm.min != '' && vm.value != '' && vm.min.toString().toDate().getTime() > vm.value.toDate().getTime()) {
					vm.isValid = false; vm.validInfo = '选中日期小于最小日期';
				}else {
					vm.isValid = true; vm.validInfo = '';
				}
			}
			//对外方法
			vm.getData = function() {
				var data = {};
				data[vm.name] = vm.getValue();
				return data;
			}
			vm.getValue = function() {
				var d = vm.value.toDate();
				return d == null ? '' : d.format(vm.valueFormat);
			}
			vm.setValue = function(val) {
				if(val != '') {
					var dt = val.toDate();
					vm.value = dt.format(vm.displayFormat);
					vm.pickYear = dt.getFullYear();
					vm.pickMonth = dt.getMonth();
					vm.pickDate = dt.getDate();
				}else {
					vm.pickDate = '';
					vm.pickYear = vm.today.getFullYear();
					vm.pickMonth = vm.today.getMonth();
					vm.value = '';
				}
			}
			//观测方法
			vm.$watch('pickDate', function(newVal, oldVal) {
				if(!vm.isInit && newVal != '') {
					var dt = new Date(vm.pickYear + '/' + (parseInt(vm.pickMonth) + 1) + '/' + newVal);
					vm.value = dt.format(vm.displayFormat);
				}
			});
			vm.$watch('pickMonth', function(newVal, oldVal) {
				var yyyy = vm.pickYear, MM = parseInt(newVal) + 1, dd = (vm.pickDate == '' ? vm.today.getDate() : vm.pickDate);
				var dt = new Date(yyyy + '/' + MM + '/' + dd);
				vm._buildDateArr(yyyy, MM, dd);
				if(vm.pickDate != '') {
					vm.value = dt.format(vm.displayFormat);
				}
			});
			vm.$watch('pickYear', function(newVal, oldVal) {
				var yyyy = newVal, MM = parseInt(vm.pickMonth) + 1, dd = (vm.pickDate == '' ? vm.today.getDate() : vm.pickDate);
				var dt = new Date(yyyy + '/' + MM + '/' + dd);
				vm._buildDateArr(yyyy, MM, dd);
				if(vm.pickDate != '') {
					vm.value = dt.format(vm.displayFormat);
				}
			});
			vm.$watch('value', function(newVal, oldVal) {
				if(!vm.isInit) {
					vm._trigger({newVal: newVal, oldVal: oldVal}, 'changed');
					vm.validValue();
				}
			});
			//绑定事件
			vm._bindFun = function() {
				if(vm.isShow == true) {
					vm.isShow = false;
				}
			}
			avalon.bind(document, 'click', vm._bindFun, false);
		},
		$ready: function (vm) {
			vm._buildDateArr(vm.today.getFullYear(), vm.today.getMonth() + 1, vm.today.getDate());
			vm._buildYearArr(vm.today.getFullYear());
			vm.validValue();
			vm.isInit = false;
    }
	});
	
	var widget = avalon.components["td:datepicker"];
  widget.regionals = {};
})