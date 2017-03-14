(function(){
    'use strict';


    angular.module('panelApp')
        .directive('ifmMin', function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    var minVal = parseFloat( attr.ifmMin );
                    ctrl.$validators.ifmMin = function(modelValue, viewValue) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }
                        var val = parseFloat(viewValue);
                        if ( isNaN(val) ) {
                            return false;
                        }
                        return val >= minVal;
                    };
                }
            };
        });

})();
