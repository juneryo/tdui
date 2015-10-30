define(['ui/tree/td.tree'], function () {
	var vtree = avalon.define({
		$id: 'tree01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$tree_opt: {
			data: [
				{id:'1', text: '菜单01', expand:true, disabled:false, children: [
					{id:'1-1', text: '菜单01-01', expand:false, checked:false, disabled:false, children: []},
					{id:'1-2', text: '菜单01-02', expand:true, checked:false, disabled:false, children: [
						{id:'1-2-1', text: '菜单01-02-01', expand:false, checked:false, disabled:false, children: []}
					]},
					{id:'1-3', text: '菜单01-03', expand:true, disabled:false, children: [
						{id:'1-3-1', text: '菜单01-03-01', expand:false, checked:false, disabled:false, children: []},
						{id:'1-3-2', text: '菜单01-03-02', expand:false, disabled:false, children: []}
					]}
				]},
				{id:'2', text: '菜单02', expand:true, checked:false, disabled:false, children: [
					{id:'2-1', text: '菜单02-01', expand:false, checked:false, disabled:false, children: []},
					{id:'2-2', text: '菜单02-02', expand:false, checked:false, disabled:false, children: []},
					{id:'2-3', text: '菜单02-03', expand:false, checked:false, disabled:false, children: [
						{id:'2-3-1', text: '菜单02-03-01', expand:false, checked:false, disabled:false, children: []},
						{id:'2-3-2', text: '菜单02-03-02', expand:false, checked:false, disabled:false, children: [
							{id:'2-3-2-1', text: '菜单02-03-02-01', expand:false, checked:false, disabled:false, children: []},
							{id:'2-3-2-2', text: '菜单02-03-02-02', expand:false, checked:false, disabled:false, children: []}
						]}
					]}
				]},
				{id:'3', text: '菜单03', expand:false, checked:false, disabled:false, children: []},
				{id:'4', text: '菜单04', expand:false, checked:false, disabled:false, children: []}
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
		$ctrl.$vmodels = [vtree];
	});
});