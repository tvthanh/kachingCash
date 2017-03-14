(function(){
    'use strict';

    console.log('campaignDetailsModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'campaignDetailsModalCtrl', [
            '$scope',
            'errorHandler',
            '$sce',
            'campaignsService',
            'campaignId',
        function (
            $scope,
            errorHandler,
            $sce,
            campaignsService,
            campaignId
        ) {

            $scope.videogularApi = null;

            $scope.view = {
                busy: false
            };

            $scope.campaign = {};
            $scope.media = {};
            $scope.products = [];
            $scope.videogular = { sources: [] };

            $scope.view.busy = true;

            campaignsService.getCampaign( campaignId ).then(
                function( campaign ) {
                    $scope.campaign = campaign;
                    if ( campaign.products.length > 0 ) {
                        $scope.products = campaign.products;
                    }
                    if ( campaign.media.length > 0 ) {
                        $scope.media = campaign.media[0];
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
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.media.video), type: "video/mp4"}
                ];
            };
        }]);
})();