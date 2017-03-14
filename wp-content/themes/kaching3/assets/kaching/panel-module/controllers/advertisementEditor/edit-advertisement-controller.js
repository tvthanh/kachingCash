(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'editAdvertisementCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            'advertisementEditorService',
            '$modal',
            'mediaService',
            '$sce',
            'utils',
            'errorHandler',
        function (
            $scope,
            $state,
            $stateParams,
            advertisementEditorService,
            $modal,
            mediaService,
            $sce,
            utils,
            errorHandler
        ) {

            // $scope.fieldHasError = utils.fieldHasError;

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                min: moment().format('YYYY-MM-DD'),
                display: 'Select date range'
            };

            $scope.advertisement = {
                id: undefined,
                name: undefined,
                start_date: undefined,
                end_date: undefined
            };

            $scope.data = {
                allCategories: true,
                categories: []
            };

            $scope.view = {
                busy: false,
                busyMedia: false,
                mediaLoaded: false,
                playerReady: false,
                videoSet: false
            };

            $scope.externalLink = null;
            $scope.videogularApi = null;
            $scope.videogular = { sources: [] };

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

            var hasVideo = function() {
                // if ( typeof $scope.media.video === 'string' ) {
                if ( typeof $scope.media.video === 'string' || typeof $scope.media.video_external_link === 'string') {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.hasMedia = function() {
                // if ( Object.getOwnPropertyNames( $scope.media ).length === 0 ) {
                //     return false;
                // } else {
                //     return true;
                // }
                return ( _.isEmpty( $scope.media ) ) ? false : true;
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

            $scope.updateDataModel = function(e, obj) {
                e.preventDefault();
                obj.selected = !obj.selected;
            };

            $scope.showErrors = function() {
                // return editor.stepGet('step4', 'submitted');
                return true;
            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
                if ( hasVideo() && !$scope.view.videoSet ) {
                    $scope.setVideo();
                }
            };

            $scope.setVideo = function() {

                $scope.videogularApi.stop();

                var videoLink = $scope.media.video || $scope.media.video_external_link;
                if ($scope.media.video === null) {
                    $scope.externalLink = $sce.trustAsResourceUrl(videoLink);
                } else {
                    $scope.videogular.sources = [
                        {src: $sce.trustAsResourceUrl(videoLink), type: 'video/mp4'}
                    ];
                }

                $scope.view.videoSet = true;
            };

            $scope.finish = function() {

                if ($scope.advertisement.id === undefined) {
                    if ( $scope.form1.$valid ) {
                        console.log(true);

                        $scope.advertisement.start_date = moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD') + 'T00:00:00.000Z';
                        $scope.advertisement.end_date = moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD') + 'T23:59:59.999Z';

                        advertisementEditorService.saveAdvertisement($scope.advertisement).then(
                            function(response) {
                                console.log(response);
                                $scope.advertisement.id = response.id;
                                // update categories
                                updateCategories();
                            },
                            function(response){
                                errorHandler.processApiResponse( response );
                            }
                        );
                    } else {
                        console.log(false);
                    }
                } else {
                    // pass step 1: advertisement existed
                    // update categories and media
                    updateCategories();
                }
            };

            function updateCategories() {
                advertisementEditorService.updateCategories( $scope.advertisement.id , $scope.data ).then(
                    function( response ) {
                        updateMedia();
                    },
                    function( response ) {
                        // $scope.view.busy = false;
                        // editor.stepSet('step2', 'valid', false);
                        if ( typeof response === 'object' && ! _.isEmpty( response.validationErrors ) ) {
                            $scope.view.showErrors = true;
                            $scope.view.errors = response.validationErrors;
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );
            }

            function updateMedia() {

                if ( $scope.form3.$valid ) {
                    if ($scope.media.id) {
                        var mediaData = {
                            media: $scope.media.id,
                            media_title: $scope.media.media_title,
                            media_description: $scope.media.media_description
                        };

                        advertisementEditorService.updateMedia( $scope.advertisement.id , mediaData ).then(
                            function( response ) {
                                $state.go('advertisements');
                            },
                            function( response ) {
                                // $scope.view.busy = false;
                                // editor.stepSet('step2', 'valid', false);
                                if ( typeof response === 'object' && ! _.isEmpty( response.validationErrors ) ) {
                                    $scope.view.showErrors = true;
                                    $scope.view.errors = response.validationErrors;
                                } else {
                                    errorHandler.processApiResponse( response );
                                }
                            }
                        );
                    }
                }
            }

            var initNew = function() {
                $scope.advertTitle = 'New Advertisement';

                if ( typeof $scope.advertisement.start_date !== 'undefined' && typeof $scope.advertisement.end_date !== 'undefined' ) {
                    $scope.daterange.dates.startDate = moment( $scope.advertisement.start_date );
                    $scope.daterange.dates.endDate = moment( $scope.advertisement.end_date );
                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                }

                // $scope.view.busy = false;

                advertisementEditorService.getCategories().then(
                    function( response ) {
                        $scope.data.allCategories  = response.allCategories;
                        $scope.data.categories     = response.categories;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );

                // $scope.media = editor.dataGet('media');

                $scope.media = {};
            };

            var initUpdate = function() {
                $scope.view.busy = true;
                $scope.advertTitle = 'Update Advertisement';

                $scope.media = {};

                advertisementEditorService.getCategories().then(
                    function( response ) {
                        $scope.data.allCategories  = response.allCategories;
                        $scope.data.categories     = response.categories;

                        // get advert
                        advertisementEditorService.getAdvertisments($stateParams.advertId).then(
                            function( advert ){
                                if ( typeof advert.start_date !== 'undefined' && typeof advert.end_date !== 'undefined' ) {
                                    $scope.daterange.dates.startDate = moment( advert.start_date );
                                    $scope.daterange.dates.endDate = moment( advert.end_date );
                                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                                }

                                $scope.view.mediaLoaded = false;

                                if (advert.media.length > 0) {
                                    $scope.media = advert.media[0];
                                    $scope.setVideo();
                                    $scope.view.mediaLoaded = true;
                                }


                                $scope.advertisement = advert;

                                angular.forEach( $scope.data.categories, function( category ){
                                    category.selected = false;
                                    angular.forEach( advert.category, function( item ){
                                        if (item.id === category.id) {
                                            category.selected = true;
                                        }
                                    });
                                });

                                $scope.data.allCategories = advert.category.length > 0 ? false : true;

                            },
                            function( response ) {
                                $scope.view.busy = false;
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        );
                        // end of get advert
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var init = function() {
                if ($stateParams.advertId) {
                    initUpdate();
                } else {
                    initNew();
                }
            };

            $scope.$watch( function(){ return $scope.daterange.dates; }, function(newValue, oldValue) {
                if ( newValue === undefined || newValue.startDate === null || newValue.endDate === null ) {
                    return;
                }
                $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
            });

            init();
        }]);
})();
