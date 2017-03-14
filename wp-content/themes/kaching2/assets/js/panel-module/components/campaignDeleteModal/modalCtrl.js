(function(){
    'use strict';

    console.log('campaignDeleteModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'campaignDeleteModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'modalOptions',
            'campaign',
        function (
            $scope,
            $alert,
            campaignsService,
            modalOptions,
            campaign
        ) {

            console.log('in campaignDeleteModalCtrl', campaign);

            $scope.campaign = campaign;

            $scope.delete = function() {
                modalOptions.delete( campaign );
                $scope.$hide();
            };
        }]);
})();