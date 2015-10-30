define(['ui/navbar/td.navbar'], function () {
	var vnavbar = avalon.define({
		$id: 'navbar02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$navbar_opt: {
			onsubmited: function(ev, vm) {
				alert(ev.target.value);
			},
			ontitleclicked: function(ev, vm) {
				alert(vm.title);
			},
			buttons: [{
				display: '查询', icon: 'glyphicon glyphicon-search', fun: function(ev, vm) {
					alert('查询');
			}},{
				display: '保存', icon: 'glyphicon glyphicon-save', fun: function(ev, vm) {
					alert('保存');
			}}],
			operations: [{display: '新增', icon: 'glyphicon glyphicon-plus', fun: function(ev, vm) {
				alert('新增');
			}}, {display: '删除', icon: 'glyphicon glyphicon-remove', fun: function(ev, vm) {
				alert('删除');
			}}]
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vnavbar];
	});
});