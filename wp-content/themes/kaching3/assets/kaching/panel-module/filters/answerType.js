(function(){
    'use strict';

    angular.module('panelApp')
        .filter('answerType', function () {
            return function ( type ) {
                var types = [ 'One Choice', 'Multiple Choice', 'Open Answer' ];
                return types[ parseInt(type)];
            };
        });
})();
