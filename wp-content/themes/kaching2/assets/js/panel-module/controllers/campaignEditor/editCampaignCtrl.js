(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'editCampaignCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            'campaignEditorService',
            'campaignsService',
            'errorHandler',
            '$alert',
        function (
            $scope,
            $state,
            $stateParams,
            campaignEditorService,
            campaignsService,
            errorHandler,
            $alert
        ) {

            var editor = campaignEditorService;

            editor.init( $stateParams.campaignId );

            $scope.view = {
                currentTab: 'details'
            };

            $scope.data = {
                campaign: {}
            };

            campaignsService.getCampaign( $stateParams.campaignId ).then(
                function( campaign ) {
                    if ( campaign.status === 3 ) {
                        $state.go('campaigns');
                    }
                    $scope.data.campaign = campaign;
                },
                function( response ) {
                    errorHandler.processApiResponse( response );
                }
            );

            $scope.switchTab = function( tab ) {
                $scope.view.currentTab = tab;
            };

            $scope.isCurrentTab = function( tab ) {
                return $scope.view.currentTab === tab;
            };

        }]);
})();