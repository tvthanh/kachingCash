(function(){
    "use strict";

    console.log('ifmNumber loaded');

    angular.module('panelApp')
        .directive("ifmNumber", function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    ctrl.$validators.ifmNumber = function( modelValue, viewValue ) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }
                        return !isNaN(parseFloat( viewValue )) && isFinite(viewValue);
                    };
                }
            };
        });

})();