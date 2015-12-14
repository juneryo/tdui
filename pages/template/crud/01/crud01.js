define(['tdDatagrid', 'tdForm', 'tdText', 'tdSelect'], function () {
	var vAgtManage = avalon.define({
		$id: 'agtManage',
		$qry_form_opt: {
			onsubmited: function(ev, vm) {
				avalon.vmodels['agtManage_datagrid'].reloadData(vm.getData());
			}
		},
		$agt_status_opt: {
			data: {'': '全部', '0': '禁用', '1': '可用'}
		},
		$agt_prov_opt: {
			url: 'data/td.crud01.select.prov.json',
			onchanged: function(ev, vm) {
				if(vm.getValue() == '') {
					avalon.vmodels['agt_manage_city'].removeData();
					avalon.vmodels['agt_manage_area'].removeData();
				}else {
					avalon.vmodels['agt_manage_city'].reloadData(vm.getData());
				}
			}
		},
		$agt_city_opt: {
			url: 'data/td.crud01.select.city.json',
			onloaded: function() {
				avalon.vmodels['agt_manage_area'].removeData();
			},
			onchanged: function(ev, vm) {
				if(vm.getValue() == '') {
					avalon.vmodels['agt_manage_area'].removeData();
				}else {
					avalon.vmodels['agt_manage_area'].reloadData(vm.getData());
				}
			}
		},
		$agt_area_opt: {
			url: 'data/td.crud01.select.area.json'
		},
		$datagrid_opt: {
			loadUrl: 'data/td.crud01.datagrid.json',
			updateUrl: 'data/td.datagrid.update.json',
			deleteUrl: 'data/td.datagrid.delete.json',
			key: ['agt_id'],
			cols: [
				{name: 'agt_id', display: '合作商ID', width: 100, type: 'text', disabled: true}, 
				{name: 'agt_name', display: '合作商名称', width: 150, type: 'text'},
				{name: 'agt_prov', display: '合作省份', width: 100, type: 'text'},
				{name: 'agt_city', display: '合作城市', width: 100, type: 'text'},
				{name: 'agt_area', display: '合作区域', width: 100, type: 'text'},
				{name: 'agt_status', display: '状态', width: 70, type: 'select', option: {'0': '禁用', '1': '正常'}, render: function(v, r) {
					var val = '';
					switch(v) {
						case '禁用': val = '<span style="color:red;">禁用</span>'; break;
						case '正常': val = '<span style="color:green;">正常</span>'; break;
					}
					return val
				}},
				{name: 'detail', display: '详情', width: 70, type: 'text', disabled: 'true', render: function(v, r) {
					return '<a href="javascript:void(0)">详情</a>';
				}, fun: function(ev, vm, row, col, val) {
					avalon.log(vm.getRow([row]));
					alert('行' + row + ',列' + col);
				}}
			],
			buttons: [{
				display: '保存', icon: 'glyphicon glyphicon-save', fun: function(ev, vm) {
					alert('save');
				}
			}],
			actions: [{title: '新增', icon: 'glyphicon glyphicon-plus', fun: function(ev, vm) {
				alert('新增');
			}}, {title: '删除', icon: 'glyphicon glyphicon-remove', fun: function(ev, vm) {
				if(vm.getSelectedIdx().length > 0) {
					confirm('<strong style="color:red;">确认要删除选中数据吗？</strong>', function() {
						vm.removeSelectedRow();
					});
				}else {
					alert('请选择需删除的数据');
				}
			}},{title: '刷新', icon: 'glyphicon glyphicon-refresh', type: 'primary', fun: function(ev, vm) {
				vm.reloadData();
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
		$ctrl.$vmodels = [vAgtManage];
	});
});