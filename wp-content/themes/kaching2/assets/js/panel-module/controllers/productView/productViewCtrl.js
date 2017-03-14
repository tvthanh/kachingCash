(function() {
    "use strict";

    angular.module('panelApp')
        .controller('productViewCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            '$modal',
            'errorHandler',
            'productsService',
        function(
            $scope,
            $state,
            $stateParams,
            $alert,
            $modal,
            errorHandler,
            productsService
        ) {

            $scope.view = {
                busy: false
            };

            $scope.data = {
                productId: $stateParams.productId,
                product: {}
            };

            var init = function() {
                $scope.view.busy = true;
                productsService.getProduct($scope.data.productId).then(
                    function(product) {
                        console.log(product);
                        $scope.data.product = product;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteProduct = function(product) {
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
                        $state.go('products');
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteProductDialog = function(product) {
                var options = {
                    delete: function(product) {
                        deleteProduct(product);
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
                        }
                    }
                });
            };

            init();
        }
    ]);

})();
