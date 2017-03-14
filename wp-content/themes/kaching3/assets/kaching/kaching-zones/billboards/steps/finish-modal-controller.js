(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'campaignFinishModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'modalOptions',
        function (
            $scope,
            $alert,
            campaignsService,
            modalOptions
        ) {

            $scope.activate = function() {
                modalOptions.activateCampaign().then(
                    function(){
                        $scope.$hide();
                        $alert({
                            // title: 'Campagin deleted.',
                            content: 'Activation successful',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });


                    },
                    function() {

                        $scope.$hide();
                        $alert({
                            // title: 'Campagin deleted.',
                            content: 'Cannot activation this campaign',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'error',
                            show: true
                        });
                    }
                );

            };
        }]);
})();
