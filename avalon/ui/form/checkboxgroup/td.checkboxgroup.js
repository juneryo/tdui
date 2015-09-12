define(['avalon', 'text!./td.checkboxgroup.html', 'css!./td.checkboxgroup.css'], function(avalon, template) {
    var _interface = function () {};
    
    avalon.component("td:checkboxgroup", {
        //外部参数
        
        //view属性
        group: {},
        
        //view接口
        clickCheckboxGroup: _interface,
        getData:_interface,
        
        $computed:{
		        value:{
        		    get: function() {
        		        var sValue = "";
        		        this.group.childs.forEach(function(el){
                            if(el.checked){
                                sValue += el.value+",";
                            }
                        });
                        if("" != sValue){
                            sValue = sValue.substr(0,sValue.length-1);
                        }
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
            vm.clickCheckboxGroup = function(ev,el) {
                el.checked = !el.checked;
            }
            
            vm.getData = function() {
			    var resObj = {};
			    alert(vm.value);
			    resObj[vm.group.name] = vm.value;
			    return resObj;
			}
        },
        $ready: function (vm) {
            avalon.log("构建完成");
        }
    });
    
    var widget = avalon.components["td:checkboxgroup"];
    widget.regionals = {};
})