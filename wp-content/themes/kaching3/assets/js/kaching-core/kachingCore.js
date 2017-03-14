(function(){
    'use strict';

    angular.module('kachingCore', [
        'underscore',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'ui.router',
        'mgcrea.ngStrap',
        'oc.lazyLoad',
        'highcharts-ng',
        'daterangepicker',
        'angularFileUpload',
        'ui.bootstrap'
    ]);

    angular.module('kachingCore')
        .constant( 'apiUrl', kachingAppConfig.apiUrl )
        .constant( 'sessionDays', 30 )
        .config(['$stateProvider','$urlRouterProvider','highchartsNGProvider', '$locationProvider', function config($stateProvider, $urlRouterProvider,highchartsNGProvider, $locationProvider) {
            $stateProvider.state('login', {
                url: '/login',
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/login/login-layout.html',
                controller: 'loginCtrl'
            }).state('activate', {
                url: '/activate/?uid&token',
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/activate/activate-layout.html'
            }).state('resetPassword', {
                url: '/reset-password/?uid&token',
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/reset-password/reset-password-layout.html'
            });
        }])

        .controller('kachingCoreCtrl', [
            '$scope',
            '$rootScope',
            '$ocLazyLoad',
            '$urlRouter',
            '$modal',
            '$window',
            'authService',
            '$state',
            '$alert',
        function(
            $scope,
            $rootScope,
            $ocLazyLoad,
            $urlRouter,
            $modal,
            $window,
            authService,
            $state,
            $alert
        ) {

            $rootScope.online = navigator.onLine;
            $window.addEventListener('offline', function() {
                $rootScope.$apply(function() {
                    $rootScope.online = false;
                });
            }, false);

            $window.addEventListener('online', function() {
                $rootScope.$apply(function() {
                    $rootScope.online = true;
                });
            }, false);

            $scope.$watch('online', function(status) {
                if (status || status === 'true') {
                } else {
                    $alert({
                        title: '',
                        content: 'Please check your network connection!',
                        container: '#alerts-container',
                        placement: 'top-right',
                        duration: 5,
                        type: 'danger',
                        show: true
                    });
                }
            });

            $rootScope.kachingAppConfig = kachingAppConfig;

            if ( kachingAppConfig.isHomePage === true && authService.isLoggedIn() ) {
                $window.location.href = kachingAppConfig.panelUrl;
            } else if ( kachingAppConfig.isPanelPage === true ) {
                $scope.isPanelPage = true;
                $ocLazyLoad.load( kachingAppConfig.wpTemplateUri + '/dist/js/panelApp.js').then(
                    function( panelApp ) {
                        $urlRouter.sync();
                    }
                );
            } else {
                $state.go('login');
            }

            $scope.showSignupDialog = function() {
                $modal({
                    templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/login/templates/signup-modal-tmpl.html',
                    controller: 'signupModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);

        angular.module('kachingCore').directive('enterPress', function() {
            return function(scope, element, attrs) {
                element.bind('keydown keypress', function(event) {
                    if (event.which === 13) {
                        scope.$apply(function() {
                            scope.$eval(attrs.enterPress);
                        });

                        event.preventDefault();
                    }
                });
            };
        });
})();
