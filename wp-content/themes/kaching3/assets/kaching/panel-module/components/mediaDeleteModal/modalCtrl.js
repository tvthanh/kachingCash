(function(){
    'use strict';


    angular.module('panelApp')
        .controller( 'mediaDeleteModalCtrl', [
            '$scope',
            '$alert',
            'mediaService',
            'modalOptions',
            'media',
        function (
            $scope,
            $alert,
            mediaService,
            modalOptions,
            media
        ) {


            $scope.media = media;

            $scope.delete = function() {
                modalOptions.delete( media );
                $scope.$hide();
            };
        }]);
})();
