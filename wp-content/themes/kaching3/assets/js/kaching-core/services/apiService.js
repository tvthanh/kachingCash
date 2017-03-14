(function() {
    'use strict';


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


                return {
                    get: getRequest,
                    put: putRequest,
                    post: postRequest,
                    patch: patchRequest,
                    delete: deleteRequest,
                    postMultiPart: postMultiPart,
                    patchMultiPart: patchMultiPart
                };

                function makeRequest(method, path, data, authRequired) {


                    var deferred = $q.defer();

                    var request = {
                        method: method,
                        url: apiUrl + path
                    };

                    if (data) {
                        if (method === 'GET') {
                            request.params = data;
                        } else {
                            request.data = data;
                        }
                    }

                    if (authRequired) {
                        request.headers = {
                            'Authorization': 'Token ' + authToken.get(true)
                        };
                    }

                    $http(request).then(
                        function(response) {
                            deferred.resolve(response.data);
                        },
                        function(response) {
                            if (response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null) {
                                destroyCookies();
                                $window.location.href = kachingAppConfig.panelUrl + '#expired';
                            }
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function destroyCookies() {
                    $cookies.remove('usertype', {
                        path: '/'
                    });
                    authToken.delete();
                }

                function getRequest(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeRequest('GET', path, data, authRequired);
                }

                function putRequest(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeRequest('PUT', path, data, authRequired);
                }

                function postRequest(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeRequest('POST', path, data, authRequired);
                }

                function patchRequest(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeRequest('PATCH', path, data, authRequired);
                }

                function deleteRequest(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeRequest('DELETE', path, data, authRequired);
                }

                function makeMultiPartRequest(method, path, data, authRequired) {

                    var deferred = $q.defer();

                    var request = {
                        method: method,
                        url: apiUrl + path,
                        transformRequest: angular.identity
                    };

                    if (authRequired) {
                        request.headers = {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + authToken.get(true)
                        };
                    } else {
                        request.headers = {
                            'Content-Type': undefined
                        };
                    }

                    var fd = new FormData();

                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            fd.append(key, data[key]);
                        }
                    }

                    request.data = fd;

                    $http(request).then(
                        function(response) {
                            deferred.resolve(response.data);
                        },
                        function(response) {
                            if (response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null) {
                                destroyCookies();
                                $window.location.href = kachingAppConfig.panelUrl + '#expired';
                            }
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function postMultiPart(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeMultiPartRequest('POST', path, data, authRequired);
                }

                function patchMultiPart(path, data, authRequired) {
                    data = (typeof data !== 'object') ? false : data;
                    authRequired = (authRequired === true) ? true : false;
                    return makeMultiPartRequest('PATCH', path, data, authRequired);
                }

            }
        ]);
})();
