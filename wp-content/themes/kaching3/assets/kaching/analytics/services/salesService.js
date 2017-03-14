(function(){
    'use strict';

    angular.module('panelApp')
        .factory('salesService', [ '$q', 'apiService', function( $q, apiService ) {

            const WITH     = '/';

            return {
                getDataOf: get
            };

            function get ( taskName, period ) {
                switch (period.toLowerCase()) {
                    case 'week':
                        period = '?statistic_range=7';
                        break;
                    case 'month':
                        period = '?statistic_range=30';
                        break;
                    default:
                        break;
                }
                var deferred = $q.defer();
                var params = {};
                var request = '/statistic/';
                request += taskName + WITH + period;
                apiService.get( request, '', true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( error ) {
                        deferred.reject( error );
                    }
                );
                return deferred.promise;
            }
        }]);
})();
