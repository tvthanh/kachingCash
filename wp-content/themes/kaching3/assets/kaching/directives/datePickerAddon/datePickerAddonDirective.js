(function() {
    'use strict';
    angular.module('panelApp')
        .directive('datePickerAddon', ['kachingZonesHelpers', function(kachingZonesHelpers) {
            return {
                restrict: 'EA',
                scope: {
                    displayDate: '=',
                    dateRange: '=',
                    campaingStyle: '=',
                    clearStatus: '='
                },
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/directives/datePickerAddon/datePickerAddonTmpl.html',
                link: function(scope, ele, attrs) {
                    scope.$watch('dateRange', function(newValue, preValue) {
                        scope.hasDate = scope.dateRange.startDate ? true : false;
                    });

                    scope.clearCurrentDate = function(event) {
                        event.preventDefault();
                        scope.displayDate = 'Select date range';
                        scope.dateRange = {
                            dates: {
                                startDate: null,
                                endDate: null
                            }
                        };
                    };
                }
            };
        }]);

})();
