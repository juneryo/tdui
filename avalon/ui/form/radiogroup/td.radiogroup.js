define(['avalon', 'text!./td.radiogroup.html', 'css!./td.radiogroup.css'], function(avalon, template) {
	var _interface = function () {};
	
	avalon.component("td:radiogroup", {
		//外部参数
		
		//view属性
		group:{},
		
		//view接口
		clickradiogroup: _interface,
		getData: _interface,
		
		$computed:{
		        value:{
        		    get: function() {
        		        var sValue = "";
        		        this.group.childs.forEach(function(el){
                            if(el.checked){
                                sValue = el.value;
                            }
                        });
                        return sValue;
        		    }
        		}
		    },
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//在此进行事件的实现
			vm.clickradiogroup = function(ev,el) {
				if(!el.disabled && !el.checked) {
				    var bFlag = !el.checked;
    			    vm.group.childs.forEach(function(el2){
                        el2.checked = false;
                    });
					el.checked = bFlag;
				}
			}
			
			vm.getData = function() {
			    var resObj = {};
			    resObj[vm.group.name] = vm.value;
			    return resObj;
			}
		},
		$ready: function (vm) {
            avalon.log("构建完成");
        }
	});
	
	//定义标签名称
	var widget = avalon.components["td:radiogroup"];
    widget.regionals = {};
})