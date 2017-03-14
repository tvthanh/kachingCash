(function(){
    "use strict";

    angular.module('kachingCore')
        .directive("panelNav", [ 'utils', 'authService', function( utils, authService ){
            return {
                restrict: 'A',
                scope: {
                    'loggedIn' : '='
                },
                templateUrl: 'kaching-core/directives/panelNav/panelNavTmpl.html',
                controller: function( $scope ) {

                    $scope.isPanel = kachingAppConfig.isPanelPage;

                    $scope.urls = {
                        campaigns: kachingAppConfig.panelUrl + '#/campaigns',
                        media:     kachingAppConfig.panelUrl + '#/media',
                        products:  kachingAppConfig.panelUrl + '#/products',
                        billing:   kachingAppConfig.panelUrl + '#/billing',
                        apikeys:   kachingAppConfig.panelUrl + '#/api-keys'
                    };

                    $scope.isAdvertiser = function() {
                        return authService.isAdvertiser();
                    };

                    $scope.isDeveloper = function() {
                        return authService.isDeveloper();
                    };
                }
            };
        }]);

})();