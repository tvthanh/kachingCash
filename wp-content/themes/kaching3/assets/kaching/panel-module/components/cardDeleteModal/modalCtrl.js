(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'cardDeleteModalCtrl', [
            '$scope',
            '$alert',
            'callbacks',
            'card',
        function (
            $scope,
            $alert,
            callbacks,
            card
        ) {

            $scope.card = card;

            $scope.delete = function() {
                callbacks.delete( card );
                $scope.$hide();
            };
        }]);
})();