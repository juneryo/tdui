/*
* 基于webuploader http://fex.baidu.com/webuploader/
* 使用webuploader的上传实现, 自定义外观
*/
define(['avalon', 'jquery', 'webupload', 'text!./td.upload.html', 'css!./td.upload.css'], function(avalon, $, webupload, template) {
	var _interface = function () {};
	avalon.component("td:upload", {
		//外部标签属性
		auto: false,
		abort: true,  //上传异常时是否终止后续上传
		preview: false,
		dnd: false,
		horizontal: false,
		labelCol: 4,
		maxNum: 10,  //最多10个
		maxSize: 100,  //一次性最大100M
		fileSize: 10,  //单个最大10M
		label: '',
		exts: '',  //后缀,如：gif,jpg,jpeg,bmp,png
		mime: '',  //mimeTypes,如：image/*
		threads: 3,  //同时处理上传文件数
		name: 'files',
		//外部配置参数
		url: '',
		data: {},  //提交额外参数
		onokuploaded: null,
		onerruploaded: null,
		onfinuploaded: null,
		onready: null,
		//内部属性
		$swfUrl: 'avalon/ui/base/swf/Uploader.swf',
		$uploader: null,
		//内部接口
		$trigger: _interface,
		$initWebuploader: _interface,
		$updateUploadQueue: _interface,
		//view属性
		_pickerId: '',
		_dndId: '',
		_uploadInfo: '',
		_uploadPercentage: 0,
		_progress: false,
		_err: false,
		_uploadQueue: [],
		//view接口
		
		//对外方法
		uploadAll: _interface,
		removeAll: _interface,
		//默认配置
		$template: template,
		$construct: function (hooks, vmOpts, elemOpts) {
			var option = avalon.mix(hooks, vmOpts, elemOpts);
			hooks._pickerId = TD.util.genId('td_upload_picker_');
			hooks._dndId = TD.util.genId('td_upload_dnd_');
			if(hooks.dnd === true) {
				hooks.preview = true;
			}
			return option;
		},
		$dispose: function (vm, elem) {
			elem.innerHTML = elem.textContent = '';
		},
		$init: function(vm, elem) {
			vm.$trigger = function(ev, type, ext) {
				switch (type) {
					case 'ok': 
						//ev为file, ext为response
						if(typeof vm.onokuploaded == 'function') {
							if(vm.onokuploaded(ev, ext, vm) == true) {
								vm.$updateUploadQueue(ev, 'success');
								vm._uploadInfo = ev.name + '  上传成功';
							}else {
								vm.$updateUploadQueue(ev, 'error');
								vm._uploadInfo = ev.name + '  上传失败';
								if(vm.abort===true) {
									vm.$uploader.stop();
								}
								vm._err = true;
							}
						}else {
							vm.$updateUploadQueue(ev, 'success');
							vm._uploadInfo = ev.name + '  上传成功';
						}
						break;
					case 'err': 
						//ev为file, ext为reason
						if(typeof vm.onerruploaded == 'function') {
							vm.onerruploaded(ev, ext, vm);
						}
						vm.$updateUploadQueue(ev, 'error');
						vm._uploadInfo = ev.name + '  上传失败[' + ext + ']';
						if(vm.abort===true) {
							vm.$uploader.stop();
						}
						vm._err = true;
						break;
					case 'fin': 
						//ev为file
						if(typeof vm.onfinuploaded == 'function') {
							vm.onfinuploaded(ev, vm);
						}
						break;
					case 'ready': 
						if(typeof vm.onready == 'function') {
							vm.onready(ev, vm);
						}
						break;
					default: break;
				}
			}
			vm.$updateUploadQueue = function(file, status) {
				for(var i = vm._uploadQueue.size() - 1; i >= 0; i --) {
					var item = vm._uploadQueue[i];
					if(item.id == file.id) {
						item.status = status;
						switch(status) {
							case 'pending': item.desc = '待上传'; break;
							case 'uploading': item.desc = '上传中'; break;
							case 'success': item.desc = '上传成功'; break;
							case 'error': item.desc = '上传失败'; break;
						}
						break;
					}
				}
			}
			vm.$initWebuploader = function() {
				//初始化
				var acceptObj = null;
				if(vm.mime != '' && vm.exts != '') {
					acceptObj = {
						extensions: vm.exts,
						mimeTypes: vm.mime
					}
				}
				vm.$uploader = webupload.create({
					server: vm.url,
					pick: '#' + vm._pickerId,
					dnd: vm.dnd ? ('#' + vm._dndId) : undefined,
					fileVal: vm.name,
					accept: acceptObj,
					formData: vm.data,
					swf: vm.$swfUrl,
					auto: vm.auto,
					//runtimeOrder: 'flash',  //强制flash在IE下有异常？
					threads: vm.threads,
					fileNumLimit: vm.maxNum,
					fileSizeLimit: vm.maxSize * 1024 * 1024,
					fileSingleSizeLimit: vm.fileSize * 1024 * 1024
				});
				
				// 当有文件添加进来的时候
				vm.$uploader.on('fileQueued', function(file) {
					vm._uploadInfo = '待上传...';
					vm._uploadPercentage = '0%';
					var obj = {
						id: file.id,
						name: file.name,
						status: 'pending',
						desc: '待上传',
						url: '',
					};
					if(vm.preview == true) {
						vm.$uploader.makeThumb(file, function(error, src) {  // 创建缩略图(如果为非图片文件，可以不用调用此方法)
							if (error) {
								obj.url = "";  //return;
							}else {
								obj.url = src;
							}
							vm._uploadQueue.push(obj);
							vm._progress = true;
							vm._err = false;
						}, 120, 120);  //分辨率120x120
					}else {
						vm._uploadQueue.push(obj);
						vm._progress = true;
						vm._err = false;
					}
				});
				vm.$uploader.on('uploadStart', function(file) {
					vm.$updateUploadQueue(file, 'uploading');
					vm._err = false;
				});
				vm.$uploader.on('uploadProgress', function(file, percentage) {
					vm._uploadPercentage = percentage * 100 + '%';
					vm._uploadInfo = file.name + '  上传中(' + vm._uploadPercentage + ')...';
				});
				vm.$uploader.on('uploadSuccess', function(file, response) {
					vm.$trigger(file, 'ok', response);
				});
				vm.$uploader.on('uploadError', function(file, reason) {
					vm.$trigger(file, 'err', reason);
				});
				vm.$uploader.on('uploadComplete', function(file) {
					vm.$trigger(file, 'fin');
				});
			}
			
			vm.uploadAll = function() {
				vm.$uploader.upload();
			}
			vm.removeAll = function() {
				for(var i = 0; i < vm._uploadQueue.size(); i ++) {
					vm.$uploader.removeFile(vm._uploadQueue[i].id);
				}
				vm._uploadQueue.removeAll();
				vm._uploadInfo = '';
				vm._progress = false;
			}
		},
		$ready: function (vm, elem) {
      vm.$initWebuploader();
			vm.$trigger(elem, 'ready');
    }
	});
	var widget = avalon.components["td:upload"];
  widget.regionals = {};
})