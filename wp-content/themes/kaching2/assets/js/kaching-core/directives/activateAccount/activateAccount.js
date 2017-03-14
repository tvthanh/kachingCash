(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('activateAccount', [
            '$alert',
            '$modal',
            '$window',
            'authService',
            'userService',
            'utils',
        function (
            $alert,
            $modal,
            $window,
            authService,
            userService,
            utils
        ) {
            return {
                restrict: 'A',
                templateUrl: 'kaching-core/directives/activateAccount/activateAccountTmpl.html',
                controller: function( $scope ){

                    $scope.view = {
                        verificationError: false,
                        verificationSuccess: false,
                        verificationProcessing: false,
                        logginProcessing: false,
                        formError: false
                    };

                    $scope.loginFormData = {
                        email: '',
                        password: ''
                    };

                    $scope.view.verificationProcessing = true;

                    authService.logout().then(function() {

                        if ( typeof kachingQueryParams.uid !== 'string' || typeof kachingQueryParams.token !== 'string' ) {

                            $scope.view.verificationProcessing = false;
                            $scope.view.verificationError = true;

                        } else {

                            userService.activateAccount( kachingQueryParams.uid, kachingQueryParams.token ).then(
                                function() {
                                    $scope.view.verificationProcessing = false;
                                    $scope.view.verificationSuccess = true;
                                },
                                function() {
                                    $scope.view.verificationProcessing = false;
                                    $scope.view.verificationError = true;
                                }
                            );
                        }

                    });

                    $scope.signinFormSubmit = function() {

                        $scope.view.logginProcessing = true;
                        $scope.view.formError = false;

                        authService.login( $scope.loginFormData.email, $scope.loginFormData.password ).then(
                            function( user ){
                                $scope.view.logginProcessing = false;
                                $window.location.href = kachingAppConfig.panelUrl;
                            },
                            function(){
                                $scope.view.logginProcessing = false;
                                $scope.view.formError = true;
                            }
                        );
                    };
                }
            };
        }]);
})();
