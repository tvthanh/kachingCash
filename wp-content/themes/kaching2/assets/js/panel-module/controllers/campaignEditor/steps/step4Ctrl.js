(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep4Ctrl', [
            '$scope',
            '$state',
            '$sce',
            'utils',
            '$modal',
            'errorHandler',
            'mediaService',
            'campaignEditorService',
        function (
            $scope,
            $state,
            $sce,
            utils,
            $modal,
            errorHandler,
            mediaService,
            campaignEditorService
        ) {

            var editor = campaignEditorService;

            $scope.fieldHasError = utils.fieldHasError;
            $scope.videogular = { sources: [] };
            $scope.videogularApi = null;

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid') ||
                    ! editor.stepGet('step3', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step4');
                editor.previousState( 'campaigns.' + editor.mode() + '.step4' );

                $scope.media = editor.dataGet('media');

                $scope.view = {
                    busy: false,
                    busyMedia: false,
                    mediaLoaded: false,
                    playerReady: false,
                    videoSet: false
                };

                if ( hasVideo() ) {
                    $scope.view.mediaLoaded = true;
                    if ( $scope.view.playerReady ) {
                        $scope.setVideo();
                    }
                }
            };

            var hasVideo = function() {
                if ( typeof $scope.media.video === 'string' ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.hasMedia = function() {
                if ( Object.getOwnPropertyNames( $scope.media ).length === 0 ) {
                    return false;
                } else {
                    return true;
                }
            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
                if ( hasVideo() && !$scope.view.videoSet ) {
                    $scope.setVideo();
                }
            };

            $scope.setVideo = function() {
                $scope.videogularApi.stop();
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.media.video), type: "video/mp4"}
                ];
                $scope.view.videoSet = true;
            };

            $scope.showMediaLibrary = function() {
                var options = {
                    submit: function( selectedMedia ) {
                        $scope.getMedia( selectedMedia.id );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/mediaLibraryModal/modalTmpl.html',
                    controller: 'mediaLibraryModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showNewMediaDialog = function() {
                var options = {
                    mode: 'campaignEditor',
                    submit: function( mediaId ) {
                        console.log("mediaId",mediaId);
                        $scope.getMedia( mediaId );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newMediaModal/modalTmpl.html',
                    controller: 'newMediaModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.getMedia = function( mediaId ) {
                $scope.view.busyMedia = true;
                mediaService.getMediaItem( mediaId ).then(
                    function( mediaItem ) {
                        $scope.media = mediaItem;
                        $scope.view.busyMedia = false;
                        $scope.setVideo();
                        $scope.view.mediaLoaded = true;
                    },
                    function() {
                        $scope.view.busyMedia = false;
                    }
                );
            };

            $scope.showErrors = function() {
                return editor.stepGet('step4', 'submitted');
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step3' );
            };

            $scope.nextStep = function() {

                editor.stepSet('step4', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    editor.stepSet('step4', 'valid', true);
                    editor.dataSet('media', $scope.media);

                    editor.save('step4').then(
                        function(){
                            $state.go( 'campaigns.' + editor.mode() + '.step5' );
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );

                } else {
                    editor.stepSet('step4', 'valid', false);
                }
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - media', angular.copy( $scope.media ) );
            };

            init();

        }]);
})();
