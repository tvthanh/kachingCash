(function(){
    'use strict';

    angular.module('panelApp')
        .factory('analyticsService', [ '$q', 'apiService', function( $q, apiService ) {

            return {
                getStatisticCampaigns: getStatisticCampaigns
            };

            function getStatisticCampaigns ( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    page_size: 10,
                    page: 1
                };

                if ( typeof params === 'object' ) {
                    if ( 'page_size' in params ) {
                        requestParams.page_size = params.page_size;
                    }
                    if ( 'page' in params ) {
                        requestParams.page = params.page;
                    }
                }

                apiService.get( '/users/profile/statistic-campaigns/', requestParams, true ).then(
                    function( response ) {
                        deferred.resolve({
                            count: response.count,
                            items: response.results,
                            next: response.next,
                            previous: response.previous
                        });
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }
        }]);
})();
