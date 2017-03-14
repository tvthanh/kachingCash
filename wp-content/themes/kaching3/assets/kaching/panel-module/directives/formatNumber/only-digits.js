(function(){
    'use strict';

    angular.module('panelApp')
        .directive('onlyDigits', ['$filter', function($filter){
            return {
               restrict: 'A',
               require: '?ngModel',
               link: function (scope, element, attrs, modelCtrl) {
                   modelCtrl.$parsers.push(function (inputValue) {
                       if (inputValue == undefined) return '';
                       var transformedInput = inputValue.replace(/[^0-9]/g, '');
                       transformedInput = $filter('number')(transformedInput);
                       if (transformedInput !== inputValue) {
                           modelCtrl.$setViewValue(transformedInput);
                           modelCtrl.$render();
                       }
                       return transformedInput;
                   });
               }
            };
        }]);
})();
