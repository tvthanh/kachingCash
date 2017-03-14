(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('resetPassword', [
            '$alert',
            '$modal',
            'utils',
            'userService',
            '$location',
            '$state',
        function (
            $alert,
            $modal,
            utils,
            userService,
            $location,
            $state
        ) {
            return {
                restrict: 'A',
                templateUrl: templateDirUri + '/assets/js/kaching-core/directives/resetPassword/resetPasswordTmpl.html',
                controller: function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.view = {
                        urlError: false,
                        sending: false,
                        submitted: false,
                        success: false
                    };

                    var kachingQueryParams = {
                        uid: $location.search().uid,
                        token: $location.search().token
                    }

                    $scope.data = {
                        newPassword: '',
                        newPasswordRepeat: '',
                        token: kachingQueryParams.token,
                        uid: kachingQueryParams.uid
                    };

                    if ( typeof kachingQueryParams.uid === 'undefined' || typeof kachingQueryParams.token === 'undefined' ) {
                        $scope.view.urlError = true;
                    }

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.formSubmit = function() {
                        $scope.view.submitted = true;
                        if ( $scope.form1.$valid ) {

                            $scope.view.sending = true;

                            userService.passwordReset( $scope.data.newPassword, $scope.data.uid, $scope.data.token ).then(
                                function(){
                                    $scope.view.sending = false;
                                    $scope.view.success = true;
                                },
                                function( response ){
                                    $scope.view.urlError = true;
                                }
                            );
                        }
                    };

                    $scope.showLoginDialog = function() {
                        // $modal({
                        //     templateUrl: templateDirUri + '/assets/js/kaching-core/components/loginModal/modalTmpl.html',
                        //     controller: 'loginModalCtrl',
                        //     animation: 'am-fade-and-scale',
                        //     placement: 'center'
                        // });
                        $state.go('login');
                    };

                    $scope.showForgotPasswordDialog = function() {
                        // $modal({
                        //     templateUrl: templateDirUri + '/assets/js/kaching-core/components/forgotPasswordModal/modalTmpl.html',
                        //     controller: 'forgotPasswordModalCtrl',
                        //     animation: 'am-fade-and-scale',
                        //     placement: 'center'
                        // });
                        $modal({
                            templateUrl: templateDirUri + '/assets/kaching/forgot-password/forgot-password-tmpl.html',
                            controller: 'forgotPasswordModalCtrl',
                            animation: 'am-fade-and-scale',
                            // placement: 'center'
                            backdrop: 'static'
                        });
                    };

                }
            };
        }]);

})();
