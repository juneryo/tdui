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
		cols: [],            //列模型
		rows: [],            //行数据
		buttons: [],
		actions: [],         //自定义操作列表
		onloaded: null,
		onreloaded: null,
		onrowclicked: null,
		onrowdbclicked: null,
		onrowselected: null,
		//内部属性
		rowFilters: [],      //行过滤条件
		filterArr: [],
		selected: 0,         //共选中行数
		lastSelected: -1,    //最后一次选中行
		editIdx: -1,         //编辑行
		isBottom: false,
		//editData: {},
		$tmpData: {},
		//view属性
		isLoading: false,
		showButtons: false,
		showPanel: false,
		showFilter: false,
		showQuery: false,
		showAction: false,
		allSelected: false,  //当前是否为全选
		scrollLeft: 0,       //横向滚动偏移量
		page: 1,             //当前页
		loadInfo: '',
		//view接口
		toggle: _interface,
		scrollTable: _interface,
		wheelTable: _interface,
		filterRow: _interface,
		clickCheckbox: _interface,
		clickRow: _interface,
		editRow: _interface,
		clickAction: _interface,
		loadData: _interface,
		cancelEdit: _interface,
		submitEdit: _interface,
		changeCell: _interface,
		checkSelected: _interface,
		//slot
		content: '',
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			//hooks.editable = false;  //1.5.4有bug 屏蔽编辑
			//单选设置
			hooks.singleSelect = !hooks.checkbox ? true : hooks.singleSelect;
			//初始化过滤数组
			for(var i=0; i<hooks.cols.length; i++) {
				hooks.rowFilters.push('');
			}
			return options; //返回VM的定义对象
		},
		$dispose: function (vm, elem) {
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
			vm._dealSelected = function(ev, idx) {
				if(vm.rows[idx].selected == true || vm.rows[idx].selected == 'true') {
					vm.rows[idx].selected = false;
					vm.selected --;
					if(vm.selected == 0) {
						vm.allSelected = false;
					}
					vm.lastSelected = -1;
				}else {
					vm.rows[idx].selected = true;
					vm.allSelected = true;
					if(vm.singleSelect === true && vm.lastSelected >= 0) {
						vm.rows[vm.lastSelected].selected = false;
					}else {
						vm.selected ++;
					}
					vm.lastSelected = idx;
					vm._trigger(vm.rows[idx], 'rowselected');
				}
			}
			vm._dealLoadSelected = function(rows) {
				for(var i = 0; i < rows.length; i ++) {
					vm.rows.push(rows[i]);
					if(rows[i].selected == 'true' || rows[i].selected == true) {
						vm.allSelected = true;
						if(vm.singleSelect === true && vm.lastSelected >= 0) {
							vm.rows[vm.lastSelected].selected = false;
						}else {
							vm.selected ++;
						}
						vm.lastSelected = vm.rows.size() - 1;
					}
				}
			}
			vm._ajax = function(url, param, successCallback, failCallback) {
				vm.isLoading = true;
				var p = {
					page: vm.page,
					limit: vm.limit
				};
				if(param != undefined) {
					for(var k in param) {
						p[k] = param[k];
					}
				}else {
					for(var k in vm.loadParam) {
						p[k] = vm.loadParam[k];
					}
				}
				req.ajax({
					type: 'POST',
					url: url,
					data: p,
					headers: {},
					success: function(data, status, xhr) {
						if(data.rspcod == '200') {
							successCallback(data, status, xhr);
							vm.isLoading = false;
						}else {
							vm.loadInfo = data.rspmsg;
						}
					},
					error: function(data) {
						vm.loadInfo = data.status + '[' + data.statusText + ']';
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
					vm.loadData();
				}
				vm.isBottom = false;
			}
			//过滤行 idx:列索引 name:列模型name
			vm.filterRow = function(idx, name) {
				vm.rowFilters.set(idx, this.value);
				for(var i = 0; i < vm.rows.size(); i ++) {
					var result = false;
					for(var j = 0; j < vm.cols.length; j ++) {
						if(vm.rowFilters[j] == undefined || vm.rowFilters[j] == '' || vm.rows[i][vm.cols[j].name].indexOf(vm.rowFilters[j]) >= 0) {
							result = true;
						}else {
							result = false; 
							break;
						}
					}
					vm.filterArr.set(i, result)
				}
			}
			vm.changeCell = function(ev, rowIdx, colIdx, name) {
				if(rowIdx != vm.$tmpData['idx']) {
					vm.$tmpData = {};
				}
				vm.$tmpData['_idx'] = rowIdx;
				vm.$tmpData[name] = ev.target.value;
			}
			vm.clickCheckbox = function(ev, idx) {
				if(idx == -1) {
					if(vm.singleSelect !== true) {
						vm.allSelected = !vm.allSelected;
						for(var i = 0; i < vm.rows.size(); i ++) {
							vm.rows[i].selected = vm.allSelected;
						}
						vm.selected = vm.allSelected ? vm.rows.size() : 0;
					}
				}else {
					vm._dealSelected(ev, idx);
				}
				ev.cancelBubble = true;
			}
			vm.clickRow = function(ev, idx) {
				vm._dealSelected(ev, idx);
				vm._trigger(vm.rows[idx], 'rowclicked');
			}
			vm.editRow = function(ev, idx) {
				if(vm.editable === true) {
					if(idx != vm.editIdx) {
						vm.editIdx = idx;
					}
				}
				vm._trigger(vm.rows[idx], 'rowdbclicked');
			}
			vm.cancelEdit = function(ev, idx) {
				vm.editIdx = -1;
				ev.cancelBubble = true;
			}
			vm.submitEdit = function(ev, idx) {
				if(idx == vm.$tmpData['_idx']) {
					var obj = vm.rows[idx];
					for(var k in vm.$tmpData) {
						if(obj[k] != undefined) {
							obj[k] = vm.$tmpData[k];
						}
					}
				}
				ev.cancelBubble = true;
			}
			vm.clickAction = function(ev, fun) {
				if(typeof fun == 'function') {
					fun(ev, vm);
				}
			}
			//对外方法
			//追加数据
			vm.loadData = function(p) {
				if(vm.loadUrl != '') {
					vm._ajax(vm.loadUrl, p, function(dat, status, xhr) {
						if(dat.rows.length > 0) {
							if(vm.filterArr.size() < vm.rows.size() + dat.rows.length) {
								var n = vm.rows.size() + dat.rows.length - vm.filterArr.size();
								for(var i = 0; i < n; i ++) {
									vm.filterArr.push(true);
								}
							}
							vm._dealLoadSelected(dat.rows);
							vm.page = Math.ceil(vm.rows.size() / vm.limit);
							vm.loadInfo = '';
						}else {
							vm.loadInfo = '无更多记录';
						}
						vm._trigger(dat, 'loaded');
					});
				}
			}
			//重新加载数据
			vm.reloadData = function(p) {
				if(vm.loadUrl != '') {
					vm.page = 1;
					vm._ajax(vm.loadUrl, p, function(dat, status, xhr) {
						if(vm.filterArr.size() < dat.rows.length) {
							var n = dat.rows.length - vm.filterArr.size();
							for(var i = 0; i < n; i ++) {
								vm.filterArr.push(true);
							}
						}
						vm.rows.removeAll();
						vm.lastSelected = -1;
						vm.selected = 0;
						vm.allSelected = false;
						vm._dealLoadSelected(dat.rows);
						if(vm.rows.size == 0) {
							vm.loadInfo = '未查询到记录';
						}else {
							vm.loadInfo = '';
						}
						vm._trigger(dat, 'reloaded');
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
					for(var i = 0; i < vm.rows.size(); i ++) {
						if(vm.rows[i].selected === true || vm.rows[i].selected === 'true') {
							arr.push(i);
						}
					}
				}
				return arr;
			}
			vm.getSelectedRow = function() {
				var arr = [];
				if(vm.singleSelect === true) {
					if(vm.lastSelected != -1) {
						arr.push(vm.rows[vm.lastSelected]);
					}
				}else {
					for(var i = 0; i < vm.rows.size(); i ++) {
						if(vm.rows[i].selected === true) {
							arr.push(vm.rows[i]);
						}
					}
				}
				return arr;
			}
			vm.removeRow = function(arr) {
				//从大到小排序
				arr.sort(function(a, b){
					return parseInt(b) - parseInt(a);
				});
				for(var i = 0; i < arr.length; i ++) {
					vm.rows.removeAt(arr[i]);
					vm.filterArr.removeAt(arr[i]);
				}
				vm.allSelected = false;
				return arr.length;
			}
			vm.removeSelectedRow = function() {
				var arr = vm.getSelectedIdx();
				return vm.removeRow(arr);
			}
			vm.modifyRow = function(idx, data) {
				if(data) {
					var row = vm.rows[idx];
					for(k in data) {
						if(row[k] != undefined) {
							row[k] = data[k];
						}
					}
				}
			}
			vm.modifySelectRow = function(data) {
				var arr = vm.getSelectedIdx();
				if(arr.length > 0) {
					vm.modifyRow(arr[0], data);
				}
			}
			vm.addRow = function(arr) {
				if(arr && arr.length > 0) {
					for(var i = 0; i < arr.length; i ++) {
						vm.filterArr.push(true);
					}
					vm._dealLoadSelected(arr);
				}
			}
		},
		$ready: function (vm) {
			for(var i=0; i<vm.rows.size(); i++) {
				vm.filterArr.push(true);
			}
			//默认加载数据
			if(vm.auto === true) {
				vm.reloadData();
			}
    }
	});
	
	var widget = avalon.components["td:datagrid"];
  widget.regionals = {};
});