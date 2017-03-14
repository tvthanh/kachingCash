(function(){
    'use strict';

    console.log('mediaDeleteModalCtrl loaded');

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

            console.log('in mediaDeleteModalCtrl', media);

            $scope.media = media;

            $scope.delete = function() {
                modalOptions.delete( media );
                $scope.$hide();
            };
        }]);
})();