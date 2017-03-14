(function(){
    'use strict';


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


            $scope.campaign = campaign;

            $scope.delete = function() {
                modalOptions.delete( campaign );
                $scope.$hide();
            };
        }]);
})();
