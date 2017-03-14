(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('authService', [
            '$q',
            '$cookies',
            'utils',
            'apiService',
            'authToken',
            'userService',
            'sessionDays',
        function(
            $q,
            $cookies,
            utils,
            apiService,
            authToken,
            userService,
            sessionDays
        ) {

            var switchUserType = function( type ) {

                var expires = new Date();
                expires.setDate( expires.getDate() + sessionDays );

                if ( type === 'advertiser' ) {
                    if ( isAdvertiser() ) {
                        return false;
                    }
                    $cookies.put( 'usertype', 'advertiser', { path: '/', expires: expires } );
                    return true;
                } else if ( type === 'developer' ) {
                    if ( isDeveloper() ) {
                        return false;
                    }
                    $cookies.put( 'usertype', 'developer', { path: '/', expires: expires } );
                    return true;
                }
            };

            var parseUsertype = function( usertype ) {
                usertype = parseInt( usertype );
                if ( usertype === 1 ) {
                    return 'advertiser';
                } else if ( usertype === 2 ) {
                    return 'developer';
                } else {
                    return false;
                }
            };

            var isLoggedIn = function() {
                return ( authToken.get( true ) !== false && typeof getUsertype() !== 'undefined' ) ? true : false;
            };

            var getUsertype = function() {
                return $cookies.get('usertype');
            };

            var isAdvertiser = function() {
                return getUsertype() === 'advertiser';
            };

            var isDeveloper = function() {
                return getUsertype() === 'developer';
            };

            var requestAuthToken = function( email, password ) {

                var deferred = $q.defer();

                apiService.post( '/api-token-auth/', { email: email, password: password } ).then(
                    function( response ) {
                        deferred.resolve( response.token );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var login = function( email, password ) {

                var deferred = $q.defer();

                $cookies.remove( 'usertype', { path: '/' } );
                authToken.delete();

                requestAuthToken( email, password ).then(
                    function( token ){

                        var expires = new Date();
                        expires.setDate( expires.getDate() + sessionDays );

                        authToken.save( token, expires );

                        userService.getUser().then(
                            function( user ) {
                                $cookies.put( 'usertype', 'advertiser', { path: '/', expires: expires } );
                                deferred.resolve( user );
                            },
                            function() {
                                deferred.reject();
                            }
                        );
                    },
                    function(){
                        deferred.reject();
                    }
                );

                return deferred.promise;
            };

            var logout = function() {

                var deferred = $q.defer();

                apiService.post( '/auth/logout/', false, true ).finally(function() {
                    $cookies.remove( 'usertype', { path: '/' } );
                    authToken.delete();
                    deferred.resolve();
                });

                return deferred.promise;
            };

            return {
                switchUserType: switchUserType,
                isLoggedIn: isLoggedIn,
                getUsertype: getUsertype,
                isAdvertiser: isAdvertiser,
                isDeveloper: isDeveloper,
                login: login,
                logout: logout
            };
        }]);
})();
