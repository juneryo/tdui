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
//判断是否为ie7 8 9
var _IEversion = (function(){
    var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
    return v > 4 ? v : false ;
}());
//重写alert, confirm
var _hintEle, _maskEle, _confirmEle, _alertEle, _hintTime;
(function() {
  _hintEle = document.createElement('div');
  _hintEle.id = '_td_hint';
  _hintEle.className = 'alert alert-warning td_hint';
  _hintEle.innerHTML = '<button type="button" class="close" onclick="TD.close(event, \'hint\')"><span>&times;</span></button><strong></strong>';
  _hintEle.style.display = 'none';
  _hintEle.onmouseenter = function() {
    if(_hintTime) {
      clearTimeout(_hintTime);
      _hintTime = null;
    }
  }
  document.body.appendChild(_hintEle);

	_maskEle = document.createElement('div');
	_maskEle.id = '_td_mask';
	_maskEle.className = 'modal fade in bg_white opacity';
	_maskEle.onclick = function(e) {
		var ev = e ? e : window.event;
		if(ev.stopPropagation){
			ev.stopPropagation();    
		}else {
			ev.cancelBubble = true;
		}
	}
	document.body.appendChild(_maskEle);

	_confirmEle =  document.createElement('div');
	_confirmEle.id = '_td_confirm';
	_confirmEle.className = 'modal';
	_confirmEle.innerHTML = '<div class="modal-dialog modal-sm"><div class="modal-content">' +
		'<div class="modal-header">' +
			'<h4 class="modal-title">确认</h4>' +
		'</div>' +
		'<div class="modal-body"></div>' +
		'<div class="modal-footer">' +
			'<button type="button" class="btn btn-default waves-effect waves-light">取消</button>' +
			'<button type="button" class="btn btn-primary waves-effect waves-light">确定</button>' +
		'</div>' +
	'</div></div>';
	_confirmEle.onclick = function(e) {
		var ev = e ? e : window.event;
		if(ev.stopPropagation){
			ev.stopPropagation();    
		}else {
			ev.cancelBubble = true;
		}
	}
	document.body.appendChild(_confirmEle);

	_alertEle = document.createElement('div');
	_alertEle.id = '_td_alert';
	_alertEle.className = 'modal';
	_alertEle.innerHTML = '<div class="modal-dialog modal-sm"><div class="modal-content">' +
		'<div class="modal-header">' +
			'<button type="button" class="close" onclick="TD.close(event, \'alert\')"><span>&times;</span></button>' +
			'<h4 class="modal-title">提示</h4>' +
		'</div>' +
		'<div class="modal-body"></div>' +
		'<div class="modal-footer">' +
			'<button type="button" class="btn btn-primary waves-effect waves-light" onclick="TD.close(event, \'alert\')">确定</button>' +
		'</div>' +
	'</div></div>';
	_alertEle.onclick = function(e) {
		var ev = e ? e : window.event;
		if(ev.stopPropagation){
			ev.stopPropagation();    
		}else {
			ev.cancelBubble = true;
		}
	}
	document.body.appendChild(_alertEle);
})();
//TD
var TD = {
	version: '0.0.1',
	util: {
		genId: function(prefix) {
			prefix = prefix.toUpperCase() || 'ID'
			return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix);
		}
	},
	css: {
		computedCss: function(elem, prop) {
			if(document.documentElement.currentStyle) {
				return elem.currentStyle[prop];    
			}else if(document.defaultView && document.defaultView.getComputedStyle) {
				return document.defaultView.getComputedStyle(elem, null)[prop];  
			}else {
				return null;
			}
		},
		//获取元素大小(elem, width/height, padding/margin/border)
		getSize: function(elem, prop, extra) {
			//Start with offset property
			var val = prop === 'width' ? elem.offsetWidth : elem.offsetHeight, i = prop === 'width' ? 1 : 0, len = 4;
			var cssExpand = [ 'Top', 'Right', 'Bottom', 'Left' ];
			var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i;
			if (val > 0) {
				if (extra !== 'border') {
					for (; i < len; i += 2) {
						if (!extra) {
							val -= parseFloat(elem.style['padding' + cssExpand[ i ]]) || 0;
						}
						if (extra === 'margin') {
							val += parseFloat(elem.style[extra + cssExpand[ i ]]) || 0;
						} else{
							val -= parseFloat( elem.style["border" + cssExpand[ i ] + "Width"]) || 0;
						}
					}
				}
				return val;
			}
			// Fall back to computed then uncomputed css if necessary
			val = TD.css.computedCss(elem, prop);
			if (val < 0 || val == null) {
				val = elem.style[prop];
			}
			// Computed unit is not pixels. Stop here and return.
			if (rnumnonpx.test(val)) {
				return parseFloat(val);
			}
			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
			// Add padding, border, margin
			if(extra) {
				for (; i < len; i += 2) {
					val += parseFloat(elem.style['padding' + cssExpand[ i ]]) || 0;
					if (extra !== 'padding') {
						val += parseFloat( elem.style["border" + cssExpand[ i ] + "Width"] ) || 0;
					}
					if (extra === 'margin') {
						val += parseFloat( elem.style[extra + cssExpand[ i ]] ) || 0;
					}
				}
      }
      return val;
		}
	},
	hint: function(html, type) {
		if(_hintTime) {
			clearTimeout(_hintTime); _hintTime = null;
		}
		avalon(_hintEle).removeClass('fadeOut animated');
		avalon(_hintEle).addClass('fadeInUp animated');
		_hintEle.className = _hintEle.className.replace(_hintEle.className.split(' ')[1], 'alert-warning');
		if(type == 'success' || type == 'info' || type == 'warning' || type == 'danger') {
			_hintEle.className = _hintEle.className.replace(_hintEle.className.split(' ')[1], 'alert-' + type);
		}
		_hintEle.getElementsByTagName('strong')[0].innerHTML = html;
		_hintEle.style.display = "block";
		_hintTime = setTimeout(function() {
			TD.getElementsByClassName('close', _hintEle)[0].click();
		}, 4000);
	},
	alert: function(html) {
		avalon(_alertEle).removeClass('zoomOut animated');
		avalon(_alertEle).addClass('zoomIn animated');
		_maskEle.style.display = 'block';
		TD.getElementsByClassName('modal-body', _alertEle)[0].innerHTML = html;
		_alertEle.style.display = 'block'
	},
	confirm: function(html, yCallback, nCallback) {
		avalon(_confirmEle).removeClass('zoomOut animated');
		avalon(_confirmEle).addClass('zoomIn animated');
		_maskEle.style.display = 'block';
		TD.getElementsByClassName('modal-body', _confirmEle)[0].innerHTML = html;
		_confirmEle.style.display = 'block';
		var btns = _confirmEle.getElementsByTagName('button');
		var yBtn = btns[btns.length - 1];
		var nBtn = btns[btns.length - 2];
		yBtn.onclick=function(e) {
			avalon(_confirmEle).removeClass('zoomIn animated');
			avalon(_confirmEle).addClass('zoomOut animated');
			_maskEle.style.display = 'none';
			if(typeof _IEversion == 'number' && _IEversion < 10) {
				_confirmEle.style.display = 'none';
			}else {
				setTimeout(function() {_confirmEle.style.display = 'none';}, 300);
			}
			if(typeof yCallback == 'function') yCallback();
		};
		nBtn.onclick=function(e) {
			avalon(_confirmEle).removeClass('zoomIn animated');
			avalon(_confirmEle).addClass('zoomOut animated');
			_maskEle.style.display = 'none';
			if(typeof _IEversion == 'number' && _IEversion < 10) {
				_confirmEle.style.display = 'none';
			}else {
				setTimeout(function() {_confirmEle.style.display = 'none';}, 300);
			}
			if(typeof nCallback == 'function') nCallback();
		};
	},
	close: function(e, typ) {
		switch (typ) {
			case 'hint':
				avalon(_hintEle).removeClass('fadeInUp animated');
				avalon(_hintEle).addClass('fadeOut animated');
				if(typeof _IEversion == 'number' && _IEversion < 10) {
					_hintEle.style.display = 'none';
				}
				_hintEle.getElementsByTagName('strong')[0].innerHTML = '';
				break;
			case 'alert':
				avalon(_alertEle).removeClass('zoomIn animated');
				avalon(_alertEle).addClass('zoomOut animated');
				_maskEle.style.display = 'none';
				if(typeof _IEversion == 'number' && _IEversion < 10) {
					_alertEle.style.display = 'none';
				}else {
					setTimeout(function() {_alertEle.style.display = 'none';}, 300);
				}
				break;
		}
	},
	hideElement: function(elem) {
		elem.style.display = 'none';
	},
	showElement: function(elem, dis) {
		elem.style.display = dis ? dis : 'block';
	},
	getElementsByClassName: function(cls , par) {
		if(!document.getElementsByClassName) {
			var all = (par || document).getElementsByTagName('*');
			var result = [];
			for(var i=0; i<all.length; i++){
				var el = all[i];
				if(el.nodeType == 1 && el.className && el.className.indexOf(cls) > -1){
					result.push(el);
				}
			}
			return result;
		}else {
			return (par || document).getElementsByClassName(cls);
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
//avalon config
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
		tdTextarea: 'ui/form/textarea/td.textarea.js',
		//图表
		echarts: 'ui/base/js/echarts.common.min.js',
		//jquery及插件
		jquery: 'ui/base/js/jquery.min.js',
		webupload: 'ui/base/js/webuploader.min.js'
	},
	maxRepeatSize: 50
});
//avalon effect
if(typeof _IEversion == 'number' && _IEversion < 10) {
	avalon.effect('flipX-visible', {enter: function(elem, done) {TD.showElement(elem);},leave: function(elem, done) {TD.hideElement(elem);}});
	avalon.effect('flipY-visible', {enter: function(elem, done) {TD.showElement(elem);},leave: function(elem, done) {TD.hideElement(elem);}});
	avalon.effect('zoom-visible', {enter: function(elem, done) {TD.showElement(elem);},leave: function(elem, done) {TD.hideElement(elem);}});
	avalon.effect('fade-visible', {enter: function(elem, done) {TD.showElement(elem);},leave: function(elem, done) {TD.hideElement(elem);}});
	avalon.effect('rotateLeft-visible', {enter: function(elem, done) {TD.showElement(elem);},leave: function(elem, done) {TD.hideElement(elem);}});
}else {
	avalon.effect('flipX-visible', {
		enterClass: 'flipInX',
		leaveClass: 'flipOutX',
		afterEnter: function(elem) {TD.showElement(elem);},
		afterLeave: function(elem) {TD.hideElement(elem);}
	});
	avalon.effect('flipY-visible', {
		enterClass: 'flipInY',
		leaveClass: 'flipOutY',
		afterEnter: function(elem) {TD.showElement(elem);},
		afterLeave: function(elem) {TD.hideElement(elem);}
	});
	avalon.effect('zoom-visible', {
		enterClass: 'zoomIn',
		leaveClass: 'zoomOut',
		afterEnter: function(elem) {TD.showElement(elem);},
		afterLeave: function(elem) {TD.hideElement(elem);}
	});
	avalon.effect('fade-visible', {
		enterClass: 'fadeIn',
		leaveClass: 'fadeOut',
		afterEnter: function(elem) {TD.showElement(elem);},
		afterLeave: function(elem) {TD.hideElement(elem);}
	});
	avalon.effect('rotateLeft-visible', {
		enterClass: 'rotateInDownLeft',
		leaveClass: 'rotateOutUpLeft',
		afterEnter: function(elem) {TD.showElement(elem);},
		afterLeave: function(elem) {TD.hideElement(elem);}
	});
}