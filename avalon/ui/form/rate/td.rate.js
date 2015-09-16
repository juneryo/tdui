define(['avalon', 'text!./td.rate.html', 'css!./td.rate.css'], function(avalon, template) {
	var _interface = function () {
	};
	avalon.component("td:rate", {
		//外部参数
		num : 5,          //星星默认个数
		isHalf : false,   //是否允许半个星星
		defaultNum : 1,   //星星默认选中个数
		
		//view属性
		disabled: false,
		starArr: [0, 0, 0, 0, 0],
		//view接口
		clickRate: _interface,
		mouseOverRate: _interface,
		mouseOutRate: _interface,
		
		uncheckedAll: _interface,
		checkedRateHalf: _interface,
		checkedRate:_interface,
		countChecked:_interface,
		checkedByCount:_interface,
		
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//初始化星星个数
			var starArrInit = [];
			for(var k = 1; k <= vm.num; k++){
				starArrInit.push(k <= vm.defaultNum ? 2 : 0);
			}
			vm.starArr = starArrInit;
			
			var count = vm.defaultNum;   //上次星星选中个数
			
			//事件绑定
			vm.clickRate = function(index) {   //点击事件
				if(!vm.disabled) {
					if(vm.isHalf){
						var countArr = count.toString().split('.');
						var len = countArr.length;
						count = len == 2 ? count + 0.5 : count;
						if(index + 1 - count != 0){
							vm.checkedRateHalf(index);
						}else if(index + 1 - count == 0){
							if(len == 2){
								vm.starArr.set(index, 2);
							}else{
								vm.starArr.set(index, 0);
							}
						}
					}else{
						vm.checkedRate(index);
					}
					count = vm.countChecked();
				}
			}
			vm.mouseOverRate = function(index) { //鼠标悬浮事件
				if(!vm.disabled) {
					vm.checkedRate(index);
				}
			}
			vm.mouseOutRate = function() {   //鼠标离开事件
				if(!vm.disabled) {
					vm.checkedByCount(count);
				}
			}
			
			vm.uncheckedAll = function(){
				for(var i = 0; i < vm.num; i++){
					vm.starArr.set(i, 0);
				}
			}
			vm.checkedRateHalf = function(index){
				vm.uncheckedAll();
				for(var i = 0; i < index; i ++){
					vm.starArr.set(i, 2);
				}
				vm.starArr.set(index, 1);
			}
			vm.checkedRate = function(index){
				vm.uncheckedAll();
				for(var i = 0; i <= index; i ++){
					vm.starArr.set(i, 2);
				}
			}
			vm.countChecked = function(){
				count = 0;
				for(var i = 0; i < vm.num; i++){
					if(vm.starArr[i] == 2){
						count ++;
					}else if(vm.starArr[i] == 1){
						count = count + 0.5;
					}
				}
				return count;
			}
			vm.checkedByCount = function(count){
				vm.uncheckedAll();
				var countArr = count.toString().split('.');
				if(countArr.length == 2){
					for(var i = 0; i < count - 1; i ++){
						vm.starArr.set(i, 2);
					}
					vm.starArr.set(i, 1);
				}else{
					for(var i = 0; i < count; i ++){
						vm.starArr.set(i, 2);
					}
				}
			}
			
		},
		$ready: function (vm) {
	      avalon.log("构建完成");
	    }
	});
	
	var widget = avalon.components["td:rate"];
	widget.regionals = {};
})