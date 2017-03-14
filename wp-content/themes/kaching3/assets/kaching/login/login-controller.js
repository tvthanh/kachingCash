(function(){
    'use strict';
    angular.module('kachingCore')
        .controller( 'loginCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$state',
            '$window',
            'authService',
            'utils',
            function (
                $scope,
                $alert,
                $modal,
                $state,
                $window,
                authService,
                utils
            ) {

                $scope.view = {
                    busy: false,
                    formError: false
                };

                $scope.loginFormData = {
                    email: '',
                    password: ''
                };

                $scope.signinFormSubmit = function() {


                    $scope.view.busy = true;
                    $scope.view.formError = false;

                    authService.login( $scope.loginFormData.email, $scope.loginFormData.password ).then(
                        function( user ){
                            $scope.view.busy = false;
                            $window.location.href = kachingAppConfig.panelUrl;
                        },
                        function(){
                            $scope.view.busy = false;
                            $scope.view.formError = true;
                        }
                    );

                };

                $scope.showSignupDialog = function() {
                    $modal({
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/signup/signup-tmpl.html',
                        controller: 'signupModalCtrl',
                        animation: 'am-fade-and-scale',
                        // placement: 'center',
                        backdrop: 'static'
                    });
                };

                $scope.showForgotPasswordDialog = function() {
                    $modal({
                        templateUrl: templateDirUri + '/assets/kaching/forgot-password/forgot-password-tmpl.html',
                        controller: 'forgotPasswordModalCtrl',
                        animation: 'am-fade-and-scale',
                        // placement: 'center'
                        backdrop: 'static'
                    });
                };

            }]);
})();
