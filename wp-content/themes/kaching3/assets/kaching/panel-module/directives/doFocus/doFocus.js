(function() {
    'use strict';
    angular.module('panelApp')
        .directive('doFocus', function() {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    scope.$watch(attrs.doFocus, function(value) {
                        if (value === true || value === '') {
                            ele[0].focus();
                        }
                    })
                }
            };
        });
})();
