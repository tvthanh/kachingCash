(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'imagePreviewModalCtrl', ['$scope', 'imageUrl', 'actionText', function($scope, imageUrl, actionText) {
            $scope.imageUrl = imageUrl;
            $scope.actionText = actionText;
        }]);
})();
