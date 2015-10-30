require(['ui/base/js/mmRouter/mmState', 'ui/accordion/td.accordion', 'ui/tree/td.tree', 'ui/tab/td.tab'], function () {
	var dat1 = [
		{id:'1', text: '面板', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-th-large', children: [
			{id:'1-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/panel/01', children: []},
			{id:'1-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/panel/02', children: []},
			{id:'1-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/panel/api', children: []}
		]},
		{id:'2', text: '折叠面板', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-align-justify', children: [
			{id:'2-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/accordion/01', children: []},
			{id:'2-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/accordion/02', children: []},
			{id:'2-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/accordion/api', children: []}
		]},
		{id:'3', text: '标签页', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-duplicate', children: [
			{id:'3-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/tab/01', children: []},
			{id:'3-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/tab/02', children: []},
			{id:'3-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/tab/api', children: []}
		]},
		{id:'4', text: '弹出框', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-modal-window', children: [
			{id:'4-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/dialog/01', children: []},
			{id:'4-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/dialog/02', children: []},
			{id:'4-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/dialog/api', children: []}
		]}
	];
	var dat2 = [
		{id:'1', text: '表单元素', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-tag', children: [
			{id:'1-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/element/01', children: []},
			{id:'1-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/element/02', children: []}
		]},
		{id:'2', text: '表单', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-list-alt', children: [
			{id:'2-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/form/01', children: []},
			{id:'2-2', text: 'API', expand:false, checked:false, disabled:false, href:'#!/form/api', children: []}
		]}
	];
	var dat3 = [
		{id:'1', text: '按钮', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-stop', children: [
			{id:'1-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/button/01', children: []},
			{id:'1-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/button/02', children: []},
			{id:'1-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/button/api', children: []}
		]},
		{id:'2', text: '导航条', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-th-list', children: [
			{id:'2-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/navbar/01', children: []},
			{id:'2-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/navbar/02', children: []},
			{id:'2-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/navbar/api', children: []}
		]},
		{id:'3', text: '树', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-object-align-left', children: [
			{id:'3-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/tree/01', children: []},
			{id:'3-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/tree/02', children: []},
			{id:'3-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/tree/api', children: []}
		]},
		{id:'4', text: '数据表格', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-th', children: [
			{id:'4-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/datagrid/01', children: []},
			{id:'4-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/datagrid/02', children: []},
			{id:'4-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/datagrid/api', children: []}
		]}
	];
	
	var vidx = avalon.define({
		$id: 'index',
		index_view: '',
		left: '',
		toggleMenu: function(ev) {
			if(vidx.left === 0) {
				vidx.left = '';
			}else {
				vidx.left = 0;
			}
		},
		$index_accordion_opt: {
			panels: [{title: '容器类UI'}, {title: '表单类UI'}, {title: '组件类UI'}, {title: '页面模板'}]
		},
		$index_tree_1: {
			data: dat1
		},
		$index_tree_2: {
			data: dat2
		},
		$index_tree_3: {
			data: dat3
		}
	});
	
	avalon.state('main', {
		controller: 'index',
		url: '/',
		views: {
			'index_view': {
				templateUrl: 'pages/main.html',
				controllerUrl: ['../pages/main'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	});
	
	var buildState = function(arr, type) {
		for(var i = 0; i < arr.length; i ++) {
			if(arr[i].href != undefined) {
				var tmp = arr[i].href.split('/');
				var url = '/' + tmp[1] + '/' + tmp[2];
				var tmpUrl = 'pages/' + type +'/' + tmp[1] + '/' + tmp[2] + '/'  + tmp[1] + tmp[2] + '.html';
				var ctrlUrl = ['../pages/' + type + '/' + tmp[1] + '/' + tmp[2] + '/'  + tmp[1] + tmp[2]];
				if(tmp[2] == 'api') {
					avalon.state(tmp[1], {
						controller: 'index',
						url: url,
						views: {
							'index_view': {
								templateUrl: tmpUrl,
								ignoreChange: function (changeType) {
									if (changeType) return true;
								}
							}
						}
					});
				}else {
					avalon.state(tmp[1], {
						controller: 'index',
						url: url,
						views: {
							'index_view': {
								templateUrl: tmpUrl,
								controllerUrl: ctrlUrl,
								ignoreChange: function (changeType) {
									if (changeType) return true;
								}
							}
						}
					});
				}
			}
			if(arr[i].children != undefined && arr[i].children.length > 0) {
				buildState(arr[i].children, type);
			}
		}
	}
	//构建state
	buildState(dat1, 'container');
	buildState(dat2, 'form');
	buildState(dat3, 'component');
	
	avalon.state.config({
		onError: function() {
			avalon.log(arguments);
		},
		onLoad: function() {
			//vidx.page = mmState.currentState.stateName.split(".")[1];
		},
		onViewEnter: function(newNode, oldNode) {
				avalon.log(newNode);
		}
	});

	avalon.history.start({
		fireAnchor: false
	})
	
	avalon.scan();
});