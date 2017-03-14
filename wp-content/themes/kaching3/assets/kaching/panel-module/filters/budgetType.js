(function(){
    'use strict';

    angular.module('panelApp')
        .filter('budgetType', function () {
            return function ( type ) {
                var types = [ 'Ongoing', 'Fixed', 'Daily' ];
                return types[ type - 1 ];
            };
        });
})();
