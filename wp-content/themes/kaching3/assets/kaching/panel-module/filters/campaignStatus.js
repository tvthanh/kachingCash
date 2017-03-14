(function(){
    'use strict';

    angular.module('panelApp')
        .filter('campaignStatus', function () {
            return function ( statusCode ) {
                var statusMap = [
                    'Incomplete',
                    'Billing',      // campaign that was created but the payment has to been yet processed
                    'Prepared',     // campaign created and waiting to go LIVE in their planned lottery
                    'Live',         // campaign currently available in KaChing
                    'Completed',
                    'Stopped'
                ];
                return statusMap[ parseInt(statusCode) ];
            };
        });

})();
