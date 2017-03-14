(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'profileCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$q',
            'utils',
            'errorHandler',
            'userService',
            'FileUploader',
        function (
            $scope,
            $alert,
            $modal,
            $q,
            utils,
            errorHandler,
            userService,
            FileUploader
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
            $scope.profileImageUploader = new FileUploader();

            $scope.previewImage = function(event) {
                var imageFile = event.target.files[0];
                if (imageFile) {
                    var reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.addEventListener('load', function() {
                        angular.element('#profileImage').css('background-image', 'url(' + reader.result + ')');
                    });

                    $scope.data.user.avatar = imageFile;
                }
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
                        angular.element('#profileImage').css('background-image', 'url(' + $scope.data.user.avatar + ')');
                        deferred1.resolve( user );
                    },
                    function( response ) {
                        deferred1.reject( response );
                    }
                );

                userService.getCountries().then(
                    function( countries ) {
                        $scope.data.countries = countries;
                        deferred2.resolve( countries );
                    },
                    function( response ) {
                        deferred2.reject( response );
                    }
                );

                $q.all( promisses ).then(
                    function() {
                        $scope.data.user.country = _.findWhere($scope.data.countries, {id: parseInt($scope.data.user.country)});
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
                    // templateUrl: 'panel-module/components/passwordChangeModal/modalTmpl.html',
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/passwordChangeModal/passwordChangeModal.html',
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

                    var data = {
                        address: $scope.data.user.address,
                        city: $scope.data.user.city,
                        company: $scope.data.user.company,
                        country: $scope.data.user.country.id,
                        email: $scope.data.user.email,
                        firstName: $scope.data.user.firstName,
                        id: $scope.data.user.id,
                        lastName: $scope.data.user.lastName,
                        postalCode: $scope.data.user.postalCode
                    };

                    // check avatar
                    if ($scope.data.user.avatar && typeof($scope.data.user.avatar) === 'object') {
                        $scope.data.avatar = $scope.data.user.avatar;
                    }

                    userService.updateUser( data ).then(
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
