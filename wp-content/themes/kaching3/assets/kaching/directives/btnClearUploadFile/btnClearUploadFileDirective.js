(function() {
    'use strict';
    angular.module('panelApp')
        .directive('btnClearUploadFile', ['kachingZonesHelpers', function(kachingZonesHelpers) {
            return {
                restrict: 'EA',
                scope: {
                    currentFile: '=',
                    imageName: '='
                },
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/directives/btnClearUploadFile/btnClearUploadFileTmpl.html',
                link: function(scope, ele, attrs) {
                    scope.$watch('currentFile', function(newValue, preValue) {
                        scope.hasFile = scope.currentFile ? true : false;
                    });

                    scope.clearCurrentFile = function() {
                        kachingZonesHelpers.clearFileUploader('#' + scope.imageName);
                        scope.currentFile ? scope.currentFile = null : scope.currentFile = scope.currentFile
                    };
                }
            };
        }]);

})();
