define(['echarts', 'tdPanel'], function (echarts) {
	var vbar = avalon.define({
		$id: 'bar01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$panel_opt1: {
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
				var myChart = echarts.init(document.getElementById('bar_01'));
				myChart.setOption(option);
			}
		},
		$panel_opt2: {
			onready: function(elem, vm) {
				var option = {
					tooltip : {
						trigger: 'axis'
					},
					calculable : true,
					legend: {
						data:['蒸发量','降水量','平均温度']
					},
					xAxis : [{
						type : 'category',
						data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
					}],
					yAxis : [{
						type : 'value',
						name : '水量',
						min: 0,
						max: 250,
						interval: 50,
						axisLabel : {
								formatter: '{value} ml'
						}
					}, {
						type : 'value',
						name : '温度',
						min: 0,
						max: 25,
						interval: 5,
						axisLabel : {
							formatter: '{value} °C'
						}
					}],
					series : [{
						name:'蒸发量',
						type:'bar',
						data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
					}, {
						name:'降水量',
						type:'bar',
						data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
					}, {
						name:'平均温度',
						type:'line',
						yAxisIndex: 1,
						data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
					}]
				};
				var myChart = echarts.init(document.getElementById('bar_02'));
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
		$ctrl.$vmodels = [vbar];
	});
});