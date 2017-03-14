(function(){
    "use strict";

    console.log('apiService loaded');

    angular.module('kachingCore')
        .factory('apiService', [
            '$http',
            '$cookies',
            '$q',
            '$window',
            'apiUrl',
            'authToken',
        function(
            $http,
            $cookies,
            $q,
            $window,
            apiUrl,
            authToken
        ) {

            console.log('in apiService');

            var makeRequest = function( method, path, data, authRequired ) {

                console.log('in makeRequest()', method, path, data, authRequired);

                var deferred = $q.defer();

                var request = {
                    method: method,
                    url: apiUrl + path
                };

                if ( data ) {
                    if ( method === 'GET' ) {
                        request.params = data;
                    } else {
                        request.data = data;
                    }
                }

                if ( authRequired ) {
                    request.headers = {
                        'Authorization': 'Token ' + authToken.get( true )
                    };
                }

                $http( request ).then(
                    function( response ) {
                        console.log('makeRequest() success - response, status', response);
                        deferred.resolve( response.data );
                    },
                    function( response ) {
                        console.log('makeRequest() failure - response, status', response);
                        if ( response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null ) {
                            destroyCookies();
                            $window.location.href = kachingAppConfig.panelUrl + '#expired';
                        }
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var destroyCookies = function() {
                $cookies.remove( 'usertype', { path: '/' } );
                authToken.delete();
            };

            var getRequest = function( path, data, authRequired ) {
                console.log('in get()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'GET', path, data, authRequired );
            };

            var putRequest = function( path, data, authRequired ) {
                console.log('in put()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'PUT', path, data, authRequired );
            };

            var postRequest = function( path, data, authRequired ) {
                console.log('in post()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'POST', path, data, authRequired );
            };

            var patchRequest = function( path, data, authRequired ) {
                console.log('in patch()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'PATCH', path, data, authRequired );
            };

            var deleteRequest = function( path, data, authRequired ) {
                console.log('in delete()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'DELETE', path, data, authRequired );
            };

            return {
                get: getRequest,
                put: putRequest,
                post: postRequest,
                patch: patchRequest,
                delete: deleteRequest
            };
        }]);
})();