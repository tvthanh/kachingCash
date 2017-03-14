(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newCardModalCtrl', [
            '$scope',
            'errorHandler',
            'utils',
            'callbacks',
            'billingService',
        function (
            $scope,
            errorHandler,
            utils,
            callbacks,
            billingService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                braintreeLoading: true,
                braintreeReady: false,
                nonceReceived: false,
                savingCard: false,
                cardSaved: false
            };

            var init = function() {

                billingService.getClientToken().then(
                    function( clientToken ) {

                        var btIntegration;

                        braintree.setup( clientToken, "dropin", {
                            container: "braintree-form",
                            onReady: function( integration ){
                                $scope.view.braintreeLoading = false;
                                btIntegration = integration;
                                $scope.view.braintreeReady = true;
                                $scope.$apply();
                            },
                            onPaymentMethodReceived: function( response ) {
                                console.log("onPaymentMethodReceived", response);
                                $scope.view.nonceReceived = true;
                                $scope.view.savingCard = true;

                                btIntegration.teardown(function(){
                                    btIntegration = null;
                                });

                                var data = {
                                    payment_method_nonce: response.nonce
                                };
                                billingService.addCard( data ).then(
                                    function(){
                                        $scope.view.savingCard = false;
                                        $scope.view.cardSaved = true;
                                        callbacks.cardAdded();
                                    },
                                    function( response ){
                                        errorHandler.processApiResponse( response );
                                        $scope.$hide();
                                    }
                                );
                            }
                        });
                    },
                    function(){
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            init();
        }]);
})();
