(function(){
    'use strict';

    angular.module('panelApp')
        .filter('transactionType', function () {
            return function ( code ) {
                var statusMap = [
                    'One time pay'
                ];
                return statusMap[ parseInt(code) - 1 ];
            };
        });
})();
