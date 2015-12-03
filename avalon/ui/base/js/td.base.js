//author: meizz
//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//支持yyyyMMdd yyyy/MM/dd MM/dd/yyyy等
Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, '');
}
String.prototype.ltrim=function(){
	return this.replace(/(^\s*)/g, '');
}
String.prototype.rtrim=function(){
	return this.replace(/(\s*$)/g, '');
}
String.prototype.toDate = function() {
	var str = this;
	var dt = null;
	try{
		if(str.indexOf('-') != -1) {
			dt = new Date(str.replace(/-/g, '/'));
		}else if(str.indexOf('/') != -1) {
			dt = new Date(str);
		}else if(str.length == 8) {
			dt = new Date(str.substr(0, 4) + '/' + str.substr(4, 2) + '/' + str.substr(6, 2));
		}else if(str.length >= 14 && str.length <= 17) {
			dt = new Date(str.substr(0, 4) + '/' + str.substr(4, 2) + '/' + str.substr(6, 2) + ' ' + str.substr(8, 2) + ':' + str.substr(10, 2) + ':' + str.substr(12, 2));
		}
	}catch(e) {}
	return dt;
}

TD = {
	version: '0.0.1beta',
	util: {
		//生成UUID(id前缀)
		genId: function(prefix) {
			prefix = prefix.toUpperCase() || 'ID'
			return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix);
		}
	},
	validate: function(val, valids) {
		var info = '', reg = null, flag = true, validArr = valids.split(',');
		for(var i = 0; i < validArr.length; i ++) {
			var valid = validArr[i];
			switch(valid) {
				case 'int':
					reg = /^\-?\d+$/;
					info = reg.test(val) ? '' : '请输入正确的整数'; break;
				case '+int':
					reg = /^\+?[1-9][0-9]*$/;
					info = reg.test(val) ? '' : '请输入正确的正整数'; break;
				case '-int':
					reg = /^\-[1-9][0-9]*$/;
					info = reg.test(val) ? '' : '请输入正确的负整数'; break;
				case 'float':
					reg = /^(-?\d+)(\.\d+)?/;
					info = reg.test(val) ? '' : '请输入正确的浮点数'; break;
				case '+float':
					reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
					info = reg.test(val) ? '' : '请输入正确的正浮点数'; break;
				case '-float':
					reg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
					info = reg.test(val) ? '' : '请输入正确的负浮点数'; break;
				case 'ip':
					reg = /^(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/;
					info = reg.test(val) ? '' : 'IP地址有误'; break;
				case 'email':
					reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{2,5}$/;
					info = reg.test(val) ? '' : '电子邮件地址有误'; break;
				case 'phone':
					reg = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
					info = reg.test(val) ? '' : '电话号码有误'; break;
				case 'mobile':
					reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
					info = reg.test(val) ? '' : '手机号码有误'; break;
				default:
					break;
			}
		}
		return info;
	}
}

avalon.config({
	paths: {
		mmRequest: 'ui/base/js/mmRequest.js',
		mmPromise: 'ui/base/js/mmPromise.js',
		mmHistory: 'ui/base/js/mmRouter/mmHistory.js',
		mmRouter: 'ui/base/js/mmRouter/mmRouter.js',
		mmState: 'ui/base/js/mmRouter/mmState.js',
		//TDUI path
		tdAccordion: 'ui/accordion/td.accordion.js',
		tdButton: 'ui/button/td.button.js',
		tdDatagrid: 'ui/datagrid/td.datagrid.js',
		tdDialog: 'ui/dialog/td.dialog.js',
		tdForm: 'ui/form/td.form.js',
		tdNavbar: 'ui/navbar/td.navbar.js',
		tdPanel: 'ui/panel/td.panel.js',
		tdTab: 'ui/tab/td.tab.js',
		tdTree: 'ui/tree/td.tree.js',
		tdCheckboxgroup: 'ui/form/checkbox/td.checkboxgroup.js',
		tdDatepicker: 'ui/form/datepicker/td.datepicker.js',
		tdPassword: 'ui/form/password/td.password.js',
		tdRadiogroup: 'ui/form/radio/td.radiogroup.js',
		tdRate: 'ui/form/rate/td.rate.js',
		tdSelect: 'ui/form/select/td.select.js',
		tdSpinner: 'ui/form/spinner/td.spinner.js',
		tdSwitch: 'ui/form/switch/td.switch.js',
		tdText: 'ui/form/text/td.text.js',
		tdTextarea: 'ui/form/textarea/td.textarea.js'
	},
	maxRepeatSize: 50
});
avalon.library("td", {
	$init: function(){},
	$childReady: function(){},
	$ready: function(){},
	$dispose: function(){}
});

//重写alert, confirm
(function() {
  var hintObj = document.createElement('div');
  hintObj.id = '_td_hint';
  hintObj.className = 'alert alert-warning td_hint';
  hintObj.innerHTML = '<button type="button" class="close" onclick="hint.close()"><span>&times;</span></button><strong></strong>';
  hintObj.style.display = 'none';
  hintObj.onmouseenter = function() {
    if(_hintTime) {
      clearTimeout(_hintTime);
      _hintTime = null;
    }
  }
  document.body.appendChild(hintObj);

	var mask = document.createElement('div');
	mask.id = '_td_mask';
	mask.className = 'modal fade in bg_white opacity';
	document.body.appendChild(mask);

	var confirmObj =  document.createElement('div');
	confirmObj.id = '_td_confirm';
	confirmObj.className = 'modal';
	confirmObj.innerHTML = '<div class="modal-dialog modal-sm"><div class="modal-content">' +
		'<div class="modal-header">' +
			'<h4 class="modal-title">确认</h4>' +
		'</div>' +
		'<div class="modal-body"></div>' +
		'<div class="modal-footer">' +
			'<button type="button" class="btn btn-default waves-effect waves-light">取消</button>' +
			'<button type="button" class="btn btn-primary waves-effect waves-light">确定</button>' +
		'</div>' +
	'</div></div>';
	document.body.appendChild(confirmObj);

	var alertObj = document.createElement('div');
	alertObj.id = '_td_alert';
	alertObj.className = 'modal';
	alertObj.innerHTML = '<div class="modal-dialog modal-sm"><div class="modal-content">' +
		'<div class="modal-header">' +
			'<button type="button" class="close" onclick="alert.close()"><span>&times;</span></button>' +
			'<h4 class="modal-title">提示</h4>' +
		'</div>' +
		'<div class="modal-body"></div>' +
		'<div class="modal-footer">' +
			'<button type="button" class="btn btn-primary waves-effect waves-light" onclick="alert.close()">确定</button>' +
		'</div>' +
	'</div></div>';
	document.body.appendChild(alertObj);
})();

alert = window.alert = function(html) {
	document.getElementById('_td_mask').style.display = 'block';
	var obj = document.getElementById('_td_alert');
	obj.getElementsByClassName('modal-body')[0].innerHTML = html;
	obj.style.display = 'block';
}
alert.close = function() {
	document.getElementById('_td_mask').style.display = 'none';
	document.getElementById('_td_alert').style.display = 'none';
}

confirm = window.confirm = function(html, yCallback, nCallback) {
	var mask = document.getElementById('_td_mask');
	mask.style.display = 'block';
	var obj = document.getElementById('_td_confirm');
	obj.getElementsByClassName('modal-body')[0].innerHTML = html;
	obj.style.display = 'block';
	var btns = obj.getElementsByTagName('button');
	var yBtn = btns[btns.length - 1];
	var nBtn = btns[btns.length - 2];
	yBtn.onclick=function() {
		obj.style.display = 'none';
		mask.style.display = 'none';
		if(typeof yCallback == 'function') yCallback();
  };
	nBtn.onclick=function() {
		obj.style.display = 'none';
		mask.style.display = 'none';
		if(typeof nCallback == 'function') nCallback();
  };
}

var _hintTime = null;
hint = window.hint = function(html, type) {
  if(_hintTime) {
    clearTimeout(_hintTime);
    _hintTime = null;
  }
  var hint = document.getElementById('_td_hint');
  if(type == 'success' || type == 'info' || type == 'warning' || type == 'danger') {
    hint.className = hint.className.replace(hint.className.split(' ')[1], 'alert-' + type);
  }
  hint.getElementsByTagName('strong')[0].innerHTML = html;
  hint.style.display = "block";
  _hintTime = setTimeout('hint.close()', 4000);
}
hint.close = function() {
  var hint = document.getElementById('_td_hint');
  hint.getElementsByTagName('strong')[0].innerHTML = '';
  hint.style.display = "none";
  hint.className = hint.className.replace(hint.className.split(' ')[1], 'alert-warning');
}
