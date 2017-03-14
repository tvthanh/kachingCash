(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'mediaEditCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            'errorHandler',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
        function (
            $scope,
            $state,
            $stateParams,
            $alert,
            errorHandler,
            apiUrl,
            authToken,
            utils,
            mediaService,
            FileUploader
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
                busy: false,
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
                mediaId: $stateParams.mediaId,
                mediaItem: {},
                videoFile: '',
                imageFile: '',
                newVideoAdded: false,
                newImageAdded: false
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

                $scope.view.busy = true;
                mediaService.getMediaItem( $scope.data.mediaId ).then(
                    function( mediaItem ) {
                        $scope.data.mediaItem = mediaItem;
                        $scope.data.imageFile = mediaItem.display;
                        $scope.view.hasVideo = true;
                        $scope.view.mediaLoaded = true;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                    }
                );
            };


            uploader.onAfterAddingFile = function( newItem ) {

                utils.cleanupUploaderQueue( uploader );

                if ( newItem.alias === 'video' ) {
                    $scope.data.videoFile = newItem._file;
                    $scope.data.newVideoAdded = true;
                }
                if ( newItem.alias === 'display' ) {
                    $scope.data.imageFile = newItem._file;
                    $scope.data.newImageAdded = true;

                    mediaService.imageSizeHelper( newItem._file ).then(function( size ){
                        if ( ! mediaService.imageSizeValid( size.width, size.height ) ) {
                            $scope.errors.image.size = true;
                        } else {
                            delete $scope.errors.image.size;
                        }
                    });
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
                $alert({
                    title: 'Media saved.',
                    content: '',
                    container: '#alerts-container',
                    placement: 'top',
                    duration: 3,
                    type: 'success',
                    show: true
                });
                $state.go('media');
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };
            $scope.videoHasError = function() {
                return ( $scope.data.newVideoAdded && typeof $scope.data.videoFile !== 'object' );
            };
            $scope.imageHasError = function() {
                if ( $scope.data.newImageAdded && ( typeof $scope.data.imageFile !== 'object' || $scope.errors.image.size ) ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.saveMedia = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid && !$scope.imageHasError() && !$scope.videoHasError() ) {
                    $scope.view.uploading = true;
                    mediaService.updateMedia( $scope.data.mediaItem ).then(
                        function(){
                            if ( $scope.data.newVideoAdded || $scope.data.newImageAdded ) {
                                uploader.uploadAll();
                            } else {
                                $alert({
                                    title: 'Media saved.',
                                    content: '',
                                    container: '#alerts-container',
                                    placement: 'top',
                                    duration: 3,
                                    type: 'success',
                                    show: true
                                });
                                $state.go('media');
                            }
                        },
                        function(){
                            // Show error message
                            // $scope.$hide();
                        }
                    );
                }
            };

            init();
        }]);

})();

