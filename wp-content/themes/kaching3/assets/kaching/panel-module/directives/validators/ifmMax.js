(function(){
    'use strict';

    angular.module('panelApp')
        .directive('ifmMax', function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    var maxVal = parseFloat( attr.ifmMax );
                    ctrl.$validators.ifmMax = function(modelValue, viewValue) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }
                        var val = parseFloat(viewValue);
                        if ( isNaN(val) ) {
                            return false;
                        }
                        return val <= maxVal;
                    };
                }
            };
        });

})();
