(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'producstLibraryModalCtrl', [
            '$scope',
            'errorHandler',
            'modalOptions',
            'productsService',
        function (
            $scope,
            errorHandler,
            modalOptions,
            productsService
        ) {

            var itemsPerPage = 8;

            $scope.view = {
                busy: true,
                currentPage: 1,
                productsCount: 0,
                products: [],
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

            $scope.selectProduct = function() {
                modalOptions.submit( $scope.view.selectItem );
                $scope.$hide();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getProducts();
            };

            $scope.changeOrder = function() {
                getProducts();
            };

            $scope.changePage = function() {
                getProducts();
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
                getProducts();
            };

            function getProducts ( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1),
                    ordering: $scope.view.orderBy
                };

                if ( $scope.view.searchPhrase.length > 0 ) {
                    params.title = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                productsService.getProducts( params ).then(
                    function( products ) {
                        $scope.view.productsCount = products.count;
                        $scope.view.products = products.items;
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
