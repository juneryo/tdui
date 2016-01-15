define(['echarts', 'tdPanel', 'tdTab'], function (echarts) {
	var vhome = avalon.define({
		$id: 'home',
		noties: [
			'2016.01.01-2016.01.03，元旦放假休息3天',
			'2016.02.06，春节放假调休上班',
			'2016.02.07-2016.02.13，春节放假休息7天',
			'2016.02.14，春节放假结束正式上班'
		],
		works: [],
		$home_tab: {
			tabs:[{title:'系统通告'},{title:'代办事项'}]
		},
		$panel_bar_01: {
			onready: function(elem, vm) {
				var option = {
					tooltip : {
						trigger: 'axis',
						axisPointer : {  // 坐标轴指示器，坐标轴触发有效
							type : 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎','百度','谷歌','必应','其他']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis : [{
						type : 'category',
						data : ['周一','周二','周三','周四','周五','周六','周日']
					}],
					yAxis : [{
						type : 'value'
					}],
					series : [{
						name:'直接访问',
						type:'bar',
						data:[320, 332, 301, 334, 390, 330, 320]
					}, {
						name:'邮件营销',
						type:'bar',
						stack: '广告',
						data:[120, 132, 101, 134, 90, 230, 210]
					}, {
						name:'联盟广告',
						type:'bar',
						stack: '广告',
						data:[220, 182, 191, 234, 290, 330, 310]
					}, {
						name:'视频广告',
						type:'bar',
						stack: '广告',
						data:[150, 232, 201, 154, 190, 330, 410]
					}, {
						name:'搜索引擎',
						type:'bar',
						data:[862, 1018, 964, 1026, 1679, 1600, 1570],
						markLine : {
							itemStyle:{
								normal:{
									lineStyle:{
										type: 'dashed'
									}
								}
							},
							data : [
								[{type : 'min'}, {type : 'max'}]
							]
						}
					}, {
						name:'百度',
						type:'bar',
						barWidth : 5,
						stack: '搜索引擎',
						data:[620, 732, 701, 734, 1090, 1130, 1120]
					}, {
						name:'谷歌',
						type:'bar',
						stack: '搜索引擎',
						data:[120, 132, 101, 134, 290, 230, 220]
					}, {
						name:'必应',
						type:'bar',
						stack: '搜索引擎',
						data:[60, 72, 71, 74, 190, 130, 110]
					}, {
						name:'其他',
						type:'bar',
						stack: '搜索引擎',
						data:[62, 82, 91, 84, 109, 110, 120]
					}]
				};
				echarts.init(document.getElementById('home_bar_01')).setOption(option);
			}
		},
		$panel_pie_01: {
			onready: function(elem, vm) {
				var option = {
					tooltip : {
						trigger: 'item',
						formatter: "{a}	{b} : {c} ({d}%)"
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
				echarts.init(document.getElementById('home_pie_01')).setOption(option);
			}
		},
		$panel_pie_02: {
			onready: function(elem, vm) {
				var option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} {b}: {c} ({d}%)"
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
				echarts.init(document.getElementById('home_pie_02')).setOption(option);
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
		$ctrl.$vmodels = [vhome];
	});
});