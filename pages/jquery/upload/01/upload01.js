define(['ui/upload/td.upload'], function () {
	var vupload01 = avalon.define({
		$id: 'upload01',
		$tab_opt: {
			tabs: [{title: 'UI界面'}, {title: 'HTML代码'}, {title: 'JS代码'}]
		},
		$opt: {
			url: 'http://webuploader.duapp.com/server/fileupload.php'
		}
	});
	
	return avalon.controller(function($ctrl) {
		$ctrl.$onRendered = function() {

		}
		$ctrl.$onEnter = function() {
			
		}
		$ctrl.$onBeforeUnload = function() {
			
		}
		$ctrl.$vmodels = [vupload01];
	});
});