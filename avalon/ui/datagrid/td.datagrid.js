define(['avalon', 'mmRequest', 'text!./td.datagrid.html', 'css!./td.datagrid.css'], function(avalon, req, template) {
	var _interface = function () {};
	avalon.component("td:datagrid", {
		//外部标签属性
		title: '',
		height: '',
		auto: false,  //是否自动加载数据
		checkbox: true,  //是否显示checkbox
		singleSelect: false,
		editable: false,
		limit: 10,  //页大小
		//外部配置参数
		loadUrl: '',  //加载数据地址
		loadParam: {},
		deleteUrl: '',
		updateUrl: '',
		key: [],
		cols: [],  //列模型
		rows: [],  //行数据
		buttons: [],
		actions: [],  //自定义操作列表
		render: null,
		onloaded: null,
		onreloaded: null,
		onrowclicked: null,
		onrowdbclicked: null,
		onrowselected: null,
		onready: null,
		//slot
		content: '',
		//内部属性
		$rowFilters: [],  //行过滤条件
		$keyIdx: [],
		$tmpData: {},
		$selected: 0,  //共选中行数
		$lastSelected: -1,  //最后一次选中行
		$isBottom: false,
		//内部接口
		$ajax: _interface,
		$bindFun: _interface,
		$trigger: _interface,
		$clearCells: _interface,
		$buildCells: _interface,
		$buildRowObj: _interface,
		$dealSelected: _interface,
		$dealRemove: _interface,
		//view属性
		_filterArr: [],
		_cells: [],
		_isTotal: false,
		_isLoading: false,
		_showButtons: false,
		_showPanel: false,
		_showFilter: false,
		_showQuery: false,
		_showAction: false,
		_allSelected: false,  //当前是否为全选
		_editIdx: -1,  //编辑行
		_scrollLeft: 0,  //横向滚动偏移量
		_page: 1,  //当前页
		_total: 0,  //全部记录数
		_loadInfo: '',
		_renderInfo: '',
		//view接口
		_toggle: _interface,
		_scrollTable: _interface,
		_wheelTable: _interface,
		_filterRow: _interface,
		_clickCheckbox: _interface,
		_clickRow: _interface,
		_editRow: _interface,
		_clickAction: _interface,
		_clickCell: _interface,
		_cancelEdit: _interface,
		_submitEdit: _interface,
		//对外方法
		reloadData: _interface,
		loadData: _interface,
		getSelectedIdx: _interface,
		getSelectedRow: _interface,
		getRow: _interface,
		removeRow: _interface,
		removeSelectedRow: _interface,
		modifyRow: _interface,
		modifySelectRow: _interface,
		addRow: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			hooks.singleSelect = !hooks.checkbox ? true : hooks.singleSelect;  //单选设置
			//初始化过滤数组
			for(var i=0; i<hooks.cols.length; i++) {
				hooks.$rowFilters.push('');
			}
			//初始化key索引
			for(var i=0; i<hooks.key.length; i++) {
				var k = hooks.key[i];
				for(var j=0; j<hooks.cols.length; j++) {
					var col = hooks.cols[j];
					if(k == col.name) {
						hooks.$keyIdx.push(j); break;
					}
				}
			}
			return options;
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm.$bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type) {
				switch (type) {
					case 'loaded':
						if(typeof vm.onloaded == 'function') {
							vm.onloaded(ev, vm);
						}
						break;
					case 'reloaded':
						if(typeof vm.onreloaded == 'function') {
							vm.onreloaded(ev, vm);
						}
						break;
					case 'rowclicked':
						if(typeof vm.onrowclicked == 'function') {
							vm.onrowclicked(ev, vm);
						}
						break;
					case 'rowdbclicked':
						if(typeof vm.onrowdbclicked == 'function') {
							vm.onrowdbclicked(ev, vm);
						}
						break;
					case 'rowselected':
						if(typeof vm.onrowselected == 'function') {
							vm.onrowselected(ev, vm);
						}
						break;
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm.$bindFun = function() {
				if(vm._showPanel == true) {
					vm._showPanel = false;
				}
			}
			vm.$clearCells = function() {
				vm.$lastSelected = -1;
				vm.$selected = 0;
				vm._allSelected = false;
				vm._cells.removeAll();
			}
			vm.$buildCells = function(rows) {
				for(var i = 0; i < rows.length; i ++) {
					var row = rows[i], r = [0];
					if(rows[i].selected == 'true' || rows[i].selected == true) { 
						r[0] = 1;
					}
					for(var j = 0; j < vm.cols.length; j ++) {
						var col = vm.cols[j];
						r.push(row[col.name]);
					}
					vm._cells.push(r);
					if(rows[i].selected == 'true' || rows[i].selected == true) { 
						r[0] = 1;
						vm._allSelected = true;
						if(vm.singleSelect === true && vm.$lastSelected >= 0) {
							vm._cells[vm.$lastSelected].set(0, 0);
						}else {
							vm.$selected ++;
						}
						vm.$lastSelected = vm._cells.size() - 1;
					}
				}
			}
			vm.$buildRowObj = function(idx) {
				var r = vm._cells[idx], obj = {};
				for(var i = 0; i < vm.cols.length; i ++) {
					var col = vm.cols[i];
					obj[col.name] = r[i + 1]; //第一个元素为selected
				}
				return obj;
			}
			vm.$dealSelected = function(ev, idx) {
				if(vm._cells[idx][0] == 1) {
					vm._cells[idx].set(0, 0);
					vm.$selected --;
					if(vm.$selected == 0) {
						vm._allSelected = false;
					}
					vm.$lastSelected = -1;
				}else {
					vm._cells[idx].set(0, 1);
					vm._allSelected = true;
					if(vm.singleSelect === true && vm.$lastSelected >= 0) {
						vm._cells[vm.$lastSelected].set(0, 0);
					}else {
						vm.$selected ++;
					}
					vm.$lastSelected = idx;
					vm.$trigger(vm.$buildRowObj(idx), 'rowselected');
				}
			}
			vm.$dealRemove = function(arr) {
				arr.sort(function(a, b){
					return parseInt(b) - parseInt(a);  //从大到小排序
				});
				for(var i = 0; i < arr.length; i ++) {
					vm._cells.removeAt(arr[i]);
					vm._filterArr.removeAt(arr[i]);
				}
				vm._allSelected = false;
			}
			vm.$ajax = function(url, param, successCallback, failCallback) {
				vm._isLoading = true;
				var p = {
					page: vm._page,
					limit: vm.limit
				};
				if(param == undefined || param == null) {
					for(var k in vm.loadParam) {
						if(vm.loadParam.hasOwnProperty(k)) {
							p[k] = vm.loadParam[k];
						}
					}
				}else {
					for(var k in param) {
						p[k] = param[k];
					}
					vm.loadParam = param;
				}
				req.ajax({
					type: 'POST',
					url: url,
					data: p,
					headers: {},
					success: function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							successCallback(dat, status, xhr);
							if(typeof vm.render == 'function') {
								vm._renderInfo = vm.render(vm, dat);
							}
						}else {
							vm._loadInfo = '<strong style="color:red">' + dat.rspmsg + '</strong>';
						}
						vm._isLoading = false;
					},
					error: function(dat) {
						vm._loadInfo = '<strong style="color:red;">' + dat.status + '[' + dat.statusText + ']</strong>';
						vm._isLoading = false;
					}
				});
			}
			vm._toggle = function(ev, type, act) {
				switch(type) {
					case 'button':
						vm._showButtons = !vm._showButtons; break;
					case 'panel':
						if(vm._showPanel == false) {
							ev.stopPropagation();
							ev.cancelBubble = true;
						}
						vm._showPanel = !vm._showPanel; break;
					case 'filter':
						vm._showFilter = !vm._showFilter; break;
					case 'query':
						vm._showQuery = !vm._showQuery; break;
					case 'action':
						act == 'in' ? vm._showAction = true : vm._showAction = false; break;
					default:
						break;
				}
			}
			vm._scrollTable = function(ev) {
				vm._scrollLeft = -ev.target.scrollLeft;
				if(ev.target.scrollHeight - ev.target.scrollTop == vm.height) {
					vm.$isBottom = true;
				}
			}
			vm._wheelTable = function(ev) {
				if(vm.$isBottom && ev.wheelDelta == -120) {
					//vm.loadData();
				}
				vm.$isBottom = false;
			}
			//过滤行 idx:列索引 name:列模型name
			vm._filterRow = function(idx, name) {
				vm.$rowFilters[idx] = this.value;
				for(var i = 0; i < vm._cells.size(); i ++) {
					var result = false;
					for(var j = 0; j < vm.cols.length; j ++) {
						if(vm.$rowFilters[j] == undefined || vm.$rowFilters[j] == '' || vm._cells[i][j + 1].indexOf(vm.$rowFilters[j]) >= 0) {
							result = true;
						}else {
							result = false;
							break;
						}
					}
					vm._filterArr.set(i, result)
				}
			}
			vm._clickCheckbox = function(ev, idx) {
				if(idx == -1) {
					if(vm.singleSelect !== true) {
						vm._allSelected = !vm._allSelected;
						for(var i = 0; i < vm._cells.size(); i ++) {
							vm._cells[i].set(0, vm._allSelected ? 1 : 0);
						}
						vm.$selected = vm._allSelected ? vm._cells.size() : 0;
					}
				}else {
					vm.$dealSelected(ev, idx);
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._clickRow = function(ev, idx) {
				vm.$dealSelected(ev, idx);
				vm.$trigger(vm.$buildRowObj(idx), 'rowclicked');
			}
			vm._editRow = function(ev, idx) {
				var rowObj = vm.$buildRowObj(idx);
				if(vm.editable === true) {
					if(idx != vm._editIdx) {
						vm._editIdx = idx;
					}
					vm.$tmpData = rowObj;
				}
				vm.$trigger(rowObj, 'rowdbclicked');
			}
			vm._cancelEdit = function(ev, idx) {
				vm._editIdx = -1;
				vm.modifyRow(idx, vm.$tmpData);
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._submitEdit = function(ev, idx) {
				var rowObj = vm.$buildRowObj(idx);
				if(vm.updateUrl != '') {
					vm.$ajax(vm.updateUrl, rowObj, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							vm.$tmpData = rowObj;
							vm._cancelEdit(ev, idx);
							vm._loadInfo = '<strong style="color:blue;">' + dat.rspmsg + '</strong>';
						}
					});
				}else {
					vm.$tmpData = rowObj;
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._clickAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm._showPanel = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm._clickCell = function(ev, fun, row, col, val) {
				if(typeof fun == 'function') {
					fun(ev, vm, row, col, val);
				}
			}
			//追加数据
			vm.loadData = function(p) {
				if(vm.loadUrl != '') {
					vm.$ajax(vm.loadUrl, p, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							if(dat.rows && dat.rows.length > 0) {
								if(vm._filterArr.size() < vm._cells.size() + dat.rows.length) {
									var n = vm._cells.size() + dat.rows.length - vm._filterArr.size();
									for(var i = 0; i < n; i ++) {
										vm._filterArr.push(true);
									}
								}
								vm.$buildCells(dat.rows ? dat.rows : []);
								vm._page ++;
							}
							if(dat.total == vm._cells.size()) {
								vm._isTotal = true;
								vm._loadInfo = '<strong style="color:blue">无更多记录</strong>';
							}else {
								vm._isTotal = false;
								vm._loadInfo = '<strong style="color:blue">数据加载成功</strong>';
							}
							vm._total = dat.total;
							vm.$trigger(dat, 'loaded');
						}
					});
				}
			}
			//重新加载数据
			vm.reloadData = function(p) {
				if(vm.loadUrl != '') {
					vm._page = 1;
					vm.$ajax(vm.loadUrl, p, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							if(dat.rows && vm._filterArr.size() < dat.rows.length) {
								var n = dat.rows.length - vm._filterArr.size();
								for(var i = 0; i < n; i ++) {
									vm._filterArr.push(true);
								}
							}
							vm.$clearCells();
							vm.$buildCells(dat.rows ? dat.rows : []);
							if(dat.total == vm._cells.size()) {
								vm._isTotal = true;
								vm._loadInfo = '<strong style="color:blue">无更多记录</strong>';
							}else {
								vm._isTotal = false;
								if(vm._cells.size() == 0) {
									vm._loadInfo = '<strong style="color:red;">未查询到记录</strong>';
								}else {
									vm._loadInfo = '<strong style="color:blue">数据加载成功</strong>';
								}
							}
							vm._total = dat.total;
							vm._page ++;
							vm.$trigger(dat, 'reloaded');
						}
					});
				}
			}
			vm.getSelectedIdx = function() {
				var arr = [];
				if(vm.singleSelect === true) {
					if(vm.$lastSelected != -1) {
						arr.push(vm.$lastSelected);
					}
				}else {
					for(var i = 0; i < vm._cells.size(); i ++) {
						if(vm._cells[i][0] == 1) {
							arr.push(i);
						}
					}
				}
				return arr;
			}
			vm.getSelectedRow = function() {
				var arr = [], arrIdx = vm.getSelectedIdx();
				for(var i = 0; i < arrIdx.length; i ++) {
					arr.push(vm.$buildRowObj(arrIdx[i]));
				}
				return arr;
			}
			vm.getRow = function(idxArr) {
				var arr = [];
				for(var i = 0; i < idxArr.length; i ++) {
					arr.push(vm.$buildRowObj(idxArr[i]));
				}
				return arr;
			}
			vm.removeRow = function(arr) {
				if(vm.deleteUrl != '' && vm.key.length > 0) {
					var vals = [];
					for(var i = 0; i < arr.length; i ++) {
						var v = '', r = vm._cells[arr[i]];
						for(var j = 0; j < vm.$keyIdx.length; j ++) {
							v += r[j + 1];
						}
						vals.push(v);
					}
					vm.$ajax(vm.deleteUrl, {deleteKey: vals.toString()}, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							vm.$dealRemove(arr);
							vm._total -= arr.length;
							vm._loadInfo = '<strong style="color:blue">已删除' + arr.length + '条数据</strong>';
						}
					});
				}else {
					vm.$dealRemove(arr);
					vm._loadInfo = '<strong style="color:blue">已删除' + arr.length + '条数据</strong>';
				}
				return arr.length;
			}
			vm.removeSelectedRow = function() {
				var arr = vm.getSelectedIdx();
				return vm.removeRow(arr);
			}
			vm.modifyRow = function(idx, data) {
				if(data) {
					var r = vm._cells[idx];
					for(var i=0; i<vm.cols.length; i++) {
						var col = vm.cols[i];
						if(data[col.name] != undefined) {
							r.set(i + 1, data[col.name])
						}
					}
				}
			}
			vm.modifySelectRow = function(data) {
				var arr = vm.getSelectedIdx();
				for(var i = 0; i < arr.length; i ++) {
					vm.modifyRow(arr[i], data);
				}
			}
			vm.addRow = function(arr) {
				if(arr && arr.length > 0) {
					for(var i = 0; i < arr.length; i ++) {
						vm._filterArr.push(true);
					}
					vm.$buildCells(arr);
					vm._total = parseInt(vm._total) + parseInt(arr.length);
				}
			}
			//绑定事件
			avalon.bind(document, 'click', vm.$bindFun, false);
		},
		$ready: function (vm, elem) {
			//默认加载数据
			if(vm.rows.length > 0) {
				vm.$buildCells(vm.rows);
				for(var i=0; i<vm._cells.size(); i++) {
					vm._filterArr.push(true);
				}
				vm._total = vm._cells.size();
			}
			if(vm.auto === true) {
				vm.reloadData();
			}
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:datagrid"];
  widget.regionals = {};
});