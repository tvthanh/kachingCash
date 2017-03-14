(function() {
    "use strict";

    angular.module('panelApp')
        .controller('productsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$http',
            'apiUrl',
            'authToken',
            'errorHandler',
            'productsService',
        function(
            $scope,
            $alert,
            $modal,
            $http,
            apiUrl,
            authToken,
            errorHandler,
            productsService
        ) {

            var itemsPerPage = 12;

            $scope.view = {
                busy: true,
                currentPage: 1,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [{
                    'value': 'title',
                    'label': 'Order by title'
                }, {
                    'value': '-date_added',
                    'label': 'Newest first'
                }],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.data = {
                deletedCount: 0,
                productsCount: 0,
                products: []
            };

            var init = function() {
                getProducts();
            };

            $scope.reloadProducts = function() {
                $scope.view.currentPage = 1;
                getProducts();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getProducts();
            };

            $scope.nextPage = function() {
                if ( $scope.view.busy || $scope.data.products.length === $scope.data.productsCount ) {
                    return;
                }
                $scope.view.currentPage++;
                getProducts();
            };

            var getProducts = function(argsObj) {

                var params = {
                    limit: itemsPerPage,
                    offset: ( itemsPerPage * ($scope.view.currentPage - 1) ) - $scope.data.deletedCount,
                    ordering: $scope.view.orderBy
                };

                if ($scope.view.searchPhrase.length > 0) {
                    params.title = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                productsService.getProducts(params).then(
                    function(products) {
                        $scope.data.productsCount = products.count;
                        if ($scope.view.currentPage === 1) {
                            $scope.data.products = products.items;
                        } else {
                            $scope.data.products = $scope.data.products.concat(products.items);
                        }
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteProduct = function( product, index ) {
                var title = product.title;

                productsService.deleteProduct(product.id).then(
                    function() {
                        $alert({
                            title: 'Product deleted.',
                            content: '"' + title + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.data.products.splice( index, 1 );
                        $scope.data.productsCount--;
                        $scope.data.deletedCount++;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showNewProductDialog = function() {
                var options = {
                    submit: function(newProduct) {
                        console.log("newProduct", newProduct);
                        $scope.reloadProducts();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newProductModal/modalTmpl.html',
                    controller: 'newProductModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showDeleteProductDialog = function( product, index ) {
                var options = {
                    delete: function( product, index ) {
                        deleteProduct( product, index );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/productDeleteModal/modalTmpl.html',
                    controller: 'productDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        product: function() {
                            return product;
                        },
                        index: function() {
                            return index;
                        }
                    }
                });
            };

            init();
        }
    ]);
})();
