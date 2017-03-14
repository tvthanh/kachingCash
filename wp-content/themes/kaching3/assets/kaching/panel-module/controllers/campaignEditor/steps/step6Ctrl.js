(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'campaignEditorStep6Ctrl', [
            '$scope',
            '$state',
            '$sce',
            'utils',
            '$modal',
            'campaignsService',
            'campaignEditorService',
            'errorHandler',
        function (
            $scope,
            $state,
            $sce,
            utils,
            $modal,
            campaignsService,
            campaignEditorService,
            errorHandler
        ) {

            var editor = campaignEditorService;

            $scope.videogularApi = null;

            $scope.campaign = {};
            $scope.media = {};
            $scope.products = [];
            $scope.videogular = { sources: [] };

            $scope.view = {
                loading: true,
                playerReady: false,
                videoSet: false
            };

            $scope.externalLink = null;

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid') ||
                    ! editor.stepGet('step3', 'valid') ||
                    ! editor.stepGet('step4', 'valid') ||
                    ! editor.stepGet('step5', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step6');
                editor.previousState( 'campaigns.' + editor.mode() + '.step6' );

                $scope.campaignId = editor.dataGet( 'campaignId' );

                $scope.view.loading = true;

                campaignsService.getCampaign( $scope.campaignId ).then(
                    function( campaign ){

                        $scope.campaign = campaign;

                        if ( campaign.media.length > 0 && typeof campaign.media[0] === 'object' ) {
                            $scope.media = campaign.media[0];
                            $scope.setVideo();
                        }

                        if ( campaign.products.length > 0 ) {
                            $scope.products = campaign.products;
                        }

                        $scope.view.loading = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );

            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
                $scope.view.playerReady = true;
                $scope.setVideo();
            };

            $scope.setVideo = function() {
                // $scope.videogularApi.stop();
                // $scope.videogular.sources = [
                //     {src: $sce.trustAsResourceUrl($scope.media.video), type: 'video/mp4'}
                // ];
                // $scope.view.videoSet = true;

                $scope.videogularApi.stop();

                var videoLink = $scope.media.video || $scope.media.video_external_link;
                if ($scope.media.video === null) {
                    $scope.externalLink = $sce.trustAsResourceUrl(videoLink);
                } else {
                    $scope.videogular.sources = [
                        {src: $sce.trustAsResourceUrl(videoLink), type: 'video/mp4'}
                    ];
                }

                $scope.view.videoSet = true;
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step5' );
            };

            $scope.finish = function() {
                campaignsService.setPrepared( $scope.campaignId ).then(
                    function( response ) {
                        $state.go('campaigns');
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.hasProducts = function() {
                return ( $scope.products.length > 0 ) ? true : false;
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - media', angular.copy( $scope.campaign ), angular.copy( $scope.media ), angular.copy( $scope.products ) );
            };

            init();
        }]);
})();
