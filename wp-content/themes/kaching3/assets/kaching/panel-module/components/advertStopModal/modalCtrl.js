(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'advertStopModalCtrl', [
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

            $scope.stopCampaign = function() {
                callbacks.stopCampaign( campaign );
                $scope.$hide();
            };
        }]);
})();