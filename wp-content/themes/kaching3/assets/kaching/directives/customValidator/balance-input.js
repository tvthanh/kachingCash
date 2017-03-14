(function() {
    'use strict';
    angular.module('panelApp')
        .directive('balanceInput', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    balance: '@'
                },
                link: function(scope, elem, attr, ngModel) {
                      //For DOM -> model validation
                      ngModel.$parsers.unshift(function(value) {
                          var spentCoins = attr.spentCoins || 1;
                          var  valid = (1*value >= 1*spentCoins) && (1*value <= 1*attr.balance);
                          ngModel.$setValidity('balanceInput', valid);
                          return value;
                      });

                      //For model -> DOM validation
                      ngModel.$formatters.unshift(function(value) {
                          return value;
                      });
                  }
            };
        });
})();
