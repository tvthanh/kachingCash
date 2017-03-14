(function(){
    'use strict';

    angular.module('panelApp')
        .directive('campaignEditMedia', [
            '$state',
            '$stateParams',
            '$alert',
            '$sce',
            'apiUrl',
            'utils',
            '$modal',
            'errorHandler',
            'mediaService',
            'campaignsService',
        function(
            $state,
            $stateParams,
            $alert,
            $sce,
            apiUrl,
            utils,
            $modal,
            errorHandler,
            mediaService,
            campaignsService
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/campaignEditMedia/campaignEditMediaTmpl.html',
                // templateUrl: 'panel-module/directives/campaignEditMedia/campaignEditMediaTmpl.html',
                controller: function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;
                    $scope.videogular = { sources: [] };
                    $scope.videogularApi = null;

                    $scope.view = {
                        loading: false,
                        submitted: false,
                        loadingMedia: false,
                        mediaLoaded: false,
                        playerReady: false,
                        videoSet: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        campaign: {},
                        media: {},
                        mediaTitle: '',
                        mediaDesc: ''
                    };

                    $scope.externalLink = null;

                    var init = function() {

                        $scope.view.loading = true;
                        campaignsService.getCampaign( $scope.data.campaignId ).then(function( campaign ){
                            $scope.data.campaign = campaign;
                            if ( campaign.media.length > 0 && typeof campaign.media[0] === 'object' ) {
                                $scope.data.media = campaign.media[0];
                                $scope.data.mediaTitle = campaign.media[0].media_title;
                                $scope.data.mediaDesc  = campaign.media[0].media_description;
                            }
                            $scope.view.loading = false;

                            if ( hasVideo() ) {
                                $scope.view.mediaLoaded = true;
                                if ( $scope.view.playerReady ) {
                                    $scope.setVideo();
                                }
                            }
                        });
                    };

                    function hasVideo () {
                        if ( typeof $scope.data.media.video === 'string' || typeof $scope.data.media.video_external_link === 'string') {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    $scope.hasMedia = function() {
                        if ( Object.getOwnPropertyNames( $scope.data.media ).length === 0 ) {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    $scope.onPlayerReady = function( API ) {
                        $scope.view.playerReady = true;
                        $scope.videogularApi = API;
                        if ( hasVideo() && !$scope.view.videoSet ) {
                            $scope.setVideo();
                        }
                    };

                    $scope.setVideo = function() {
                        $scope.videogularApi.stop();

                        var videoLink = $scope.data.media.video || $scope.data.media.video_external_link;
                        if ($scope.data.media.video === null) {
                            $scope.externalLink = $sce.trustAsResourceUrl(videoLink);
                        } else {
                            $scope.videogular.sources = [
                                {src: $sce.trustAsResourceUrl(videoLink), type: 'video/mp4'}
                            ];
                        }

                        $scope.view.videoSet = true;
                    };

                    $scope.showMediaLibrary = function() {
                        var options = {
                            submit: function( selectedMedia ) {
                                $scope.getMedia( selectedMedia.id );
                            }
                        };
                        $modal({
                            templateUrl: templateDirUri + '/assets/kaching/panel-module/components/mediaLibraryModal/modalTmpl.html',
                            // templateUrl: 'panel-module/components/mediaLibraryModal/modalTmpl.html',
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
                                console.log('mediaId',mediaId);
                                $scope.getMedia( mediaId );
                            }
                        };
                        $modal({
                            templateUrl: templateDirUri + '/assets/kaching/panel-module/components/newMediaModal/modalTmpl.html',
                            // templateUrl: 'panel-module/components/newMediaModal/modalTmpl.html',
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
                        $scope.view.loadingMedia = true;
                        $scope.view.mediaLoaded = false;
                        mediaService.getMediaItem( mediaId ).then(
                            function( media ) {
                                $scope.data.media = media;
                                $scope.setVideo();
                                $scope.view.loadingMedia = false;
                                $scope.view.mediaLoaded = true;
                            },
                            function() {
                                $scope.view.loadingMedia = false;
                            }
                        );
                    };

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            var mediaData = {
                                campaignId: $scope.data.campaignId,
                                media: $scope.data.media.id,
                                media_title:  $scope.data.mediaTitle,
                                media_description:  $scope.data.mediaDesc
                            };

                            console.log('save : mediaData', mediaData);

                            campaignsService.saveMedia( mediaData ).then(
                                function() {
                                    $alert({
                                        title: 'Campaign details have been saved.',
                                        content: '',
                                        container: '#alerts-container',
                                        placement: 'top',
                                        duration: 3,
                                        type: 'success',
                                        show: true
                                    });
                                    campaignsService.setPrepared( $scope.data.campaignId );
                                },
                                function( response ) {
                                    errorHandler.processApiResponse( response );
                                }
                            );

                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }
            };
        }]);

})();
