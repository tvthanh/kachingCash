(function(){
    'use strict';

    angular.module('panelApp')
        .directive('urlInput', function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    ctrl.$validators.urlInput = function( modelValue, viewValue ) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }

                        var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
                        return urlRegex.test(viewValue);
                    };
                }
            };
        });

})();
