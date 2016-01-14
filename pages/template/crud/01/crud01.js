define(['tdDatagrid', 'tdDialog', 'tdForm', 'tdText', 'tdSelect'], function () {
	var vAgtManage = avalon.define({
		$id: 'agtManage',
		$qry_form_opt: {
			onsubmited: function(ev, vm) {
				avalon.vmodels['crud01_datagrid'].reloadData(vm.getData());
			}
		},
		$agt_status_opt: {
			data: {'': '全部', '0': '禁用', '1': '可用'}
		},
		$agt_prov_opt: {
			url: 'data/td.crud01.select.prov.json',
			onchanged: function(ev, vm) {
				if(vm.getValue() == '') {
					avalon.vmodels['crud01_city'].removeData();
					avalon.vmodels['crud01_area'].removeData();
				}else {
					avalon.vmodels['crud01_city'].reloadData(vm.getData());
				}
			}
		},
		$agt_city_opt: {
			url: 'data/td.crud01.select.city.json',
			onloaded: function() {
				avalon.vmodels['crud01_area'].removeData();
			},
			onchanged: function(ev, vm) {
				if(vm.getValue() == '') {
					avalon.vmodels['crud01_area'].removeData();
				}else {
					avalon.vmodels['crud01_area'].reloadData(vm.getData());
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
				{name: 'agt_status', display: '状态', width: 70, type: 'select', option: {'0': '禁用', '1': '正常'}, render: function(v, r, ridx) {
					var val = '';
					switch(v) {
						case '禁用': val = '<span style="color:red;">禁用</span>'; break;
						case '正常': val = '<span style="color:green;">正常</span>'; break;
					}
					return val
				}},
				{name: 'detail', display: '详情', width: 70, type: 'text', disabled: 'true', render: function(val, row, ridx) {
					return '<a href="javascript:void(0)">详情</a>';
				}, fun: function(ev, vm, row, col, val) {
					avalon.vmodels['crud01_dialog'].setTitle(vm.getRow([row])[0].agt_name + '详情');
					avalon.vmodels['crud01_dialog'].showDialog();
				}}
			],
			render: function(vm, dat) {
				return '<b>渲染结果&nbsp;&nbsp;响应码：' + dat.rspcod + '&nbsp;&nbsp;响应信息：' + dat.rspmsg + '</b>';
			},
			buttons: [{display: '添加', icon: 'glyphicon glyphicon-plus', fun: function(ev, vm) {
				TD.alert('添加');
			}}, {display: '修改', icon: 'glyphicon glyphicon-pencil', fun: function(ev, vm) {
				if(vm.getSelectedIdx().length > 1) {
					TD.hint('每次只允许修改一条记录');
				}else if(vm.getSelectedIdx().length == 0) {
					TD.hint('请选择需修改的记录');
				}else {
					TD.alert('双击记录即可进行修改');
				}
			}}, {display: '删除', icon: 'glyphicon glyphicon-remove', fun: function(ev, vm) {
				if(vm.getSelectedIdx().length > 0) {
					TD.confirm('<strong style="color:red;">确认要删除选中数据吗？</strong>', function() {
						vm.removeSelectedRow();
					});
				}else {
					TD.hint('请选择需删除的数据');
				}
			}}],
			operations: [{display: '保存', icon: 'glyphicon glyphicon-save', fun: function(ev, vm) {
				TD.alert('save');
			}}],
			actions: [{title: '刷新', icon: 'glyphicon glyphicon-refresh', type: 'primary', fun: function(ev, vm) {
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
