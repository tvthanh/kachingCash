(function(){
    'use strict';

    console.log('authToken loaded');

    angular.module('kachingCore')
        .factory('authToken', [ '$cookies', function( $cookies ) {

            var authToken;

            var saveToken = function( token, expires ) {
                $cookies.put( 'token', token, { path: '/', expires: expires } );
            };

            var deleteToken = function() {
                $cookies.remove( 'token', { path: '/' } );
            };

            var getToken = function( forceCookieCheck ) {

                if ( authToken && !forceCookieCheck ) {
                    return authToken;
                }

                var token = $cookies.get( 'token' );
                if ( token ) {
                    authToken = token;
                    return authToken;
                }

                return false;
            };

            return {
                save: saveToken,
                delete: deleteToken,
                get: getToken
            };
        }]);
})();