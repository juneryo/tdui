define(['ui/tree/td.tree'], function () {
	var vtree = avalon.define({
		$id: 'tree02',
		info: '',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$tree_opt: {
			url: 'data/td.tree.json',
			onloaded: function(dat, vm) {
				vtree.info = '数据加载完成' + dat;
			},
			onclicked: function(el, vm) {
				vtree.info = '点击' + el.text;
			},
			onchecked: function(el, vm) {
				vtree.info = '当前选中' + el.id + '['+ el.text + ']  共选中' + vm.getChecked();
			},
			oncollapsed: function(el, vm) {
				vtree.info = '折叠' + el.text;
			},
			onexpanded: function(el, vm) {
				vtree.info = '展开' + el.text;
			}
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