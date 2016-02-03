define(['ui/form/td.form', 'ui/form/text/td.text', 'ui/form/select/td.select',
	'ui/form/spinner/td.spinner', 'ui/form/switch/td.switch', 'ui/form/rate/td.rate', 'ui/form/datepicker/td.datepicker',
	'ui/form/radio/td.radiogroup', 'ui/form/checkbox/td.checkboxgroup', 'ui/form/textarea/td.textarea'], function () {
	var vform = avalon.define({
		$id: 'form01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		form_info: '',
		$form_opt: {
			submitUrl: 'data/td.form.submit.json',
			loadUrl: 'data/td.form.load.json',
			loadParam: {p1: 1, p2:2},
			onloaded: function(dat, vm) {
				vform.form_info = '加载数据事件' + dat;
			},
			onclicksubmited: function(ev, vm) {
				vform.form_info = '点击提交按钮事件';
			},
			onoksubmited: function(dat, vm) {
				vform.form_info = '提交成功事件[' + dat.rspcod + ':' + dat.rspmsg + ']';
				TD.alert('[' + dat.rspcod + ':' + dat.rspmsg + ']');
			},
			onreseted: function(dat, vm) {
				vform.form_info = '重置事件';
			}
		},
		$select_opt: {
			data: {
				'1': '男',
				'2': '女',
				'3': '其他'
			}
		},
		$switch_opt: {
			display: {
				on: '已婚',
				off: '未婚'
			}
		},
		$radiogroup_opt: {
			radios: [
				{label:'大专', checked:true,  disabled:false, value:'1'},
				{label:'本科', checked:false, disabled:false, value:'2'},
				{label:'硕士', checked:false, disabled:false, value:'3'},
				{label:'博士', checked:false, disabled:false, value:'4'}
			]
		},
		$checkboxgroup_opt: {
			checkboxes:[
				{label:'电影', checked:false, disabled:false, value:'1'},
				{label:'音乐', checked:false, disabled:false, value:'2'},
				{label:'游戏', checked:false, disabled:false, value:'3'},
				{label:'旅游', checked:false, disabled:false, value:'4'}
			]
		}
	});
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vform];
	});
});