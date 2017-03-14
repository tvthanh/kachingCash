(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'profileCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$q',
            'utils',
            'errorHandler',
            'userService',
        function (
            $scope,
            $alert,
            $modal,
            $q,
            utils,
            errorHandler,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                submitted: false
            };

            $scope.data = {
                user: {},
                countries: []
            };

            var init = function() {

                var deferred1 = $q.defer();
                var deferred2 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise
                ];

                userService.getUser().then(
                    function( user ) {
                        $scope.data.user = user;
                        deferred1.resolve( user );
                    },
                    function( response ) {
                        deferred1.reject( response );
                    }
                );

                userService.getCountries().then(
                    function( countries ) {
                        console.log('countries',countries);
                        $scope.data.countries = countries;
                        deferred2.resolve( countries );
                    },
                    function( response ) {
                        deferred2.reject( response );
                    }
                );

                $q.all( promisses ).then(
                    function() {
                        $scope.view.loading = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.showPasswordChangeDialog = function() {
                $modal({
                    templateUrl: 'panel-module/components/passwordChangeModal/modalTmpl.html',
                    controller: 'passwordChangeModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: 'static'
                });
            };

            $scope.saveProfile = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.updateUser( $scope.data.user ).then(
                        function(){
                            $scope.view.sending = false;
                            $alert({
                                title: 'Account settings saved.',
                                content: '',
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'success',
                                show: true
                            });
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            init();
        }]);
})();
