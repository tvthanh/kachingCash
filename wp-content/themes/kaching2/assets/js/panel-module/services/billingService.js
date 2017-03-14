(function(){
    'use strict';

    angular.module('panelApp')
        .factory('billingService', [
            '$q',
            'apiService',
            '$timeout',
            '$http',
            'apiUrl',
            'authToken',
        function(
            $q,
            apiService,
            $timeout,
            $http,
            apiUrl,
            authToken
        ) {

            var getCards = function() {

                var deferred = $q.defer();

                apiService.get( '/payments/cards/', false, true ).then(
                    function( response ) {
                        var cards = response.results;
                        if ( cards.length > 0 ) {
                            apiService.get( '/payments/cards/default/', false, true ).then(
                                function( response ){
                                    angular.forEach( cards, function( card ){
                                        card.default = ( card.payment_method_id === response.payment_method_id ) ? true : false;
                                    });
                                    deferred.resolve( cards );
                                },
                                function( response ){
                                    angular.forEach( cards, function( card ){
                                        card.default = false;
                                    });
                                    deferred.resolve( cards );
                                }
                            );
                        } else {
                            deferred.resolve( cards );
                        }
                    },
                    function( response ) {
                        console.log('getCards() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var addCard = function( data ) {

                var deferred = $q.defer();

                apiService.post( '/payments/cards/', data, true ).then(
                    function( response ) {
                        console.log('addCard() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('addCard() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteCard = function( id ) {

                var deferred = $q.defer();

                apiService.delete( '/payments/cards/' + id + '/', false, true ).then(
                    function( response ) {
                        console.log('deleteCard() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteCard() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var setMainCard = function( id ) {

                var deferred = $q.defer();

                apiService.post( '/payments/cards/' + id + '/default/', false, true ).then(
                    function( response ) {
                        console.log('setMainCard() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('setMainCard() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getMainCard = function() {

                var deferred = $q.defer();

                apiService.get( '/payments/cards/default/', false, true ).then(
                    function( response ){
                        deferred.resolve( response );
                    },
                    function( response ){
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getClientToken = function() {

                var deferred = $q.defer();

                apiService.get( '/payments/cards/client_token/', false, true ).then(
                    function( response ) {
                        console.log('getClientToken() success', response);
                        deferred.resolve( response.client_token );
                    },
                    function( response ) {
                        console.log('getClientToken() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var buyCredits = function( paymentMethodId, credits ) {

                var deferred = $q.defer();

                var data = { credits: credits };

                apiService.post( '/payments/cards/' + paymentMethodId + '/buy_credits/', data, true ).then(
                    function( response ) {
                        console.log('buyCredits() success', response);
                        deferred.resolve( response.client_token );
                    },
                    function( response ) {
                        console.log('buyCredits() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getTransactions = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 10,
                    offset: 0,
                    ordering: '-id'
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'start_date' in params ) {
                        requestParams.start_date = params.start_date;
                    }
                    if ( 'end_date' in params ) {
                        requestParams.end_date = params.end_date;
                    }
                }

                apiService.get( '/payments/transactions/', requestParams, true ).then(
                    function( response ) {
                        console.log('getTransactions() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getTransactions() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getInvoicePdf = function( transactionId ) {

                var deferred = $q.defer();

                var request = {
                    method: 'GET',
                    responseType: 'blob',
                    url: apiUrl + '/payments/transactions/' + transactionId + '/invoice/',
                    headers: {
                        'Authorization': 'Token ' + authToken.get( true )
                    }
                };

                $http( request ).then(
                    function( response ) {
                        var blob = new Blob( [ response.data ], { type: 'application/pdf' } );
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = 'kaching_transaction_' + transactionId + '.pdf';
                        link.click();
                        deferred.resolve( response );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            return {
                getCards: getCards,
                addCard: addCard,
                deleteCard: deleteCard,
                setMainCard: setMainCard,
                getMainCard: getMainCard,
                getClientToken: getClientToken,
                buyCredits: buyCredits,
                getTransactions: getTransactions,
                getInvoicePdf: getInvoicePdf
            };
        }]);
})();