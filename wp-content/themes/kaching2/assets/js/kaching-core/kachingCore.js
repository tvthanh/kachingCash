(function(){
    "use strict";

    console.log('kachingCore loaded');

    angular.module('kachingCore', [
        'underscore',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'ui.router',
        'mgcrea.ngStrap',
        'oc.lazyLoad',
        'kachingTmpl'
    ]);

    angular.module('kachingCore')

        .constant( 'apiUrl', kachingAppConfig.apiUrl )
        .constant( 'sessionDays', 30 )

        .controller('kachingCoreCtrl', [
            '$scope',
            '$rootScope',
            '$ocLazyLoad',
            '$urlRouter',
            '$modal',
            '$window',
            'authService',
        function(
            $scope,
            $rootScope,
            $ocLazyLoad,
            $urlRouter,
            $modal,
            $window,
            authService
        ) {

            if ( kachingAppConfig.isHomePage === true && authService.isLoggedIn() ) {
                $window.location.href = kachingAppConfig.panelUrl;
            } else if ( kachingAppConfig.isPanelPage === true ) {
                $scope.isPanelPage = true;
                $ocLazyLoad.load( kachingAppConfig.wpTemplateUri + '/dist/js/panelApp.min.js').then(
                    function( panelApp ) {
                        $urlRouter.sync();
                    }
                );
            }

            $scope.showSignupDialog = function() {
                $modal({
                    templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                    controller: 'signupModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();
