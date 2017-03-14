(function(){
    'use strict';


    angular.module('panelApp')
        .controller( 'advertDetailsModalCtrl', [
            '$scope',
            'errorHandler',
            '$sce',
            'advertisementEditorService',
            'advertId',
        function (
            $scope,
            errorHandler,
            $sce,
            advertisementEditorService,
            advertId
        ) {

            $scope.videogularApi = null;

            $scope.view = {
                busy: false
            };

            $scope.advert = {};
            $scope.media = {};
            $scope.products = [];
            $scope.videogular = { sources: [] };

            $scope.view.busy = true;
            $scope.externalLink = null;

            advertisementEditorService.getAdvertisments(advertId).then(
                function( advert ){
                    $scope.advert = advert;
                    if (advert.category.length > 0) {
                        $scope.category = advert.category;
                    }
                    if (advert.media.length > 0) {
                        $scope.media = advert.media[0];
                        $scope.setVideo();
                    }
                    $scope.view.busy = false;

                },
                function( response ) {
                    $scope.view.busy = false;
                    errorHandler.processApiResponse( response );
                    $scope.$hide();
                }
            );

            $scope.hasMedia = function() {
                return ( _.isEmpty( $scope.media ) ) ? false : true;
            };

            $scope.hasProducts = function() {
                return ( $scope.products.length > 0 ) ? true : false;
            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
            };

            $scope.setVideo = function() {
                var videoLink = $scope.media.video || $scope.media.video_external_link;
                if ($scope.media.video === null) {
                    $scope.externalLink = $sce.trustAsResourceUrl(videoLink);
                } else {
                    $scope.videogular.sources = [
                        {src: $sce.trustAsResourceUrl(videoLink), type: 'video/mp4'}
                    ];
                }
            };
        }]);
})();
