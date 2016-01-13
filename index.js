require(['mmState', 'tdAccordion', 'tdTree', 'tdTab'], function () {
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
			{id:'1-01', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/element/01', children: []},
			{id:'1-02', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/element/02', children: []},
			{id:'1-03', text: 'API[text]', expand:false, checked:false, disabled:false, href:'#!/element/api-text', children: []},
			{id:'1-04', text: 'API[password]', expand:false, checked:false, disabled:false, href:'#!/element/api-password', children: []},
			{id:'1-05', text: 'API[select]', expand:false, checked:false, disabled:false, href:'#!/element/api-select', children: []},
			{id:'1-06', text: 'API[textarea]', expand:false, checked:false, disabled:false, href:'#!/element/api-textarea', children: []},
			{id:'1-07', text: 'API[checkboxgroup]', expand:false, checked:false, disabled:false, href:'#!/element/api-checkboxgroup', children: []},
			{id:'1-08', text: 'API[radiogroup]', expand:false, checked:false, disabled:false, href:'#!/element/api-radiogroup', children: []},
			{id:'1-09', text: 'API[spinner]', expand:false, checked:false, disabled:false, href:'#!/element/api-spinner', children: []},
			{id:'1-10', text: 'API[datepicker]', expand:false, checked:false, disabled:false, href:'#!/element/api-datepicker', children: []},
			{id:'1-11', text: 'API[switch]', expand:false, checked:false, disabled:false, href:'#!/element/api-switch', children: []},
			{id:'1-12', text: 'API[rate]', expand:false, checked:false, disabled:false, href:'#!/element/api-rate', children: []}
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
	var dat4 = [
		{id:'1', text: '增删改查', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-stop', children: [
			{id:'1-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/crud/01', children: []}
		]},
		{id:'2', text: '页面模板', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-stop', children: [
			{id:'2-1', text: 'admin主页', expand:false, checked:false, disabled:false, href:'index_admin.html', children: []},
			{id:'2-2', text: '登录页面', expand:false, checked:false, disabled:false, href:'login.html', children: []}
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
			panels: [{title: '容器类UI'}, {title: '表单类UI'}, {title: '组件类UI'}, {title: '页面模板'}],
			onready: function(elem, vm) {
				vm.setHeight(document.documentElement.clientHeight - 120);
			}
		},
		$index_tree_1: {
			data: dat1
		},
		$index_tree_2: {
			data: dat2
		},
		$index_tree_3: {
			data: dat3
		},
		$index_tree_4: {
			data: dat4
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
			if(arr[i].href != undefined && arr[i].href.split('/')[0] == '#!') {
				var tmp = arr[i].href.split('/');
				var url = '/' + tmp[1] + '/' + tmp[2];
				var tmpUrl = 'pages/' + type +'/' + tmp[1] + '/' + tmp[2] + '/'  + tmp[1] + tmp[2] + '.html';
				var ctrlUrl = ['../pages/' + type + '/' + tmp[1] + '/' + tmp[2] + '/'  + tmp[1] + tmp[2]];
				if(tmp[2].indexOf('api') != -1) {
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
	buildState(dat4, 'template');
	
	avalon.bind(window, 'resize', function() {
		avalon.vmodels['index_acc'].setHeight(document.documentElement.clientHeight - 120);
	});
	
	avalon.state.config({
		onError: function(obj, state) {
			avalon.log('###onError###');
		},
		onBeforeUnload: function(from, to) {
			avalon.log('###onBeforeUnload###');
		},
		onAbort: function(from, to) {
			avalon.log('###onAbort###');
		},
		onUnload: function(from, to) {
			avalon.log('###onAbort###');
		}, 
		onBegin: function(from, to) {
			avalon.log('###onBegin###');
		}, 
		onLoad: function() {
			//vidx.page = mmState.currentState.stateName.split(".")[1];
			avalon.log('###onLoad###');
		},
		onViewEnter: function(newNode, oldNode) {
			avalon.log('###onViewEnter###');
		}
	});

	avalon.history.start({
		//fireAnchor: false
	})
	
	avalon.scan();
});