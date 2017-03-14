(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('userService', [ '$q', 'apiService', function( $q, apiService ) {

            var user;


            return {
                getUser: getUser,
                getBalance: getBalance,
                updateUser: updateUser,
                changePassword: changePassword,
                passwordResetRequest: passwordResetRequest,
                passwordReset: passwordReset,
                registerUser: registerUser,
                activateAccount: activateAccount,
                getCountries: getCountries
            };

            function getUser() {

                var deferred = $q.defer();

                apiService.get( '/users/profile/', false, true ).then(
                    function( response ) {
                        user = {
                            id:         response.id,
                            email:      response.email,
                            firstName:  response.first_name ? response.first_name : '',
                            lastName:   response.last_name ? response.last_name : '',
                            company:    response.company ? response.company : '',
                            country:    response.country ? response.country.toString() : undefined,
                            city:       response.city ? response.city : '',
                            address:    response.address ? response.address : '',
                            postalCode: response.postal_code ? response.postal_code : '',
                            avatar:     response.avatar
                        };
                        document.cookie = 'isStaff='+response.is_staff + ';';
                        deferred.resolve( user );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function getBalance() {

                var deferred = $q.defer();

                apiService.get( '/auth/me/balance/', false, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function updateUser( user ) {

                var deferred = $q.defer();
                var data = {
                    first_name:  user.firstName,
                    last_name:   user.lastName,
                    email:       user.email,
                    company:     user.company,
                    country:     user.country,
                    city:        user.city,
                    address:     user.address,
                    postal_code: user.postalCode,
                    avatar:      user.avatar
                };

                if(data.avatar) {
                    apiService.patchMultiPart( '/users/profile/', data, true ).then(
                        function( data ) {
                            deferred.resolve( data );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );
                } else {
                    apiService.patch( '/users/profile/', data, true ).then(
                        function( data ) {
                            deferred.resolve( data );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );
                }
                return deferred.promise;
            }

            function changePassword( currentPassword, newPassword ) {

                var deferred = $q.defer();

                var data = {
                    new_password: newPassword,
                    current_password:  currentPassword
                };

                apiService.post( '/auth/password/', data, true ).then(
                    function( data ) {
                        deferred.resolve( data );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function passwordResetRequest( email ) {

                var deferred = $q.defer();

                var data = { email: email };

                apiService.post( '/auth/password/reset/', data, false ).then(
                    function( data ) {
                        deferred.resolve( data );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function passwordReset( password, uid, token ) {

                var deferred = $q.defer();

                var data = {
                    uid: uid,
                    token: token,
                    new_password: password
                };

                apiService.post( '/auth/password/reset/confirm/', data, false ).then(
                    function( data ) {
                        deferred.resolve( data );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function registerUser( user ) {

                var deferred = $q.defer();

                var data = {
                    first_name: user.firstName,
                    last_name:  user.lastName,
                    email:      user.email,
                    company:    user.company,
                    password:   user.password,
                    groups:     1,
                    company_code: user.company_code
                };

                if (user.avatar) {
                    data.avatar = user.avatar;
                }

                apiService.postMultiPart( '/auth/register/', data, false ).then(
                    function( data ) {
                        deferred.resolve( data );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function activateAccount( uid, token ) {

                var deferred = $q.defer();

                var data = {
                    uid: uid,
                    token: token
                };

                apiService.post( '/auth/activate/', data, false ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function getCountries() {

                var deferred = $q.defer();

                apiService.get( '/countries/', null, true ).then(
                    function( response ) {
                        var countries = [];
                        angular.forEach( response, function( item ){
                            countries.push( { id: item.id, name: item.short_name } );
                        });
                        deferred.resolve( countries );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

        }]);
})();
