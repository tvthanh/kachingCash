(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'appKeyModalCtrl', [ '$scope', 'app', function ( $scope, app ) {
            $scope.app = app;
        }]);
})();