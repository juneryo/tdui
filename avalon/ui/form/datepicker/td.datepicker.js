define(['avalon', 'text!./td.datepicker.html', 'css!./td.datepicker.css'], function(avalon, template) {
	var _interface = function () {};
	avalon.component("td:datepicker", {
		//外部标签属性
		label: '',
		value: '',
		name: 'datepicker',
		displayFormat: 'yyyy-MM-dd',
		valueFormat: 'yyyyMMdd',
		disabled: false,
		must: false,
		horizontal: false,
		labelCol: 4,
		max: '',
		min: '',
		//外部配置参数
		onclicked: null,
		onchanged: null,
		onpicked: null,
		onready: null,
		//内部属性
		$isInit: true,
		//内部接口
		$bindFun: null,
		$trigger: _interface,
		$buildDateArr: _interface,
		$buildYearArr: _interface,
		$setPickMonth: _interface,
		$showDatePicker: _interface,
		$validValue: _interface,
		//view属性
		_isValid: true,
		_isShow: false,
		_showDate: true,
		_showMonth: false,
		_showYear: false,
		_today: null,
		_validInfo: '',
		_pickYear: '',
		_pickMonth: '',
		_pickDate: '',
		_firstYear: '',
		_lastYear: '',
		_dateArr: [],
		_weekArr: ['一', '二', '三', '四', '五', '六', '日'],
		_monthArr: [['一月', '二月', '三月'], ['四月', '五月', '六月'], ['七月', '八月', '九月'], ['十月', '十一月', '十二月']],
		_yearArr: [],
		//view接口
		_clickPicker: _interface,
		_togglePicker: _interface,
		_changeMonth: _interface,
		_changeYear: _interface,
		_displayMonth: _interface,
		_showMonthPicker: _interface,
		_showYearPicker: _interface,
		_doPick: _interface,
		_checkKeydown: _interface,
		_checkKeyPress: _interface,
		_checkKeyUp: _interface,
		//对外方法
		getData: _interface,
		getValue: _interface,
		setValue: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			hooks._today = new Date();
			hooks._pickMonth = hooks._today.getMonth();
			hooks._pickYear = hooks._today.getFullYear();
			if(hooks.value != '') {
				var dt = hooks.value.toString().toDate();
				hooks.value = dt.format(hooks.displayFormat);
				hooks._pickYear = dt.getFullYear();
				hooks._pickMonth = dt.getMonth();
				hooks._pickDate = dt.getDate();
			}
			return options;
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
					case 'picked':
						if(typeof vm.onpicked == 'function') {
							vm.onpicked(ev, vm);
						}
						break;
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			//构建日期二维数组
			vm.$buildDateArr = function(yyyy, MM, dd) {
				var dt = new Date(yyyy + '/' + MM + '/' + dd);
				dt.setDate(1);  //设置为月1号
				var day = dt.getDay();  //获取周(0为周日)
				var leftPad = day == 0 ? 6 : day - 1;
				dt.setMonth(dt.getMonth() + 1); //设置为下月1号
				dt.setDate(0); //设置为月最后一天
				var lastDate = dt.getDate();
				var count = Math.ceil((lastDate + leftPad) / 7);
				vm._dateArr.removeAll();
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
					vm._dateArr.push(arr);
				}
			}
			//根据当年构建年份二维数组
			vm.$buildYearArr = function(yyyy) {
				var dt = new Date(yyyy + '/01/01');
				var fYear = parseInt(yyyy) - 8;
				vm._yearArr.removeAll();
				for(var i = 0; i < 4; i ++) {
					var arr = [];
					for(var j = 0; j < 4; j ++) {
						arr.push(fYear + i*4 + j);
					}
					vm._yearArr.push(arr);
				}
				vm._firstYear = vm._yearArr[0][0];
				vm._lastYear = vm._yearArr[3][3];
			}
			//根据月份二维数组中指定元素设置属性_pickMonth(0 - 11)
			vm.$setPickMonth = function(val) {
				for(var i = 0; i < vm._monthArr.length; i ++) {
					for(var j = 0; j < vm._monthArr[i].length; j ++) {
						if(vm._monthArr[i][j] == val) {
							vm._pickMonth = (i*3 + j).toString(); return;
						}
					}
				}
			}
			vm.$showDatePicker = function(ev) {
				vm._showMonth = false; vm._showYear = false; vm._showDate = true;
			}
			vm.$validValue = function() {
				if(vm.must === true && vm.value.trim() == '') {
					vm._isValid = false; vm._validInfo = '请填写日期';
				}else if(vm.max != '' && vm.value != '' && vm.max.toString().toDate().getTime() < vm.value.toDate().getTime()) {
					vm._isValid = false; vm._validInfo = '选中日期大于最大日期';
				}else if(vm.min != '' && vm.value != '' && vm.min.toString().toDate().getTime() > vm.value.toDate().getTime()) {
					vm._isValid = false; vm._validInfo = '选中日期小于最小日期';
				}else {
					vm._isValid = true; vm._validInfo = '';
				}
			}
			vm.$bindFun = function() {
				if(vm._isShow == true) {
					vm._isShow = false;
				}
			}
			vm._clickPicker = function(ev) {
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._togglePicker = function(ev) {
				if(!vm.disabled) {
					vm._isShow = !vm._isShow;
					vm.$trigger(ev, 'clicked');
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._checkKeydown = function(ev) {
				if(ev.keyCode.toString() == '8' && vm.disabled == false) {  //退格则全部删除
					//keyUp中处理
				}else {
					ev.preventDefault();
				}
			}
			vm._checkKeyPress = function(ev) {
				ev.preventDefault();
			}
			vm._checkKeyUp = function(ev) {
				if(ev.keyCode.toString() == '8' && vm.disabled == false) {
					vm.setValue('');
				}
			}
			vm._changeMonth = function(ev, oper) {
				if(oper == '+') {
					if(vm._pickMonth == '11') {
						vm._pickMonth = '0'; vm._pickYear ++;
					}else {
						vm._pickMonth ++;
					}
				}else {
					if(vm._pickMonth == '0') {
						vm._pickMonth = '11'; vm._pickYear --;
					}else {
						vm._pickMonth --;
					}
				}
			}
			vm._changeYear = function(ev, oper) {
				var fyear = vm._firstYear - 16;
				if(oper == '+') {
					fyear = vm._lastYear + 1;
				}
				vm.$buildYearArr(fyear + 8);
			}
			//根据属性_pickMonth在月份二维数组中查找月份
			vm._displayMonth = function() {
				var v = 0;
				for(var i = 0; i < vm._monthArr.length; i++) {
					for(var j=0; j<vm._monthArr[i].length; j++) {
						if((3*i + j).toString() == vm._pickMonth) {
							return vm._monthArr[i][j];
						}
					}
				}
				return '';
			}
			vm._showMonthPicker = function(ev) {
				vm._showDate = false; vm._showYear = false; vm._showMonth = true;
			}
			vm._showYearPicker = function(ev) {
				vm._showDate = false; vm._showMonth = false; vm._showYear = true;
			}
			vm._doPick = function(ev, val, type) {
				switch(type) {
					case 'D':
						vm._pickDate = val; 
						vm.$trigger(ev, 'picked');
						vm._isShow = false;
						break;
					case 'M':
						vm.$setPickMonth(val); 
						vm.$showDatePicker(null);
						break;
					case 'Y':
						vm._pickYear = val; 
						vm.$showDatePicker(null);
						break;
					default: break;
				}
			}
			vm.$watch('_pickDate', function(newVal, oldVal) {
				if(!vm.$isInit && newVal != '') {
					var dt = new Date(vm._pickYear + '/' + (parseInt(vm._pickMonth) + 1) + '/' + newVal);
					vm.value = dt.format(vm.displayFormat);
				}
			});
			vm.$watch('_pickMonth', function(newVal, oldVal) {
				var yyyy = vm._pickYear, MM = parseInt(newVal) + 1, dd = (vm._pickDate == '' ? vm._today.getDate() : vm._pickDate);
				var dt = new Date(yyyy + '/' + MM + '/' + dd);
				vm.$buildDateArr(yyyy, MM, dd);
				if(vm._pickDate != '') {
					vm.value = dt.format(vm.displayFormat);
				}
			});
			vm.$watch('_pickYear', function(newVal, oldVal) {
				var yyyy = newVal, MM = parseInt(vm._pickMonth) + 1, dd = (vm._pickDate == '' ? vm._today.getDate() : vm._pickDate);
				var dt = new Date(yyyy + '/' + MM + '/' + dd);
				vm.$buildDateArr(yyyy, MM, dd);
				if(vm._pickDate != '') {
					vm.value = dt.format(vm.displayFormat);
				}
			});
			vm.$watch('value', function(newVal, oldVal) {
				if(!vm.$isInit) {
					vm.$trigger({newVal: newVal, oldVal: oldVal}, 'changed');
					vm.$validValue();
				}
			});
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
					vm._pickYear = dt.getFullYear();
					vm._pickMonth = dt.getMonth();
					vm._pickDate = dt.getDate();
				}else {
					vm._pickDate = '';
					vm._pickYear = vm._today.getFullYear();
					vm._pickMonth = vm._today.getMonth();
					vm.value = '';
				}
			}
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm, elem) {
			vm.$buildDateArr(vm._today.getFullYear(), vm._today.getMonth() + 1, vm._today.getDate());
			vm.$buildYearArr(vm._today.getFullYear());
			vm.$validValue();
			vm.$isInit = false;
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:datepicker"];
  widget.regionals = {};
})