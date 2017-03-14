(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'passwordChangeModalCtrl', [
            '$scope',
            '$alert',
            'errorHandler',
            'utils',
            'userService',
        function (
            $scope,
            $alert,
            errorHandler,
            utils,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                sending: false,
                submitted: false
            };

            $scope.data = {
                currentPassword: '',
                newPassword: '',
                newPasswordRepeat: ''
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.changePassword = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.changePassword( $scope.data.currentPassword, $scope.data.newPassword ).then(
                        function(){
                            $scope.view.sending = false;
                            $alert({
                                title: 'Your password has been changed.',
                                content: '',
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'success',
                                show: true
                            });
                            $scope.$hide();
                        },
                        function( response ){
                            console.log('changePassword response',response);
                            if ( response.status === 400 && typeof response.data.current_password !== 'undefined' ) {
                                $scope.form1.current_password.$setValidity('password', false);
                                $scope.view.sending = false;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        }
                    );
                }
            };
        }]);
})();