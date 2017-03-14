(function() {
    'use strict';
    angular.module('panelApp')
        .directive('productList', [
            'productsService',
            'errorHandler',
            '$modal',
            function(
                productsService,
                errorHandler
            ) {
                return {
                    restrict: 'E',
                    scope: {
                        selectedMedia: '='
                    },
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/productList/productListTmpl.html',
                    controller: function($scope, errorHandler, productsService, $modal) {
                        var itemsPerPage = 8;

                        $scope.view = {
                            busyProduct: true,
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

                        $scope.search = function() {
                            $scope.view.currentPage = 1;
                            $scope.view.searchPhrase = $scope.view.searchInput;
                            getProducts();
                        };

                        $scope.changePage = function() {
                            getProducts();
                        };

                        $scope.toggleItem = function( item ) {
                            if (!$scope.selectedMedia.products) {
                                $scope.selectedMedia.products = [];
                            }
                            if ( item.selected ) {
                                item.selected = false;
                                $scope.selectedMedia.products = _.without($scope.selectedMedia.products, _.findWhere($scope.selectedMedia.products, {id:item.id}));
                            } else {
                                item.selected = true;
                                $scope.selectedMedia.products.push(item);
                            }
                        };

                        $scope.reloadProducts = function() {
                            $scope.view.currentPage = 1;
                            getProducts();
                        };

                        $scope.showNewProductDialog = function() {
                            var options = {
                                submit: function(newProduct) {
                                    console.log('newProduct', newProduct);
                                    $scope.reloadProducts();
                                }
                            };
                            $modal({
                                templateUrl: templateDirUri + '/assets/kaching/panel-module/components/newProductModal/modalTmpl.html',
                                // templateUrl: 'panel-module/components/newProductModal/modalTmpl.html',
                                controller: 'newProductModalCtrl',
                                animation: 'am-fade-and-scale',
                                backdrop: 'static',
                                resolve: {
                                    modalOptions: function() {
                                        return options;
                                    }
                                },
                                onHide: getProducts
                            });
                        };

                        var init = function() {
                            getProducts();
                        };

                        var mapSelectedProduct = function() {
                            if ($scope.view.products && $scope.view.products.length > 0) {
                                $scope.view.products.forEach(function(item){
                                    item.selected = false;
                                });

                                if ($scope.selectedMedia && $scope.selectedMedia.products && $scope.selectedMedia.products.length > 0) {
                                    $scope.selectedMedia.products.forEach(function(item) {
                                        var matchedItem = _.findWhere($scope.view.products, {id:item.id});
                                        if (matchedItem) {
                                            matchedItem.selected = true;
                                        }
                                    });
                                }
                            }
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

                            $scope.view.busyProduct = true;
                            productsService.getProducts( params ).then(
                                function( products ) {
                                    $scope.view.productsCount = products.count;
                                    $scope.view.products = products.items;
                                    $scope.view.busyProduct = false;
                                    mapSelectedProduct();
                                },
                                function( response ) {
                                    $scope.view.busyProduct = false;
                                    errorHandler.processApiResponse( response );
                                    $scope.$hide();
                                }
                            );
                        }

                        init();

                        $scope.$watch('selectedMedia', function (newVal, oldVal) {
                            if (newVal) {
                                mapSelectedProduct();
                            }
                        });
                    }
                };
            }
        ]);
})();
