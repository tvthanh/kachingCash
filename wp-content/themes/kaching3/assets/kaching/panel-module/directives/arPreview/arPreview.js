(function() {
    'use strict';
    angular.module('panelApp')
        .directive('arPreview', [
            'errorHandler',
            'utils',
            '$sce',
            function(
                errorHandler,
                utils,
                $sce
            ) {
                return {
                    restrict: 'E',
                    scope: {
                        media: '='
                    },
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/arPreview/arPreviewTmpl.html',
                    link: function(scope, ele, attrs) {
                    },
                    controller: function($scope) {
                        $scope.arType = false;

                        $scope.$watch('media', function (newVal, oldVal) {
                            if (!newVal) {
                                $scope.arType = false;
                                return false;
                            }

                            var previewItem = newVal.ar_resource;
                            if (!newVal.ar_resource) {
                                previewItem = newVal.target;
                            }

                            $scope.arType = utils.getArType(previewItem);

                            if ($scope.arType === false) {
                                return false;
                            }

                            $scope.arResource = previewItem;

                            if ($scope.arType == 'video') {
                                $scope.arResource = $sce.trustAsResourceUrl(previewItem);
                            }

                            if ($scope.arType == 'audio') {
                                $scope.arResource = $sce.trustAsResourceUrl(previewItem);
                            }
                        });

                    }
                };
            }
        ]);
})();
