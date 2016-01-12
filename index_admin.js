require(['mmState', 'tdTree', 'tdTab'], function () {
	var dat = [
		{id:'1', text: '面板', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-th-large', children: [
			{id:'1-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/container/panel/01', children: []},
			{id:'1-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/container/panel/02', children: []},
			{id:'1-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/container/panel/api', children: []}
		]},
		{id:'2', text: '折叠面板', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-align-justify', children: [
			{id:'2-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/container/accordion/01', children: []},
			{id:'2-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/container/accordion/02', children: []},
			{id:'2-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/container/accordion/api', children: []}
		]},
		{id:'3', text: '标签页', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-duplicate', children: [
			{id:'3-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/container/tab/01', children: []},
			{id:'3-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/container/tab/02', children: []},
			{id:'3-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/container/tab/api', children: []}
		]},
		{id:'4', text: '弹出框', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-modal-window', children: [
			{id:'4-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/container/dialog/01', children: []},
			{id:'4-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/container/dialog/02', children: []},
			{id:'4-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/container/dialog/api', children: []}
		]},
		{id:'5', text: '表单元素', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-tag', children: [
			{id:'5-01', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/form/element/01', children: []},
			{id:'5-02', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/form/element/02', children: []},
			{id:'5-03', text: 'API[text]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-text', children: []},
			{id:'5-04', text: 'API[password]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-password', children: []},
			{id:'5-05', text: 'API[select]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-select', children: []},
			{id:'5-06', text: 'API[textarea]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-textarea', children: []},
			{id:'5-07', text: 'API[checkboxgroup]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-checkboxgroup', children: []},
			{id:'5-08', text: 'API[radiogroup]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-radiogroup', children: []},
			{id:'5-09', text: 'API[spinner]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-spinner', children: []},
			{id:'5-10', text: 'API[datepicker]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-datepicker', children: []},
			{id:'5-11', text: 'API[switch]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-switch', children: []},
			{id:'5-12', text: 'API[rate]', expand:false, checked:false, disabled:false, href:'#!/form/element/api-rate', children: []}
		]},
		{id:'6', text: '表单', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-list-alt', children: [
			{id:'6-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/form/form/01', children: []},
			{id:'6-2', text: 'API', expand:false, checked:false, disabled:false, href:'#!/form/form/api', children: []}
		]},
		{id:'7', text: '按钮', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-stop', children: [
			{id:'7-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/component/button/01', children: []},
			{id:'7-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/component/button/02', children: []},
			{id:'7-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/component/button/api', children: []}
		]},
		{id:'8', text: '导航条', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-th-list', children: [
			{id:'8-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/component/navbar/01', children: []},
			{id:'8-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/component/navbar/02', children: []},
			{id:'8-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/component/navbar/api', children: []}
		]},
		{id:'9', text: '树', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-object-align-left', children: [
			{id:'9-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/component/tree/01', children: []},
			{id:'9-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/component/tree/02', children: []},
			{id:'9-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/component/tree/api', children: []}
		]},
		{id:'10', text: '数据表格', expand:true, checked:false, disabled:false, icon:'glyphicon glyphicon-th', children: [
			{id:'10-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/component/datagrid/01', children: []},
			{id:'10-2', text: '示例02', expand:false, checked:false, disabled:false, href:'#!/component/datagrid/02', children: []},
			{id:'10-3', text: 'API', expand:false, checked:false, disabled:false, href:'#!/component/datagrid/api', children: []}
		]},
		{id:'11', text: '增删改查', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-stop', children: [
			{id:'11-1', text: '示例01', expand:false, checked:false, disabled:false, href:'#!/template/crud/01', children: []}
		]},
		{id:'12', text: '页面模板', expand:true, checked:true, disabled:true, icon:'glyphicon glyphicon-stop', children: [
			{id:'12-1', text: '传统主页', expand:false, checked:false, disabled:false, href:'/tdui', children: []},
			{id:'12-2', text: '登录页面', expand:false, checked:false, disabled:false, href:'login.html', children: []}
		]}
	];
	
	var vidx = avalon.define({
		$id: 'index',
		index_view: '',
		left: '',
		height: document.documentElement.clientHeight - 100,
		toggleMenu: function(ev) {
			if(vidx.left === 0) {
				vidx.left = '';
			}else {
				vidx.left = 0;
			}
		},
		path: '',
		login_user: 'admin',
		login_role: '管理员',
		logout: function(ev) {
			TD.confirm('确认要退出系统吗？', function() {}, function() {
				TD.hint('取消退出');
			});
		},
		$index_tree: {
			data: dat
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
	
	var buildState = function(arr) {
		for(var i = 0; i < arr.length; i ++) {
			if(arr[i].href != undefined && arr[i].href.split('/')[0] == '#!') {
				var tmp = arr[i].href.split('/');
				var url = '/' + tmp[1] + '/' + tmp[2] + '/' + tmp[3];
				var tmpUrl = 'pages/' + tmp[1] +'/' + tmp[2] + '/' + tmp[3] + '/'  + tmp[2] + tmp[3] + '.html';
				var ctrlUrl = ['../pages/' + tmp[1] + '/' + tmp[2] + '/' + tmp[3] + '/'  + tmp[2] + tmp[3]];
				if(tmp[3].indexOf('api') != -1) {
					avalon.state(tmp[2], {
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
					avalon.state(tmp[2], {
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
				buildState(arr[i].children);
			}
		}
	}
	//构建state
	buildState(dat);
	
	avalon.bind(window, 'resize', function() {
		vidx.height = document.documentElement.clientHeight - 100;
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
			var url = mmState.currentState.url
			vidx.path = url == '/' ? '/HOME' : url;
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