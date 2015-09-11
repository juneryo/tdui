define(['avalon', '../base/js/mmRequest', 'text!./td.datagrid.html', 'css!./td.datagrid.css'], function(avalon, req, template) {
	var _interface = function () {
	};
	avalon.component("td:datagrid", {
		//外部参数
		_title: '',
		_h: '',
		_loadUrl: '',         //加载数据地址
		_checkbox: true,      //是否显示checkbox
		_cols: [],            //列模型
		_rows: [],            //行数据
		_operations: [],      //自定义操作列表
		_editable: true,      //是否可编辑行
		_singleSelect: false,
		//view属性
		initId: new Date().getTime(),
		curPage: 1,            //当前页
		curLimit: 10,          //页大小
		lastSelectIdx: -1,     //最后一次选中的行索引
		oriRowIdx: -1,         //最后编辑行的索引
		oriRowData: [],        //最后编辑行的数据
		rowFilters: [],        //行过滤条件
		isAllSelected: false,  //当前是否为全选
		isOneSelected: false,  //当前是否有一行被选中
		isFiltered: false,     //是否打开了过滤器
		isQuery: false,        //是否打开了查询条件
		isOperate: false,      //是否打开了自定义操作面板
		isNav: false,          //是否打开了导航操作面板
		isLoading: false,      //是否数据读取中
		isEditing: false,      //是否编辑中
		scrollLeft: 0,         //横向滚动距离
		errCod: '',            //错误代码
		errMsg: '',            //错误信息
		//view接口
		filterRow: _interface,
		clickCheckbox: _interface,
		clickRow: _interface,
		editRow: _interface,
		editCancel: _interface,
		deleteRow: _interface,
		toggleFilter: _interface,
		toggleQuery: _interface,
		toggleOperate: _interface,
		toggleNav: _interface,
		doOperate: _interface,
		scrollTable: _interface,
		clearErr: _interface,
		loadData: _interface,
		reloadData: _interface,
		submitEdit: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {	
			var options = avalon.mix(hooks, vmOpts, elemOpts);
			return options; //返回VM的定义对象
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			//过滤行 idx:列索引 name:列模型name
			vm.filterRow = function(idx, name) {
				vm.rowFilters.set(idx, this.value);
				for(var i = 0; i < vm._rows.length; i ++) {
					var result = '';
					for(var j = 0; j < vm._cols.length; j ++) {
						if(vm.rowFilters[j] == undefined || vm.rowFilters[j] == '' || vm._rows[i][vm._cols[j].name].indexOf(vm.rowFilters[j]) >= 0) {
							result = '1';
						}else {
							result = ''; 
							break;
						}
					}
					vm._rows[i].show = result;
				}
			}
			//点击行checkbox响应事件 ev:事件对象 idx:当前行索引
			vm.clickCheckbox = function(ev, idx) {
				//ev.cancelBubble = true;
				vm._rows[idx].selected = this.checked ? '1' : '';
				vm.dealLastSelect(idx);
				vm.lastSelectIdx = this.checked ? idx : -1;
				vm.checkSelectAll(idx);
			}
			//点击行响应事件 ev:事件对象 idx:当前行索引
			vm.clickRow = function(ev, idx) {
				//ev.cancelBubble = true;
				if(vm.oriRowIdx != idx && !vm.isEditing) {
					vm._rows[idx].selected = (vm._rows[idx].selected == '1' ? '' : '1');
					vm.dealLastSelect(idx);
					vm.lastSelectIdx = (vm._rows[idx].selected == '1' ? idx : -1);
					vm.checkSelectAll(idx);
				}
			}
			//校验当前是否所有行都被选中 idx:当前行索引
			vm.checkSelectAll = function(idx) {
				vm.isOneSelected = true;
				vm.isAllSelected = vm._rows.every(function(el) {return el.selected == '1' ? true : false;})
				vm.isOneSelected = false;
			}
			//处理上次被选中行 idx:当前被选中行索引
			vm.dealLastSelect = function(idx) {
				if(vm.lastSelectIdx != -1 && vm._singleSelect && vm.lastSelectIdx != idx) {
					vm._rows[vm.lastSelectIdx].selected = '';
				}
			}
			//保存编辑行的原始数据(用于取消编辑时数据还原) idx:更新行索引
			vm.saveOriData = function(idx) {
				vm.oriRowIdx = idx;
				var row = vm._rows[idx];
				var data = new Object();
				for(var i=0; i<vm._cols.length; i++) {
					data[vm._cols[i].name] = row[vm._cols[i].name];
				}
				vm.oriRowData.removeAll();
				vm.oriRowData.push(data);
				vm._rows[idx].edit = '1';
			}
			//编辑行 idx:当前选中行索引
			vm.editRow = function(idx) {
				if(vm._editable) {
					vm.editCancel();
					vm.isEditing = true;
					vm.saveOriData(idx);
					vm._rows[idx].selected = '1';
					vm.dealLastSelect(idx);
					vm.lastSelectIdx = idx;
				}
			}
			//取消编辑行
			vm.editCancel = function() {
				vm.isEditing = false;
				if(vm.oriRowIdx > -1) {
					vm._rows[vm.oriRowIdx].edit = '';
					var data = vm.oriRowData.pop();
					var row = vm._rows[vm.oriRowIdx];
					for(var i=0; i<vm._cols.length; i++) {
						row[vm._cols[i].name] = data[vm._cols[i].name];
					}
					vm.oriRowIdx = -1;
				}
			}
			//删除行
			vm.deleteRow = function(ev, idx) {
				ev.cancelBubble = true;
				if(confirm('确认要删除第' + (idx + 1) + '行记录吗?')) {
					if(vm.oriRowIdx == idx) {
						vm.oriRowIdx = -1;
					}
					vm._rows.removeAt(idx);
					vm.lastSelectIdx = -1;
					vm.isEditing = false;
				}
			}
			//切换过滤器面板
			vm.toggleFilter = function(ev) {
				vm.isFiltered = !vm.isFiltered;
				ev.cancelBubble = true;
			}
			//切换查询面板
			vm.toggleQuery = function(ev) {
				vm.isQuery = !vm.isQuery;
				ev.cancelBubble = true;
			}
			//切换自定义操作面板
			vm.toggleOperate = function(ev) {
				vm.isOperate = !vm.isOperate;
				ev.cancelBubble = true;
			}
			//切换导航条
			vm.toggleNav = function(ev) {
				vm.isNav = !vm.isNav;
				ev.cancelBubble = true;
			}
			//触发自定义操作
			vm.doOperate = function(ev, fun) {
				fun(ev, vm);
			}
			vm.scrollTable = function(ev) {
				vm.scrollLeft = -ev.target.scrollLeft;
			}
			//发起请求
			vm.doRequest = function(url, callback) {
				vm.isLoading = true;
				req.ajax({
					type: 'POST',
					url: url,
					data: {},
					headers: {},
					success: function(data, status, xhr) {
						if(data.rspcod == '200') {
							vm.clearErr();
							setTimeout(function() {
								callback(data, status, xhr);
								vm.isLoading = false;
							}, 1000)
						}else {
							vm.errCod = data.rspcod;
							vm.errMsg = data.rspmsg;
						}
					},
					error: function(data) {
						vm.errCod = data.status;
						vm.errMsg = data.statusText;
						vm.isLoading = false;
					}
				});
			}
			//清空错误信息
			vm.clearErr = function() {
				vm.errCod = '';
				vm.errMsg = '';
			}
			//追加数据
			vm.loadData = function() {
				if(vm._loadUrl != '') {
					vm.doRequest(vm._loadUrl, function(dat, status, xhr) {
						if(dat.rows.length > 0) {
							vm._rows.pushArray(dat.rows);
							vm.isOneSelected = true;
							vm.isAllSelected = false;
							vm.isOneSelected = false;
							vm.curPage ++;
						}
					});
				}
			}
			//重新加载数据
			vm.reloadData = function() {
				if(vm._loadUrl != '') {
					vm.doRequest(vm._loadUrl, function(dat, status, xhr) {
						vm._rows.removeAll();
						avalon.log(vm._rows);
						vm._rows.pushArray(dat.rows);
						vm.curPage = 1;
						vm.lastSelectIdx = -1;
						vm.isAllSelected = false;
					});
				}
			}
			//提交行编辑 ev:事件对象 idx:编辑行索引
			vm.submitEdit = function(ev, idx) {
				ev.cancelBubble = true;
				vm.saveOriData(idx);
			}
			
			//观测 是否全选属性
			vm.$watch('isAllSelected', function(newVal, oldVal) {
				if(!vm.isOneSelected) {
					for(var i = 0; i < vm._rows.length; i ++) {
						vm._rows[i].selected = newVal;
					}
				}
			});
			//初始化过滤数组
			for(var i=0; i<vm._cols.length; i++) {
				vm.rowFilters.push('');
			}
		},
		$ready: function (vm) {
			//默认加载数据
			vm.reloadData();
      avalon.log("构建完成");
    }
	});
	
	var widget = avalon.components["td:datagrid"];
  widget.regionals = {};
});