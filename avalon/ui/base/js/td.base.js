//author: meizz
//��Date����չ���� Date ת��Ϊָ����ʽ��String   
//��(M)����(d)��Сʱ(h)����(m)����(s)������(q) ������ 1-2 ��ռλ����   
//��(y)������ 1-4 ��ռλ��������(S)ֻ���� 1 ��ռλ��(�� 1-3 λ������)   
//���ӣ�   
//(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//֧��yyyyMMdd yyyy/MM/dd MM/dd/yyyy��
Date.prototype.format = function(fmt) {
  var o = {   
    "M+" : this.getMonth()+1,                 //�·�   
    "d+" : this.getDate(),                    //��   
    "h+" : this.getHours(),                   //Сʱ   
    "m+" : this.getMinutes(),                 //��   
    "s+" : this.getSeconds(),                 //��   
    "q+" : Math.floor((this.getMonth()+3)/3), //����   
    "S"  : this.getMilliseconds()             //����   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}


//����UUID
function genId(prefix) {
	prefix = prefix.toUpperCase() || 'ID'
	return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix);
}

avalon.config({
	paths: {
		mmRequest: './mmRequest.js',
		mmPromise: './mmPromise.js'
	},
	lmaxRepeatSize: 50
});
if(avalon.library == Function) {
	avalon.library("td", {
		$init: function(){},
		$childReady: function(){},
		$ready: function(){},
		$dispose: function(){}
	});
}