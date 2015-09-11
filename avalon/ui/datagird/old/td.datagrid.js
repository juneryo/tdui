define(['avalon', '../../base/mmRequest', 'text!./td.datagrid.html', 'css!./td.datagrid.css'], function(avalon, req, template) {
	var widget = avalon.ui.datagrid = function(element, data, vmodels) {
		var options = data.datagridOptions;  //必须为UI名+Options(datagrid + Options)
		options.template = options.getTemplate(template, options);
		var vm = avalon.define({
			initId: new Date().getTime(),
			$id: data.datagridId,             //必须为UI名+Id(TdDataGrid + Id)
			$inited: false,
			$_title: options.title,
			$_h: options.h,
			_loadUrl: options.loadUrl,        //加载数据地址
			_checkbox: options.checkbox,      //是否显示checkbox
			_cols: options.cols,              //列模型
			_rows: options.rows,              //行数据
			_operations: options.operations,  //自定义操作列表
			_editable: options.editable,      //是否可编辑行
			_singleSelect: options.singleSelect,
			curPage: 1,            //当前页
			curLimit: 10,          //页大小
			lastSelectIdx: -1,
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
			//过滤行 idx:列索引 name:列模型name
			filterRow: function(idx, name) {
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
			},
			//点击行checkbox响应事件 ev:事件对象 idx:当前行索引
			clickCheckbox: function(ev, idx) {
				//ev.cancelBubble = true;
				vm._rows[idx].selected = this.checked ? '1' : '';
				vm.dealLastSelect(idx);
				vm.lastSelectIdx = this.checked ? idx : -1;
				vm.checkSelectAll(idx);
			},
			//点击行响应事件 ev:事件对象 idx:当前行索引
			clickRow: function(ev, idx) {
				//ev.cancelBubble = true;
				if(vm.oriRowIdx != idx && !vm.isEditing) {
					vm._rows[idx].selected = (vm._rows[idx].selected == '1' ? '' : '1');
					vm.dealLastSelect(idx);
					vm.lastSelectIdx = (vm._rows[idx].selected == '1' ? idx : -1);
					vm.checkSelectAll(idx);
				}
			},
			//校验当前是否所有行都被选中 idx:当前行索引
			checkSelectAll: function(idx) {
				vm.isOneSelected = true;
				vm.isAllSelected = vm._rows.every(function(el) {return el.selected == '1' ? true : false;})
				vm.isOneSelected = false;
			},
			//处理上次被选中行 idx:当前被选中行索引
			dealLastSelect: function(idx) {
				if(vm.lastSelectIdx != -1 && vm._singleSelect && vm.lastSelectIdx != idx) {
					vm._rows[vm.lastSelectIdx].selected = '';
				}
			},
			//保存编辑行的原始数据(用于取消编辑时数据还原) idx:更新行索引
			saveOriData: function(idx) {
				vm.oriRowIdx = idx;
				var row = vm._rows[idx];
				var data = new Object();
				for(var i=0; i<vm._cols.length; i++) {
					data[vm._cols[i].name] = row[vm._cols[i].name];
				}
				vm.oriRowData.removeAll();
				vm.oriRowData.push(data);
				vm._rows[idx].edit = '1';
			},
			//编辑行 idx:当前选中行索引
			editRow: function(idx) {
				if(vm._editable) {
					vm.editCancel();
					vm.isEditing = true;
					vm.saveOriData(idx);
					vm._rows[idx].selected = '1';
					vm.dealLastSelect(idx);
					vm.lastSelectIdx = idx;
				}
			},
			//取消编辑行
			editCancel: function() {
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
			},
			//删除行
			deleteRow: function(ev, idx) {
				ev.cancelBubble = true;
				if(confirm('确认要删除第' + (idx + 1) + '行记录吗?')) {
					if(vm.oriRowIdx == idx) {
						vm.oriRowIdx = -1;
					}
					vm._rows.removeAt(idx);
					vm.lastSelectIdx = -1;
					vm.isEditing = false;
				}
			},
			//切换过滤器面板
			toggleFilter: function(ev) {
				vm.isFiltered = !vm.isFiltered;
				ev.cancelBubble = true;
			},
			//切换查询面板
			toggleQuery: function(ev) {
				vm.isQuery = !vm.isQuery;
				ev.cancelBubble = true;
			},
			//切换自定义操作面板
			toggleOperate: function(ev) {
				vm.isOperate = !vm.isOperate;
				ev.cancelBubble = true;
			},
			//切换导航条
			toggleNav: function(ev) {
				vm.isNav = !vm.isNav;
				ev.cancelBubble = true;
			},
			//触发自定义操作
			doOperate: function(ev, fun) {
				fun(ev, vm);
			},
			scrollTable: function(ev) {
				vm.scrollLeft = -ev.target.scrollLeft;
			},
			//发起请求
			doRequest: function(url, callback) {
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
				})
			},
			//清空错误信息
			clearErr: function() {
				vm.errCod = '';
				vm.errMsg = '';
			},
			//追加数据
			loadData: function() {
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
			},
			//重新加载数据
			reloadData: function() {
				if(vm._loadUrl != '') {
					vm.doRequest(vm._loadUrl, function(dat, status, xhr) {
						vm._rows.removeAll();
						vm._rows.pushArray(dat.rows);
						vm.curPage = 1;
						vm.lastSelectIdx = -1;
						vm.isAllSelected = false;
					});
				}
			},
			//提交行编辑 ev:事件对象 idx:编辑行索引
			submitEdit: function(ev, idx) {
				ev.cancelBubble = true;
				vm.saveOriData(idx);
			},
			$init: function(continueScan) {
				if (vm.$inited) return;
				vm.$inited = true;
				var pageHTML = options.template;
				element.style.display = "none";
				element.innerHTML = pageHTML;
				element.style.display = "block";
				if(continueScan){
					continueScan();
				}else{
					avalon.scan(element, _vmodels)
					if (typeof options.onInit === "function") {
							options.onInit.call(element, vmodel, options, vmodels)
					}
				}
				//初始化过滤数组
				for(var i=0; i<vm._cols.length; i++) {
					vm.rowFilters.push('');
				}
				//默认加载数据
				vm.reloadData();
			},
			$remove: function() {
				element.innerHTML = element.textContent = ""
			}
		});
		//观测 是否全选属性
		vm.$watch('isAllSelected', function(newVal, oldVal) {
			if(!vm.isOneSelected) {
				for(var i = 0; i < vm._rows.length; i ++) {
					vm._rows[i].selected = newVal;
				}
			}
		});
		return vm;
	}
	
	widget.vertion = 0.1;
	widget.defaults = {
		loadUrl: '',
		h: '',
		checkbox: true,
		singleSelect: false,
		cols: [],
		rows: [],
		operations: [],
		title: '',
		editable: true,
		onInit: avalon.noop, //@optMethod onInit(vmodel, options, vmodels) 完成初始化之后的回调,call as element's method
		getTemplate: function(tmpl, opts, tplName) {
			return tmpl;
		}, //@optMethod getTemplate(tpl, opts, tplName) 定制修改模板接口
		$author: 'yu_jun@tangdi.net'
	}
});