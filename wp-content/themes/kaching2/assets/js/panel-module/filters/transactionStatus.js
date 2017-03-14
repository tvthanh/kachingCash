(function(){
    'use strict';

    angular.module('panelApp')
        .filter('transactionStatus', function () {
            return function ( statusCode ) {
                var statusMap = [
                    'Pending',
                    'Completed',
                    'Failed'
                ];
                return statusMap[ parseInt(statusCode) - 1 ];
            };
        });

})();
