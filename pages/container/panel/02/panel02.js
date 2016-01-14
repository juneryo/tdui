define(['ui/panel/td.panel'], function () {
	var vpanel = avalon.define({
		$id: 'panel02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		panel_info: '当前时间：' + new Date().format('yyyy-MM-dd hh:mm:ss.S'),
		$panel_opt: {
			buttons: [{
				display: '更新时间', icon: 'glyphicon glyphicon-question-sign', fun: function(ev, vm) {
					vpanel.panel_info = '更新时间：' + new Date().format('yyyy-MM-dd hh:mm:ss.S');
				}
			}],
			actions: [{display: '操作1', fun: function(ev, vm) {
				TD.hint('操作1');
			}}, {display: '操作2', fun: function(ev, vm) {
				TD.hint('操作2');
			}}]
		},
		$panel_tab_opt: {
			tabs: [{title: '标签0'}, {title: '标签1'}, {title: '标签2'}]
		}
	});

	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {
			
		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vpanel];
	});
});