(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'signupModalCtrl', [
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
                firstName: '',
                lastName: '',
                email: '',
                company: '',
                password: ''
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.clearCustomErrors = function() {
                $scope.form1.email.$setValidity( 'emailRegistered', true );
                $scope.form1.email.$setValidity( 'emailInvalid', true );
            };

            $scope.usertypeImgSrc = function( type ) {
                var image = '';
                if ( type === 'advertiser' ) {
                    image = ( $scope.data.usertype === 1 ) ? 'ic_advertiser_fill.svg' : 'ic_advertiser.svg';
                }
                if ( type === 'publisher' ) {
                    image = ( $scope.data.usertype === 2 ) ? 'ic_publisher_fill.svg' : 'ic_publisher.svg';
                }
                return kachingAppConfig.wpTemplateUri + '/assets/images/' + image;
            };

            var hasEmailError = function( response ) {
                var error = _.findWhere( response.data.errorDetails.paramsMistake.mistakenParams, {name:'email'} );
                if ( typeof error !== 'undefined' ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.signupFormSubmit = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.registerUser( $scope.data ).then(
                        function( repsonse ){
                            $scope.view.success = true;
                        },
                        function( response ){

                            $scope.view.sending = false;

                            if ( response.status === 400 && hasEmailError( response ) ) {
                                $scope.form1.email.$setValidity('emailRegistered', false);
                                // if ( response.data.email[0] === 'CMSUser with this email already exists.' ) {
                                //     $scope.form1.email.$setValidity('emailRegistered', false);
                                // } else {
                                //     $scope.form1.email.$setValidity('emailInvalid', false);
                                // }
                                $scope.view.sending = false;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
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