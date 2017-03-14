(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'mediaViewCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            '$modal',
            '$sce',
            'errorHandler',
            'mediaService',
        function (
            $scope,
            $state,
            $stateParams,
            $alert,
            $modal,
            $sce,
            errorHandler,
            mediaService
        ) {

            $scope.view = {
                busy: false
            };

            $scope.data = {
                mediaId: $stateParams.mediaId,
                mediaItem: {}
            };

            $scope.videogular = { sources: [] };

            var init = function() {
                $scope.view.busy = true;
                mediaService.getMediaItem( $scope.data.mediaId ).then(
                    function( mediaItem ) {
                        $scope.data.mediaItem = mediaItem;
                        $scope.setVideo();
                        $scope.view.mediaLoaded = true;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteMedia = function( media ) {
                var name = media.name;
                mediaService.deleteMedia( media.id ).then(
                    function() {
                        $alert({
                            title: 'Media deleted.',
                            content: 'Media collection "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $state.go('media');
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.setVideo = function() {
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.data.mediaItem.video), type: "video/mp4"}
                ];
            };

            $scope.showDeleteMediaDialog = function( media ) {
                var options = {
                    delete: function( media ) {
                        console.log('delete media', media);
                        deleteMedia( media );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/mediaDeleteModal/modalTmpl.html',
                    controller: 'mediaDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        media: function () {
                            return media;
                        }
                    }
                });
            };

            init();
        }]);

})();
