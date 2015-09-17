define(['avalon', 'text!./td.combobox.html', 'css!./td.combobox.css'], function(avalon, template) {
    var _interface = function () {};
    
    avalon.component("td:combobox", {
        //外部参数
        
        //view属性
        label        : "",
        defaultOption: "",
        isMutiSelect : true,
        isShowUl     : false,
        disabled     : false,
        group        : [],
        $computed:{
	        value:{
    		    get: function() {
    		        var sValue = "";
    		        var bFlag  = true;
    		        this.group.forEach(function(el){
                        if(el.checked){
                            if("" == el.value){
                                bFlag = false;
                            }
                            sValue += el.value+",";
                        }
                    });
                    //若选择为没有值的 --请选择-- 则其他项
                    if(!bFlag){
                        return "";
                    }
                    if("" != sValue){
                        sValue = sValue.substr(0,sValue.length-1);
                    }
                    return sValue;
    		    }
    		},
    		defaultOptionText:{
    		    get: function() {
    		        var sText = "";
    		        var bFlag = true;
    		        this.group.forEach(function(el){
                        if(el.checked){
                            if("" == el.value){
                                bFlag = false;
                            }
                            sText += el.text+",";
                        }
                    });
                    //若选择为没有值的 --请选择-- 则其他项
                    if(!bFlag){
                        return "";
                    }
                    if("" != sText){
                        sText = sText.substr(0,sText.length-1);
                    }
                    return sText;
    		    }
    		}
	    },
        //view接口
        clickButton : _interface,
        clickUi     : _interface,
        showUl      : _interface,
        hideUl      : _interface,
        
        $template   : template,
        $construct: function (hooks, vmOpts, elemOpts) {    
            var options = avalon.mix(hooks, vmOpts, elemOpts);
            return options;
        },
        $dispose: function (vm, elem) {
            elem.innerHTML = elem.textContent = '';
        },
        $init: function(vm, elem) {
            vm.clickButton = function(ev) {
                if(!vm.disabled) {
                    vm.isShowUl = !vm.isShowUl;
                }
            }
            vm.clickUi = function(ev,el) {
                //设置为可多选试
                if(vm.isMutiSelect){
                    el.checked = !el.checked;
                    //如果多选时选择了 值为空时  对所有选项选中进行置否
                    if("" == el.value){
                        vm.group.forEach(function(el2){
                            el2.checked = false;
                        });
                    }
                }else{
                    //获取点击的值及中文 进行相应的设置
                    vm.group.forEach(function(el2){
                        el2.checked = false;
                    });
                    //点击值为非空时 设置为选中状态
                    if("" != el.value){
                        el.checked  = true;
                    }
                    //将UL设置为隐藏
                    vm.isShowUl = false;
                }
            }
            vm.showUl = function(ev) {
                if(!vm.disabled) {
                    vm.isShowUl = true;
                }
            }
            vm.hideUl = function(ev) {
                if(!vm.disabled) {
                    vm.isShowUl = false;
                }
            }
        },
        $ready: function (vm) {
            avalon.log("构建完成");
        }
    });
    
    var widget = avalon.components["td:combobox"];
    widget.regionals = {};
});