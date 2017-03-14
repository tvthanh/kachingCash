(function(){
    'use strict';

    console.log('productDeleteModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'productDeleteModalCtrl', [
            '$scope',
            'modalOptions',
            'product',
            'index',
        function (
            $scope,
            modalOptions,
            product,
            index
        ) {

            $scope.product = product;

            $scope.delete = function() {
                modalOptions.delete( product, index );
                $scope.$hide();
            };
        }]);
})();