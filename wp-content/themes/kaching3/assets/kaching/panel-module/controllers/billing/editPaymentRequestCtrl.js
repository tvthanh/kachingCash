(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'editPaymentRequestCtrl', [
            '$scope',
            'errorHandler',
            'billingService',
            'userService',
            '$filter',
            '$stateParams',
            '$state',
            'paymentId',
            '$window',
        function (
            $scope,
            errorHandler,
            billingService,
            userService,
            $filter,
            $stateParams,
            $state,
            paymentId,
            $window
        ) {

            $scope.viewBusy = false;

            $scope.data = null;

            $scope.statusProp = {
                'value': 1,
                'status': [ 1, 2, 3]
            };

            $scope.saveForm = function() {

                $scope.viewBusy = true;

                billingService.updatePaymentRequestItem(paymentId, $scope.statusProp.value).then(
                    function( response ) {
                        $scope.viewBusy = false;
                        // $scope.$hide();
                        $window.location.reload();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var init = function() {
                var cache = $stateParams;
                getPaymentRequestItem();
            };

            function getPaymentRequestItem () {
                $scope.viewBusy = true;

                billingService.getPaymentRequestItem(paymentId).then(
                    function( response ) {
                        $scope.viewBusy = false;
                        $scope.payment = response;
                        $scope.statusProp.value = response.status;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            }

            init();

        }]);
})();
