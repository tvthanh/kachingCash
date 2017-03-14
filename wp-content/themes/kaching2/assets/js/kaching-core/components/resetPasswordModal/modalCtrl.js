(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'resetPasswordModalCtrl', [
            '$scope',
            'errorHandler',
            '$modal',
            'utils',
            'userService',
        function (
            $scope,
            errorHandler,
            $modal,
            utils,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                sending: false,
                submitted: false,
                success: false
            };

            $scope.data = {
                newPassword: '',
                newPasswordRepeat: '',
                token: kachingAppConfig.resetPassword.token,
                uid: kachingAppConfig.resetPassword.uid
            };

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
                            errorHandler.processApiResponse( response );
                            $scope.$hide();
                        }
                    );
                }
            };

            $scope.showLoginDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                    controller: 'loginModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();