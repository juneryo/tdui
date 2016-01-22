define(['ui/upload/td.upload'], function () {
	var vupload02 = avalon.define({
		$id: 'upload02',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$opt: {
			url: 'http://webuploader.duapp.com/server/fileupload.php',
			onokuploaded: function(file, response, vm) {
				avalon.log(file.name + '上传成功');
				return true;
			},
			onfinuploaded: function(file, vm) {
				avalon.log(file.name + '上传完成');
			},
			onerruploaded: function(file, reason, vm) {
				TD.hint(file.name + '上传失败[' + reason + ']');
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
		$ctrl.$vmodels = [vupload02];
	});
});