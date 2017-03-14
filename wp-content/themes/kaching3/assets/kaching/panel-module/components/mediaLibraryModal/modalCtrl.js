(function(){
    'use strict';


    angular.module('panelApp')
        .controller( 'mediaLibraryModalCtrl', [
            '$scope',
            'errorHandler',
            'modalOptions',
            'mediaService',
        function (
            $scope,
            errorHandler,
            modalOptions,
            mediaService
        ) {


            var itemsPerPage = 6;

            $scope.view = {
                busy: true,
                currentPage: 1,
                mediaCount: 0,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [
                    {
                        'value': 'name',
                        'label': 'Order by title'
                    },
                    {
                        'value': '-date_added',
                        'label': 'Newest first'
                    }
                ],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.selectMedia = function() {
                modalOptions.submit( $scope.view.selectItem );
                $scope.$hide();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getMedia();
            };

            $scope.changeOrder = function() {
                getMedia();
            };

            $scope.changePage = function() {
                getMedia();
            };

            $scope.toggleItem = function( item ) {
                if ( item.selected ) {
                    item.selected = false;
                    $scope.view.selectItem = false;
                } else {
                    if ( typeof $scope.view.selectItem === 'object' ) {
                        $scope.view.selectItem.selected = false;
                    }
                    item.selected = true;
                    $scope.view.selectItem = item;
                }
            };

            var init = function() {
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
                        $scope.view.mediaCount = media.count;
                        $scope.view.media = media.items;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            }

            init();
        }]);
})();
