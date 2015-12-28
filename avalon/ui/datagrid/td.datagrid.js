define(['avalon', 'mmRequest', 'text!./td.datagrid.html', 'css!./td.datagrid.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:datagrid", {
		//外部属性
		title: '',
		height: '',
		auto: false,         //是否自动加载数据
		checkbox: true,      //是否显示checkbox
		singleSelect: false,
		editable: false,
		limit: 10,           //页大小
		//外部参数
		loadUrl: '',         //加载数据地址
		loadParam: {},
		deleteUrl: '',
		updateUrl: '',
		key: [],
		cols: [],            //列模型
		rows: [],            //行数据
		buttons: [],
		actions: [],         //自定义操作列表
		render: null,
		onloaded: null,
		onreloaded: null,
		onrowclicked: null,
		onrowdbclicked: null,
		onrowselected: null,
		//内部属性
		rowFilters: [],      //行过滤条件
		filterArr: [],
		cells: [],
		selected: 0,         //共选中行数
		lastSelected: -1,    //最后一次选中行
		editIdx: -1,         //编辑行
		isBottom: false,
		$tmpData: {},
		$keyIdx: [],
		_bindFun: null,
		//view属性
		isLoading: false,
		isTotal: false,
		showButtons: false,
		showPanel: false,
		showFilter: false,
		showQuery: false,
		showAction: false,
		allSelected: false,  //当前是否为全选
		scrollLeft: 0,       //横向滚动偏移量
		page: 1,             //当前页
		total: 0,            //全部记录数
		loadInfo: '',
		renderInfo: '',
		//view接口
		toggle: _interface,
		scrollTable: _interface,
		wheelTable: _interface,
		filterRow: _interface,
		clickCheckbox: _interface,
		clickRow: _interface,
		editRow: _interface,
		clickAction: _interface,
		clickCell: _interface,
		loadData: _interface,
		cancelEdit: _interface,
		submitEdit: _interface,
		checkSelected: _interface,
		_trigger: _interface,
		_clearCells: _interface,
		_buildCells: _interface,
		_buildRowObj: _interface,
		_dealSelected: _interface,
		_dealRemove: _interface,
		_ajax: _interface,
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
		//slot
		content: '',
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			//单选设置
			hooks.singleSelect = !hooks.checkbox ? true : hooks.singleSelect;
			//初始化过滤数组
			for(var i=0; i<hooks.cols.length; i++) {
				hooks.rowFilters.push('');
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
			return options; //返回VM的定义对象
		},
		$dispose: function (vm, elem) {
			avalon.unbind(document, 'click', vm._bindFun);
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//内部方法
			vm._trigger = function(ev, type) {
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
					default: break;
				}
			}
			vm._clearCells = function() {
				vm.lastSelected = -1;
				vm.selected = 0;
				vm.allSelected = false;
				vm.cells.removeAll();
			}
			vm._buildCells = function(rows) {
				for(var i = 0; i < rows.length; i ++) {
					var row = rows[i], r = [0];
					if(rows[i].selected == 'true' || rows[i].selected == true) { 
						r[0] = 1;
					}
					for(var j = 0; j < vm.cols.length; j ++) {
						var col = vm.cols[j];
						r.push(row[col.name]);
					}
					vm.cells.push(r);
					if(rows[i].selected == 'true' || rows[i].selected == true) { 
						r[0] = 1;
						vm.allSelected = true;
						if(vm.singleSelect === true && vm.lastSelected >= 0) {
							vm.cells[vm.lastSelected].set(0, 0);
						}else {
							vm.selected ++;
						}
						vm.lastSelected = vm.cells.size() - 1;
					}
				}
			}
			vm._buildRowObj = function(idx) {
				var r = vm.cells[idx], obj = {};
				for(var i = 0; i < vm.cols.length; i ++) {
					var col = vm.cols[i];
					obj[col.name] = r[i + 1]; //第一个元素为selected
				}
				return obj;
			}
			vm._dealSelected = function(ev, idx) {
				if(vm.cells[idx][0] == 1) {
					vm.cells[idx].set(0, 0);
					vm.selected --;
					if(vm.selected == 0) {
						vm.allSelected = false;
					}
					vm.lastSelected = -1;
				}else {
					vm.cells[idx].set(0, 1);
					vm.allSelected = true;
					if(vm.singleSelect === true && vm.lastSelected >= 0) {
						vm.cells[vm.lastSelected].set(0, 0);
					}else {
						vm.selected ++;
					}
					vm.lastSelected = idx;
					vm._trigger(vm._buildRowObj(idx), 'rowselected');
				}
			}
			vm._dealRemove = function(arr) {
				//从大到小排序
				arr.sort(function(a, b){
					return parseInt(b) - parseInt(a);
				});
				for(var i = 0; i < arr.length; i ++) {
					vm.cells.removeAt(arr[i]);
					vm.filterArr.removeAt(arr[i]);
				}
				vm.allSelected = false;
			}
			vm._ajax = function(url, param, successCallback, failCallback) {
				vm.isLoading = true;
				var p = {
					page: vm.page,
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
								vm.renderInfo = vm.render(vm, dat);
							}
						}else {
							vm.loadInfo = '<strong style="color:red">' + dat.rspmsg + '</strong>';
						}
						vm.isLoading = false;
					},
					error: function(dat) {
						vm.loadInfo = '<strong style="color:red;">' + dat.status + '[' + dat.statusText + ']</strong>';
						vm.isLoading = false;
					}
				});
			}
			//view接口
			vm.toggle = function(ev, type, act) {
				switch(type) {
					case 'button':
						vm.showButtons = !vm.showButtons; break;
					case 'panel':
						if(vm.showPanel == false) {
							ev.stopPropagation();
							ev.cancelBubble = true;
						}
						vm.showPanel = !vm.showPanel; break;
					case 'filter':
						vm.showFilter = !vm.showFilter; break;
					case 'query':
						vm.showQuery = !vm.showQuery; break;
					case 'action':
						act == 'in' ? vm.showAction = true : vm.showAction = false; break;
					default:
						break;
				}
			}
			vm.scrollTable = function(ev) {
				vm.scrollLeft = -ev.target.scrollLeft;
				if(ev.target.scrollHeight - ev.target.scrollTop == vm.height) {
					vm.isBottom = true;
				}
			}
			vm.wheelTable = function(ev) {
				if(vm.isBottom && ev.wheelDelta == -120) {
					//vm.loadData();
				}
				vm.isBottom = false;
			}
			//过滤行 idx:列索引 name:列模型name
			vm.filterRow = function(idx, name) {
				vm.rowFilters.set(idx, this.value);
				for(var i = 0; i < vm.cells.size(); i ++) {
					var result = false;
					for(var j = 0; j < vm.cols.length; j ++) {
						if(vm.rowFilters[j] == undefined || vm.rowFilters[j] == '' || vm.cells[i][j + 1].indexOf(vm.rowFilters[j]) >= 0) {
							result = true;
						}else {
							result = false;
							break;
						}
					}
					vm.filterArr.set(i, result)
				}
			}
			vm.clickCheckbox = function(ev, idx) {
				if(idx == -1) {
					if(vm.singleSelect !== true) {
						vm.allSelected = !vm.allSelected;
						for(var i = 0; i < vm.cells.size(); i ++) {
							vm.cells[i].set(0, vm.allSelected ? 1 : 0);
						}
						vm.selected = vm.allSelected ? vm.cells.size() : 0;
					}
				}else {
					vm._dealSelected(ev, idx);
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.clickRow = function(ev, idx) {
				vm._dealSelected(ev, idx);
				vm._trigger(vm._buildRowObj(idx), 'rowclicked');
			}
			vm.editRow = function(ev, idx) {
				var rowObj = vm._buildRowObj(idx);
				if(vm.editable === true) {
					if(idx != vm.editIdx) {
						vm.editIdx = idx;
					}
					vm.$tmpData = rowObj;
				}
				vm._trigger(rowObj, 'rowdbclicked');
			}
			vm.cancelEdit = function(ev, idx) {
				vm.editIdx = -1;
				vm.modifyRow(idx, vm.$tmpData);
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.submitEdit = function(ev, idx) {
				var rowObj = vm._buildRowObj(idx);
				if(vm.updateUrl != '') {
					vm._ajax(vm.updateUrl, rowObj, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							vm.$tmpData = rowObj;
							vm.cancelEdit(ev, idx);
							vm.loadInfo = '<strong style="color:blue;">' + dat.rspmsg + '</strong>';
						}
					});
				}else {
					vm.$tmpData = rowObj;
				}
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.clickAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
				vm.showPanel = false;
				ev.stopPropagation();
				ev.cancelBubble = true;
			}
			vm.clickCell = function(ev, fun, row, col, val) {
				if(typeof fun == 'function') {
					fun(ev, vm, row, col, val);
				}
			}
			//对外方法
			//追加数据
			vm.loadData = function(p) {
				if(vm.loadUrl != '') {
					vm._ajax(vm.loadUrl, p, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							if(dat.rows && dat.rows.length > 0) {
								if(vm.filterArr.size() < vm.cells.size() + dat.rows.length) {
									var n = vm.cells.size() + dat.rows.length - vm.filterArr.size();
									for(var i = 0; i < n; i ++) {
										vm.filterArr.push(true);
									}
								}
								vm._buildCells(dat.rows ? dat.rows : []);
								vm.page ++;
							}
							if(dat.total == vm.cells.size()) {
								vm.isTotal = true;
								vm.loadInfo = '<strong style="color:blue">无更多记录</strong>';
							}else {
								vm.isTotal = false;
								vm.loadInfo = '<strong style="color:blue">数据加载成功</strong>';
							}
							vm.total = dat.total;
							vm._trigger(dat, 'loaded');
						}
					});
				}
			}
			//重新加载数据
			vm.reloadData = function(p) {
				if(vm.loadUrl != '') {
					vm.page = 1;
					vm._ajax(vm.loadUrl, p, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							if(dat.rows && vm.filterArr.size() < dat.rows.length) {
								var n = dat.rows.length - vm.filterArr.size();
								for(var i = 0; i < n; i ++) {
									vm.filterArr.push(true);
								}
							}
							vm._clearCells();
							vm._buildCells(dat.rows ? dat.rows : []);
							if(dat.total == vm.cells.size()) {
								vm.isTotal = true;
								vm.loadInfo = '<strong style="color:blue">无更多记录</strong>';
							}else {
								vm.isTotal = false;
								if(vm.cells.size() == 0) {
									vm.loadInfo = '<strong style="color:red;">未查询到记录</strong>';
								}else {
									vm.loadInfo = '<strong style="color:blue">数据加载成功</strong>';
								}
							}
							vm.total = dat.total;
							vm.page ++;
							vm._trigger(dat, 'reloaded');
						}
					});
				}
			}
			vm.getSelectedIdx = function() {
				var arr = [];
				if(vm.singleSelect === true) {
					if(vm.lastSelected != -1) {
						arr.push(vm.lastSelected);
					}
				}else {
					for(var i = 0; i < vm.cells.size(); i ++) {
						if(vm.cells[i][0] == 1) {
							arr.push(i);
						}
					}
				}
				return arr;
			}
			vm.getSelectedRow = function() {
				var arr = [], arrIdx = vm.getSelectedIdx();
				for(var i = 0; i < arrIdx.length; i ++) {
					arr.push(vm._buildRowObj(arrIdx[i]));
				}
				return arr;
			}
			vm.getRow = function(idxArr) {
				var arr = [];
				for(var i = 0; i < idxArr.length; i ++) {
					arr.push(vm._buildRowObj(idxArr[i]));
				}
				return arr;
			}
			vm.removeRow = function(arr) {
				if(vm.deleteUrl != '' && vm.key.length > 0) {
					var vals = [];
					for(var i = 0; i < arr.length; i ++) {
						var v = '', r = vm.cells[arr[i]];
						for(var j = 0; j < vm.$keyIdx.length; j ++) {
							v += r[j + 1];
						}
						vals.push(v);
					}
					vm._ajax(vm.deleteUrl, {deleteKey: vals.toString()}, function(dat, status, xhr) {
						if(dat.rspcod == '200') {
							vm._dealRemove(arr);
							vm.total -= arr.length;
							vm.loadInfo = '<strong style="color:blue">已删除' + arr.length + '条数据</strong>';
						}
					});
				}else {
					vm._dealRemove(arr);
					vm.loadInfo = '<strong style="color:blue">已删除' + arr.length + '条数据</strong>';
				}
				return arr.length;
			}
			vm.removeSelectedRow = function() {
				var arr = vm.getSelectedIdx();
				return vm.removeRow(arr);
			}
			vm.modifyRow = function(idx, data) {
				if(data) {
					var r = vm.cells[idx];
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
						vm.filterArr.push(true);
					}
					vm._buildCells(arr);
					vm.total = parseInt(vm.total) + parseInt(arr.length);
				}
			}
			//绑定事件
			vm._bindFun = function() {
				if(vm.showPanel == true) {
					vm.showPanel = false;
				}
			}
			avalon.bind(document, 'click', vm._bindFun, false);
		},
		$ready: function (vm) {
			//默认加载数据
			if(vm.rows.length > 0) {
				vm._buildCells(vm.rows);
				for(var i=0; i<vm.cells.size(); i++) {
					vm.filterArr.push(true);
				}
				vm.total = vm.cells.size();
			}
			if(vm.auto === true) {
				vm.reloadData();
			}
    }
	});

	var widget = avalon.components["td:datagrid"];
  widget.regionals = {};
});