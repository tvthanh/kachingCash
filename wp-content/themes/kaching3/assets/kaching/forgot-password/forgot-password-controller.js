(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'forgotPasswordModalCtrl', [
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
                email: ''
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.formSubmit = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {

                    $scope.view.sending = true;

                    userService.passwordResetRequest( $scope.data.email ).then(
                        function( user ){
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
                    templateUrl: templateDirUri + '/assets/js/kaching-core/components/loginModal/modalTmpl.html',
                    controller: 'loginModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();
