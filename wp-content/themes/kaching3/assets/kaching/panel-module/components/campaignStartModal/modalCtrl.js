(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'campaignStartModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'callbacks',
            'campaign',
        function (
            $scope,
            $alert,
            campaignsService,
            callbacks,
            campaign
        ) {

            $scope.campaign = campaign;

            $scope.activateCampaign = function() {
                callbacks.startCampaign( campaign );
                $scope.$hide();
            };
        }]);
})();
