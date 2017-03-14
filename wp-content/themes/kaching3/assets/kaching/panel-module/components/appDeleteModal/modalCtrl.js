(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'appDeleteModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'modalOptions',
            'app',
        function (
            $scope,
            $alert,
            campaignsService,
            modalOptions,
            app
        ) {

            $scope.app = app;

            $scope.delete = function() {
                modalOptions.delete( app );
                $scope.$hide();
            };
        }]);
})();