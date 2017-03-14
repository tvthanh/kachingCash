(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newMediaModalCtrl', [
            '$scope',
            '$state',
            '$alert',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
            'modalOptions',
        function (
            $scope,
            $state,
            $alert,
            apiUrl,
            authToken,
            utils,
            mediaService,
            FileUploader,
            modalOptions
        ) {

                var uploader = $scope.uploader = new FileUploader({
                url: apiUrl + '/media/',
                method: 'PATCH',
                headers: {
                    'Authorization': 'Token ' + authToken.get()
                }
            });

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                uploading: false,
                submitted: false,
                mediaCreated: false,

                videoUploadStarted: false,
                videoUploadProgress: 0,
                videoUploadComplete: false,

                imageUploadStarted: false,
                imageUploadProgress: 0,
                imageUploadComplete: false
            };

            $scope.data = {
                videoFile: '',
                imageFile: '',
                mediaName: '',
                mediaId: ''
            };

            $scope.mediaTypeProp = {   'type': 'select',
                'name': 'media_type',
                'mediaTypeSelect': 'Upload Media',
                'values': [ 'Upload Media', 'External Link']
            };

            $scope.errors = {
                video: {},
                image: {}
            };

            var init = function() {

                utils.addUploaderTypeFilter( uploader, 'video', {
                    videoFilter: ['video/mp4', 'video/ogg', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
                });
                utils.addUploaderTypeFilter( uploader, 'display', {
                    imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                });
            };

            uploader.onAfterAddingFile = function( newItem ) {

                utils.cleanupUploaderQueue( uploader );

                if ( newItem.alias === 'video' ) {
                    $scope.data.videoFile = newItem._file;
                }

                if ( newItem.alias === 'display' ) {

                    $scope.data.imageFile = newItem._file;

                    // mediaService.imageSizeHelper( newItem._file ).then(function( size ){
                    //     if ( ! mediaService.imageSizeValid( size.width, size.height ) ) {
                    //         $scope.errors.image.size = true;
                    //     } else {
                    //         delete $scope.errors.image.size;
                    //     }
                    // });
                }
            };

            uploader.onBeforeUploadItem = function(item) {
                if ( item.alias === 'video' ) {
                    $scope.view.videoUploadStarted = true;
                }
                if ( item.alias === 'display' ) {
                    $scope.view.imageUploadStarted = true;
                }
                item.url = apiUrl + '/media/'+ $scope.data.mediaId +'/';
            };

            uploader.onCompleteItem = function( fileItem, response, status, headers ) {
                if ( fileItem.alias === 'video' ) {
                    $scope.view.videoUploadComplete = true;
                }
                if ( fileItem.alias === 'display' ) {
                    $scope.view.imageUploadComplete = true;
                }
            };

            uploader.onProgressItem = function(fileItem, progress) {
                if ( fileItem.alias === 'video' ) {
                    $scope.view.videoUploadProgress = progress;
                }
                if ( fileItem.alias === 'display' ) {
                    $scope.view.imageUploadProgress = progress;
                }
            };

            uploader.onCompleteAll = function() {
                $scope.view.mediaCreated = true;

                if ( modalOptions.mode === 'campaignEditor' ) {
                    $scope.closeModal();
                }
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.videoHasError = function() {
                return ( typeof $scope.data.videoFile !== 'object' );
            };

            $scope.imageHasError = function() {
                // if ( typeof $scope.data.imageFile !== 'object' || $scope.errors.image.size ) {
                if ( typeof $scope.data.imageFile !== 'object' ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.viewMedia = function() {
                $scope.$hide();
                $state.go( 'media.view', { mediaId: $scope.data.mediaId } );
            };

            $scope.saveMedia = function() {
                $scope.view.submitted = true;

                var mediaValid = false;

                if (($scope.mediaTypeProp.mediaTypeSelect === 'Upload Media')) {
                    mediaValid = $scope.form1.$valid && !$scope.imageHasError() && !$scope.videoHasError();
                } else {
                    mediaValid = $scope.form1.$valid && !$scope.imageHasError();
                }

                // if ( $scope.form1.$valid && !$scope.imageHasError() && !$scope.videoHasError() ) {
                if (mediaValid) {
                    $scope.view.uploading = true;
                    mediaService.createMedia( $scope.data.mediaName, $scope.data.mediaLink ).then(
                        function( media ){
                            $scope.data.mediaId = media.id;
                            uploader.uploadAll();
                        },
                        function(){
                            // Show error message
                            // $scope.$hide();
                        }
                    );
                }
            };

            $scope.closeModal = function() {
                if ( $scope.view.mediaCreated  && _.isFunction( modalOptions.submit ) ) {
                    modalOptions.submit( $scope.data.mediaId );
                }
                $scope.$hide();
            };

            $scope.setFile = function(element) {
				/*console.log(element.files);*/
				// $scope.inCorrectFormat = false;
				for(var i = 0; i < element.files.length; i++) {
					var reader = new FileReader();
					var file = element.files[i];
					reader.onload = function (event) {
						// checkTypeTrigger(element, file, event.target.result);
                        $scope.resizeImage(event.target.result);
					};
					// when the file is read it triggers the onload event above.
					reader.readAsDataURL(file);
				}
			};

            $scope.resizeImage = function(trigger) {
                var img = new Image();
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var ratio = 1;
                    if (this.width > this.height) {
                        if (this.height < 1200) {
                            ratio = 1200 / this.height;
                        } else if (this.width < 1280) {
                            ratio = 1280 / this.width;
                        }
                    } else {
                        if (this.width < 1200) {
                            ratio = 1200 / this.width;
                        } else if (this.height < 1280) {
                            ratio = 1280 / this.height;
                        }
                    }
                    canvas.width = this.width * ratio;
                    canvas.height = this.height * ratio;
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);


                    // var index = $scope.triggerItems.indexOf(trigger);
                    // if (index >= 0) {
                    //     $scope.triggerItems[index].content = canvas.toDataURL();
                    //     $scope.triggerItems[index].contentBase64 = canvas.toDataURL();
                    //     $scope.triggerItems[index].isScale = true;
                    //     $scope.$apply();
                    //     PopupMessageService.showAlertMessage('Resize image successeful!', true);
                    //     validateUploadImages();
                    // } else {
                    //     PopupMessageService.showAlertMessage('Resize image fail!', false);
                    // }
                };
                img.src = trigger.content;
                img.crossOrigin = 'Anonymous';
            };

            init();
        }]);
})();
