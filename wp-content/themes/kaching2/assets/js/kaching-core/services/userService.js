(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('userService', [ '$q', 'apiService', function( $q, apiService ) {

            var user;

            var getUser = function() {

                var deferred = $q.defer();

                apiService.get( '/auth/me/', false, true ).then(
                    function( response ) {

                        console.log('getUser() success', response);

                        user = {
                            id:         response.id,
                            email:      response.email,
                            firstName:  response.first_name ? response.first_name : '',
                            lastName:   response.last_name ? response.last_name : '',
                            company:    response.company ? response.company : '',
                            country:    response.country ? response.country.toString() : undefined,
                            city:       response.city ? response.city : '',
                            address:    response.address ? response.address : '',
                            postalCode: response.postal_code ? response.postal_code : ''
                        };

                        deferred.resolve( user );
                    },
                    function( response ) {
                        console.log('getUser() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getBalance = function() {

                var deferred = $q.defer();

                apiService.get( '/auth/me/balance/', false, true ).then(
                    function( response ) {
                        console.log('getBalance() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getBalance() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateUser = function( user ) {

                var deferred = $q.defer();

                var data = {
                    first_name:  user.firstName,
                    last_name:   user.lastName,
                    email:       user.email,
                    company:     user.company,
                    country:     user.country,
                    city:        user.city,
                    address:     user.address,
                    postal_code: user.postalCode
                };

                apiService.patch( '/auth/me/', data, true ).then(
                    function( data ) {
                        console.log('updateUser() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('updateUser() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var changePassword = function( currentPassword, newPassword ) {

                var deferred = $q.defer();

                var data = {
                    new_password: newPassword,
                    current_password:  currentPassword
                };

                apiService.post( '/auth/password/', data, true ).then(
                    function( data ) {
                        console.log('changePassword() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('changePassword() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var passwordResetRequest = function( email ) {

                var deferred = $q.defer();

                var data = { email: email };

                apiService.post( '/auth/password/reset/', data, false ).then(
                    function( data ) {
                        console.log('passwordResetRequest() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('passwordResetRequest() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var passwordReset = function( password, uid, token ) {

                var deferred = $q.defer();

                var data = {
                    uid: uid,
                    token: token,
                    new_password: password
                };

                apiService.post( '/auth/password/reset/confirm/', data, false ).then(
                    function( data ) {
                        console.log('passwordReset() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('passwordReset() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var registerUser = function( user ) {

                var deferred = $q.defer();

                var data = {
                    first_name: user.firstName,
                    last_name:  user.lastName,
                    email:      user.email,
                    company:    user.company,
                    password:   user.password,
                    groups:     [1,2]
                };

                apiService.post( '/auth/register/', data, false ).then(
                    function( data ) {
                        console.log('registerUser() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('registerUser() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var activateAccount = function( uid, token ) {

                var deferred = $q.defer();

                var data = {
                    uid: uid,
                    token: token
                };

                apiService.post( '/auth/activate/', data, false ).then(
                    function( response ) {
                        console.log('activateAccount() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('activateAccount() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getCountries = function() {

                var deferred = $q.defer();

                apiService.get( '/countries/', null, true ).then(
                    function( response ) {
                        var countries = [];
                        angular.forEach( response, function( name, id ){
                            countries.push( { id: id, name: name } );
                        });
                        deferred.resolve( countries );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

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
        }]);
})();