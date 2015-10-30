define(['ui/datagrid/td.datagrid'], function () {
	var vdatagrid = avalon.define({
		$id: 'datagrid01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$datagrid_opt: {
			cols: [
				{name: 'id', display: '编号', width: 100, type: 'text', disabled: true}, 
				{name: 'name', display: '名称', width: 150, type: 'text'}, 
				{name: 'price', display: '价格', width: 120, type: 'text'},
				{name: 'category', display: '类别', width: 150, type: 'select', option: {
					'A1': '游戏', 'A2' : '电影', 'A3' : '音乐'
				}}
			],
			rows: [
				{"id": "001", "name": "Eclair",   "price": "$0.87", "category": "A1", "selected": "false"},
				{"id": "002", "name": "YuJun",    "price": "$0.57", "category": "A2", "selected": "false"},
				{"id": "003", "name": "YingYing", "price": "$1.11", "category": "A3", "selected": "false"},
				{"id": "004", "name": "HaHa",     "price": "$0.89", "category": "A2", "selected": "false"},
				{"id": "005", "name": "Eclair",   "price": "$0.77", "category": "A3", "selected": "false"}
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
		$ctrl.$vmodels = [vdatagrid];
	});
});