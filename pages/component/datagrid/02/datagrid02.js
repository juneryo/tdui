define(['ui/datagrid/td.datagrid', 'tdForm', 'tdText', 'tdSelect'], function () {
	var vdatagrid = avalon.define({
		$id: 'datagrid02',
		info: '',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$form_opt: {
			onsubmited: function(ev, vm) {
				avalon.vmodels['datagrid02_datagrid'].reloadData(vm.getData());
			}
		},
		$select_opt: {
			data: {
				'': '全部', 'A1': '游戏', 'A2' : '电影', 'A3' : '音乐'
			}
		},
		$datagrid_opt: {
			loadUrl: 'data/td.datagrid.json',
			loadParam: {
				//...
			},
			updateUrl: 'data/td.datagrid.update.json',
			deleteUrl: 'data/td.datagrid.delete.json',
			key: ['id', 'name'],
			cols: [
				{name: 'id', display: '编号', width: 100, type: 'text', disabled: true}, 
				{name: 'name', display: '名称', width: 150, type: 'text'}, 
				{name: 'price', display: '价格', width: 120, type: 'text', render: function(val, row) {
					return '<b style="color:red;">' + val + '</b>';
				}, fun: function(ev, vm, row, col, val) {
					avalon.log(vm.getRow([row]));
					alert('行' + row + ',列' + col + ',值' + val);
				}},
				{name: 'category', display: '类别', width: 150, type: 'select', option: {
					'A1': '游戏', 'A2' : '电影', 'A3' : '音乐'
				}}
			],
			onloaded: function(dat, vm) {
				vdatagrid.info = '加载数据 ' + dat;
			},
			onreloaded: function(dat, vm) {
				vdatagrid.info = '重新加载数据 ' + dat;
			},
			onrowclicked: function(row, vm) {
				vdatagrid.info = '点击行 ' + row;
			},
			onrowdbclicked: function(row, vm) {
				vdatagrid.info = '双击行 ' + row;
			},
			onrowselected: function(row, vm) {
				vdatagrid.info = '已选中行索引 ' + vm.getSelectedIdx();
			},
			buttons: [{
				display: '保存', icon: 'glyphicon glyphicon-save', fun: function(ev, vm) {
					alert('save');
				}
			}],
			actions: [{title: '新增', icon: 'glyphicon glyphicon-plus', fun: function(ev, vm) {
				vdatagrid.info = '新增游戏999 GAME $999 A1';
				vm.addRow([{id:'999', name:'GAME', price:'$999', category:'A1', selected:false}]);
			}}, {title: '修改', icon: 'glyphicon glyphicon-pencil', fun: function(ev, vm) {
				vdatagrid.info = '修改选中行名称为NEW';
				vm.modifySelectRow({name: 'NEW'});
			}}, {title: '删除', icon: 'glyphicon glyphicon-remove', fun: function(ev, vm) {
				vdatagrid.info = '点击删除[已选中行：' + vm.getSelectedIdx() + ']';
				vm.removeSelectedRow();
			}},{title: '刷新', icon: 'glyphicon glyphicon-refresh', type: 'primary', fun: function(ev, vm) {
				vm.reloadData();
			}}]
		}
	});
	avalon.log(vdatagrid)
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