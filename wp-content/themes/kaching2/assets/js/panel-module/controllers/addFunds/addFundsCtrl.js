(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'addFundsCtrl', [
            '$q',
            'utils',
            '$scope',
            '$rootScope',
            'errorHandler',
            '$modal',
            'billingService',
            'userService',
        function (
            $q,
            utils,
            $scope,
            $rootScope,
            errorHandler,
            $modal,
            billingService,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                submitted: false,
                checkoutSuccess: false,
                checkoutFailure: false,
                paymentDeclined: false,
                mainCardError: false,
                showBillingDetailsForm: false
            };

            $scope.data = {
                card: {
                    masked_number: '',
                    expiration_date: null
                },
                countries: [],
                user: {
                    firstName:  '',
                    lastName: '',
                    company: '',
                    country: undefined,
                    city: '',
                    address: '',
                    postalCode: ''
                },
                amountsList: [ 500, 250, 100, 50 ],
                creditsCustomAmount: null,
                checkoutCredits: 0,
                checkoutTotal: 0,
                creditValue: null
            };

            var init = function() {

                $scope.view.loading = true;

                var deferred1 = $q.defer();
                var deferred2 = $q.defer();
                var deferred3 = $q.defer();
                var deferred4 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise,
                    deferred3.promise,
                    deferred4.promise
                ];

                billingService.getMainCard().then(
                    function( card ) {
                        $scope.data.card = card;
                        deferred1.resolve( card );
                    },
                    function( response ) {
                        $scope.view.mainCardError = true;
                        deferred1.reject( response );
                    }
                );

                userService.getBalance().then(
                    function( response ){
                        $scope.data.creditValue = ( 1 / response.cash_to_credits_conversion_ratio );
                        deferred2.resolve( $scope.data.creditValue );
                    },
                    function( response ){
                        deferred2.reject( response );
                    }
                );

                userService.getUser().then(
                    function( user ) {
                        $scope.data.user = {
                            firstName:  user.firstName,
                            lastName:   user.lastName,
                            company:    user.company,
                            country:    user.country,
                            city:       user.city,
                            address:    user.address,
                            postalCode: user.postalCode
                        };
                        deferred3.resolve( user );
                    },
                    function( response ) {
                        deferred3.reject( response );
                    }
                );

                userService.getCountries().then(
                    function( countries ) {
                        $scope.data.countries = countries;
                        deferred4.resolve( countries );
                    },
                    function( response ) {
                        deferred4.reject( response );
                    }
                );

                $q.all( promisses ).then(
                    function() {
                        if ( ! hasBillingDetails() ) {
                            $scope.view.showBillingDetailsForm = true;
                        }
                        $scope.view.loading = false;
                    },
                    function( response ) {
                        if ( $scope.view.mainCardError === true ) {
                            $scope.view.loading = false;
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );

            };

            var hasBillingDetails = function() {
                if ( $scope.data.user.firstName === '' ) { return false; }
                if ( $scope.data.user.lastName === '' ) { return false; }
                if ( $scope.data.user.company === '' ) { return false; }
                if ( $scope.data.user.country === undefined ) { return false; }
                if ( $scope.data.user.city === '' ) { return false; }
                if ( $scope.data.user.address === '' ) { return false; }
                if ( $scope.data.user.postalCode === '' ) { return false; }
                return true;
            };

            var resetData = function() {
                $scope.data.creditsCustomAmount = null;
                $scope.data.checkoutCredits = 0;
                $scope.data.checkoutTotal = 0;
            };

            var resetCheckoutStatus = function() {
                $scope.view.checkoutSuccess = false;
                $scope.view.checkoutFailure = false;
            };

            $scope.$watch( function(){ return $scope.data.checkoutCredits; }, function(){
                $scope.data.checkoutTotal = $scope.data.checkoutCredits * $scope.data.creditValue;
                if ( $scope.data.checkoutTotal > 0 ) {
                    resetCheckoutStatus();
                }
            });

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.changeBillingDetails = function() {
                $scope.view.showBillingDetailsForm = true;
            };

            $scope.selectCreditsPreset = function(amount) {
                $scope.data.checkoutCredits = amount;
                $scope.data.creditsCustomAmount = null;
            };

            $scope.selectCreditsCustom = function(amount) {
                $scope.data.checkoutCredits = amount;
            };

            $scope.checkoutCancel = function() {
                resetData();
            };

            $scope.checkoutCconfirm = function() {

                if ( $scope.view.showBillingDetailsForm && ! $scope.form1.$valid ) {

                    $scope.view.submitted = true;

                } else {

                    $scope.view.sending = true;
                    $scope.view.showBillingDetailsForm = false;

                    userService.updateUser( $scope.data.user ).then(
                        function(){
                            billingService.buyCredits( $scope.data.card.payment_method_id, $scope.data.checkoutCredits ).then(
                                function( response ){
                                    $scope.view.sending = false;
                                    $scope.view.checkoutSuccess = true;
                                    $rootScope.$broadcast('accountBalanceChanged');
                                    resetData();
                                },
                                function( response ){
                                    $scope.view.sending = false;
                                    if ( response.status === 400 && typeof response.data.error_code !== 'undefined' ) {
                                        if ( response.data.error_code === 1 ) {
                                            $scope.view.checkoutFailure = true;
                                        } else if ( response.data.error_code === 2 ) {
                                            $scope.view.paymentDeclined = true;
                                        }
                                    } else {
                                        errorHandler.processApiResponse( response );
                                    }
                                    resetData();
                                }
                            );
                        },
                        function( response ){
                            $scope.view.sending = false;
                            errorHandler.processApiResponse( response );
                        }
                    );

                }
            };

            init();
        }]);
})();
