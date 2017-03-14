(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('passwordMatch', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.passwordMatch;
                    elem.add( firstPassword ).on( 'keyup', function() {
                        scope.$apply( function() {
                            var v = elem.val() === jQuery(firstPassword).val();
                            ctrl.$setValidity('pwmatch', v);
                        });
                    });
                }
            };
        }]);
})();