(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('errorHandler', [ '$alert', function( $alert ) {

            var processApiResponse = function( response ) {

                if ( response.status !== 403 ) {

                    $alert({
                        title: 'ERROR!',
                        content: 'An error has occured. Please try again later.',
                        container: '#alerts-container',
                        placement: 'top',
                        duration: 3,
                        type: 'danger',
                        show: true
                    });
                }
            };

            return {
                processApiResponse: processApiResponse
            };
        }]);
})();