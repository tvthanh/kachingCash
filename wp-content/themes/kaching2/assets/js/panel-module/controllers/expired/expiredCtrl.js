(function(){
    "use strict";

    console.log('expiredCtrl loaded');

    angular.module('panelApp')
        .controller( 'expiredCtrl', [ '$scope', '$state', 'authService', function ( $scope, $state, authService ) {

            console.log('in expiredCtrl');

            $scope.view = {
                busy: false,
                formError: false
            };

            $scope.loginFormData = {
                email: '',
                password: ''
            };

            $scope.signinFormSubmit = function() {

                console.log('in signinFormSubmit()', $scope.loginFormData.email, $scope.loginFormData.password);

                $scope.view.busy = true;
                $scope.view.formError = false;

                authService.login( $scope.loginFormData.email, $scope.loginFormData.password ).then(
                    function( user ){
                        $scope.view.busy = false;
                        if ( user.usertype === 1 ) {
                            $state.go('campaigns');
                        } else {
                            $state.go('apikeys');
                        }
                    },
                    function(){
                        $scope.view.busy = false;
                        $scope.view.formError = true;
                    }
                );

            };
        }]);

})();
