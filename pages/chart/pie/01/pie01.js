define(['echarts', 'tdPanel'], function (echarts) {
	var vpie = avalon.define({
		$id: 'pie01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$panel_opt1: {
			onready: function(elem, vm) {
				option = {
					title: {
						text: '自定义饼状图',
						left: 'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					series : [{
						name:'访问来源',
						type:'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:[
							{value:335, name:'直接访问'},
							{value:310, name:'邮件营销'},
							{value:274, name:'联盟广告'},
							{value:235, name:'视频广告'},
							{value:400, name:'搜索引擎'}
						].sort(function (a, b) { return a.value - b.value}),
						roseType: 'angle'
					}]
				};
				var myChart = echarts.init(document.getElementById('pie_01'));
				myChart.setOption(option);
			}
		},
		$panel_opt2: {
			onready: function(elem, vm) {
				option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
					},
					series: [{
						name:'访问来源',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						data:[
							{value:335, name:'直接访问'},
							{value:310, name:'邮件营销'},
							{value:234, name:'联盟广告'},
							{value:135, name:'视频广告'},
							{value:1548, name:'搜索引擎'}
						]
					}]
				};
				var myChart = echarts.init(document.getElementById('pie_02'));
				myChart.setOption(option);
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
		$ctrl.$vmodels = [vpie];
	});
});