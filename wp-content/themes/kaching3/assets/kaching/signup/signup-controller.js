(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'signupModalCtrl', [
            '$scope',
            '$rootScope',
            'errorHandler',
            '$modal',
            'utils',
            'userService',
            'FileUploader',
        function (
            $scope,
            $rootScope,
            errorHandler,
            $modal,
            utils,
            userService,
            FileUploader
        ) {
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
                password: '',
                avatar: undefined
            };

            $scope.view.signupSuccess = false;

            $scope.changeTooltipClass = function() {
                angular.element('.tooltip-inner').addClass('custom-tooltip-inner');
                angular.element('.tooltip-arrow').addClass('custom-tooltip-arrow');
            };

            $scope.fieldHasError = utils.fieldHasError;
            $scope.profileImageUploader = new FileUploader();

            $scope.previewImage = function(event) {
                var imageFile = event.target.files[0];
                if (imageFile) {
                    var reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.addEventListener('load', function() {
                        angular.element('#profileImage').css('background-image', 'url(' + reader.result + ')');
                    });

                    $scope.data.avatar = imageFile;
                }
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
                    switch ($scope.targetOption) {
                        case '1':
                            $scope.data.company_code = $scope.code;
                            break;
                        case '2':
                            $scope.data.company_code = 'demo';
                            break;
                        case '3':
                            $scope.data.company_code = 'temporary';
                            break;
                        default:

                    }
                    $scope.register();
                }
            };

            $scope.register = function() {
                userService.registerUser( $scope.data ).then(
                    function( repsonse ){
                        $scope.view.success = true;
                        $scope.view.signupSuccess = true;
                    },
                    function( response ){
                        $scope.view.signupSuccess = false;
                        $scope.view.success = false;
                        $scope.view.sending = false;

                        if ( response.status === 400 && hasEmailError( response ) ) {
                            $scope.form1.email.$setValidity('emailRegistered', false);
                            $scope.view.sending = false;
                        } else {
                            errorHandler.processApiResponse( response );
                            $scope.$hide();
                        }
                    }
                );
            };

            $scope.showCodeError = function() {
                return $scope.data && $scope.targetOption == 1;
            }
        }]);
})();
