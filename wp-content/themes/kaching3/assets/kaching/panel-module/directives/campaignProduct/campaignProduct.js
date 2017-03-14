(function(){
    'use strict';

    angular.module('panelApp')
        .directive('campaignProduct', [ 'utils', function( utils ){
            return {
                restrict: 'A',
                scope: {
                    product: '=campaignProduct',
                    index: '=productIndex',
                    showLabels: '=showLabels',
                    onRemove: '&'
                },
                templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/campaignProduct/campaignProductTmpl.html',
                // templateUrl: 'panel-module/directives/campaignProduct/campaignProductTmpl.html',
                controller: ['$scope', function($scope){

                    $scope.urlRegex = utils.urlRegex();

                    $scope.remove = function( index ){
                        $scope.onRemove({ index: index });
                    };
                }]
            };
        }]);

})();
