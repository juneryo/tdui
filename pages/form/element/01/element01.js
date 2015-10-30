define(['ui/form/text/td.text', 'ui/form/select/td.select', 'ui/form/textarea/td.textarea',
	'ui/form/password/td.password', 'ui/form/checkbox/td.checkboxgroup', 'ui/form/radio/td.radiogroup'], function () {
	var velement = avalon.define({
		$id: 'element01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		text_info: '',
		pwd_info: '',
		select_info: '',
		checkbox_info: '',
		radio_info: '',
		textarea_info: '',
		$text_opt: {
			onclicked: function(ev, vm) {
				velement.text_info = '点击事件';
			},
			onchanged: function(data, vm) {
				velement.text_info = '改变事件[' + vm.getValue() + ']';
			}
		},
		$pwd_opt: {
			onclicked: function(ev, vm) {
				velement.pwd_info = '点击事件';
			},
			onchanged: function(data, vm) {
				velement.pwd_info = '改变事件[' + vm.getValue() + ']';
			}
		},
		$select_opt: {
			url: 'data/td.select.json',
			//存在url属性则可无需data属性
			//data: {
			//	'china': '中国',
			//	'japan': '日本',
			//	'korea': '韩国',
			//	'america': '美国',
			//	'england': '英格兰',
			//	'france': '法国'
			//},
			selected: ['china', 'japan'],
			onselected: function(ev, vm) {
				velement.select_info = '选中事件[' + vm.getValue() + '] 会触发改变事件';
			},
			onchanged: function(ev, vm) {
				velement.select_info = '改变事件[' + vm.getValue() + ']';
			},
			onloaded: function(dat, vm) {
				velement.select_info = '加载事件' + dat + '';
			}
		},
		$checkboxgroup_opt: {
			checkboxes:[
				{label:'游戏', checked:true , disabled:false, value:'1', onchanged: function(ev, vm, box) {
					velement.checkbox_info = '[游戏]改变事件[' + vm.getValue() + '] 若选中,会触发[游戏]选中事件';
				}},
				{label:'电影', checked:false, disabled:false, value:'2'},
				{label:'音乐', checked:false, disabled:false, value:'3'},
				{label:'购物', checked:false, disabled:false, value:'4'},
				{label:'运动', checked:false, disabled:false, value:'5'},
				{label:'健身', checked:false, disabled:false, value:'6'},
				{label:'所有', checked:false, disabled:false, value:'7', onchecked: function(ev, vm, box) {
					for(var i = 0; i < vm.checkboxes.length - 1; i ++) {
						vm.checkboxes[i].checked = true;
					}
					velement.checkbox_info = '[所有]选中事件[' + vm.getValue() + ']';
				}},
				{label:'没有', checked:false, disabled:true, value:'8'}
			]
		},
		$radiogroup_opt: {
			onchanged: function(ev, vm, radio) {
				velement.radio_info = ('[单选组]改变事件[' + radio.label + ']被选中');
			},
			radios: [
				{label:'博士', checked:true , disabled:false, value:'1', onchecked: function(ev, vm, radio) {
					velement.radio_info = '[博士]选中事件[博士被选中] 会触发组改变事件';
				}},
				{label:'硕士', checked:false, disabled:false, value:'2', onchanged: function(ev, vm, radio) {
					velement.radio_info = '[硕士]改变事件[' + radio.checked + '] 会触发组改变事件';
				}},
				{label:'本科', checked:false, disabled:false, value:'3'},
				{label:'大专', checked:false, disabled:false, value:'4'},
				{label:'高中', checked:false, disabled:true,  value:'5'}
			]
		},
		$textarea_opt: {
			onclicked: function(ev, vm) {
				velement.textarea_info = '点击事件'
			},
			onchanged: function(data, vm) {
				velement.textarea_info = '改变事件[' + vm.getValue() + ']';
			}
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [velement];
	});
});