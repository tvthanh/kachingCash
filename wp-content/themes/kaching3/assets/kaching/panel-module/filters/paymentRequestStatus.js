(function(){
    'use strict';

    angular.module('panelApp')
        .filter('paymentRequestStatus', function () {
            return function ( statusCode ) {
                var statusMap = [
                    'Pending',
                    'Completed',
                    'Cancel'
                ];
                return statusMap[ parseInt(statusCode) - 1 ];
            };
        });

})();
