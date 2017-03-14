(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'loginModalCtrl', [
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

            $scope.showSignupDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                    controller: 'signupModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

            $scope.showForgotPasswordDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/forgotPasswordModal/modalTmpl.html',
                    controller: 'forgotPasswordModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

            $scope.signinFormSubmit = function() {

                console.log('in signinFormSubmit()', $scope.loginFormData.email, $scope.loginFormData.password);

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

        }]);
})();