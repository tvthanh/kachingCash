(function(){
    'use strict';

    angular.module('panelApp')
        .factory('coinMappingService', [ '$q', 'apiService', function( $q, apiService ) {

            return {
                getCountries: getCountries,
                updateRateExchange: updateRateExchange
            };

            function getCountries (params) {

                var deferred = $q.defer();

                apiService.get( '/countries/', null, true ).then(
                    function( response ) {
                        deferred.resolve({
                            count: response.length,
                            items: response
                        });
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            function updateRateExchange (item) {

                var deferred = $q.defer();

                var data = { rate_exchange: item.rate };

                // http://{{domain}}/cms-api/countries/41/changeRateExchange/

                apiService.put( '/countries/' + item.id + '/changeRateExchange/', data, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

        }]);
})();
