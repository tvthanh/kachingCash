(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'mediaCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'mediaService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            mediaService
        ) {

            var itemsPerPage = 9;

            $scope.view = {
                busy: true,
                currentPage: 1,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [
                    {
                        value: 'name',
                        label: 'Order by title'
                    },
                    {
                        value: '-date_added',
                        label: 'Newest first'
                    }
                ],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.data = {
                mediaCount: 0,
                media: []
            };

            var init = function() {
                getMedia();
            };

            $scope.reloadMedia = function() {
                $scope.view.currentPage = 1;
                getMedia();
            };

            $scope.changeOrder = function() {
                $scope.view.currentPage = 1;
                getMedia();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getMedia();
            };

            $scope.nextPage = function() {
                //console.log("SCROLL",$scope.data.media.length, $scope.data.mediaCount, $scope.view.currentPage)
                if ( $scope.view.busy || $scope.data.media.length === $scope.data.mediaCount ) {
                    return;
                }
                $scope.view.currentPage++;
                getMedia();
            };

            function getMedia ( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1),
                    ordering: $scope.view.orderBy
                };

                if ( $scope.view.searchPhrase.length > 0 ) {
                    params.name = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                mediaService.getMedia( params ).then(
                    function( media ) {
                        $scope.data.mediaCount = media.count;
                        if ( $scope.view.currentPage === 1 ) {
                            $scope.data.media = media.items;
                        } else {
                            $scope.data.media = $scope.data.media.concat( media.items );
                        }
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            }

            var deleteMedia = function( media ) {
                var name = media.name;
                mediaService.deleteMedia( media.id ).then(
                    function() {
                        $alert({
                            title: 'Media deleted.',
                            content: 'Media collection "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.reloadMedia();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showNewMediaDialog = function() {
                var options = {
                    submit: function( mediaId ) {
                        console.log('mediaId',mediaId);
                        $scope.reloadMedia();
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

            $scope.showDeleteMediaDialog = function( media ) {
                var options = {
                    delete: function( media ) {
                        console.log('delete media', media);
                        deleteMedia( media );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/mediaDeleteModal/modalTmpl.html',
                    // templateUrl: 'panel-module/components/mediaDeleteModal/modalTmpl.html',
                    controller: 'mediaDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        media: function () {
                            return media;
                        }
                    }
                });
            };

            init();
        }]);
})();
