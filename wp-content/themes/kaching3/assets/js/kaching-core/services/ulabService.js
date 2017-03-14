(function() {
    'use strict';


    angular.module('kachingCore')
        .factory('ulabService', [
            '$http',
            '$cookies',
            '$q',
            function(
                $http,
                $cookies,
                $q
            ) {

                var tokenInfo = null;


                return {
                    getToken: getToken,
                    requestUlabAuthToken: requestUlabAuthToken,
                    saveUlabToken: saveUlabToken,
                    deleteUlabToken: deleteUlabToken,
                    getUlabToken: getUlabToken
                };

                function getToken(forceNew) {
                    var deferred = $q.defer();

                    requestAuthToken().then(
                        function(token) {
                            // saveToken(token, token.expires_in);
                            deferred.resolve(token);
                        },
                        function(error) {
                            // deleteToken();
                            deferred.reject();
                        }
                    );

                    return deferred.promise;
                }

                function requestAuthToken() {
        			var deferred = $q.defer();

                    var data = {
        				client_id: 'kaching_2da03ec3',
        				client_secret: '5c853e7535e265cef8ax92Ka',
        				grant_type: 'client_credentials',
        				scope: 'client_access',
        			};

                    var request = {
                        method: 'POST',
                        url: 'http://search.ulab.com/oauth2',
                        headers: {
                            Accept: 'application/vnd.ulab.v0+json'
                        },
                        data: data
                    };

        			$http(request).then(function (result) {
        				if (result.data.status_code === 200) {
        					tokenInfo = {
        						token_type: result.data.token_type,
        						expires_in: result.data.expires_in,
        						access_token: result.data.access_token
        					};
        					deferred.resolve(tokenInfo);
        				} else {
        					deferred.reject();
        				}
        			}).catch(function (res) {
        				deferred.reject();
        			});

        			return deferred.promise;
        		}

                function requestUlabAuthToken() {
                    let deferred = $q.defer();

                    let data = {
        				client_id: 'kaching_2da03ec3',
        				client_secret: '5c853e7535e265cef8ax92Ka',
        				grant_type: 'client_credentials',
        				scope: 'client_access',
        			};

                    let request = {
                        method: 'POST',
                        url: 'http://search.ulab.com/oauth2',
                        headers: {
                            Accept: 'application/vnd.ulab.v0+json'
                        },
                        data: data
                    };

        			$http(request).then(function (result) {
        				if (result.data.status_code === 200) {
        					let token = {
        						name: result.data.token_type,
        						expires: result.data.expires_in,
        						value: result.data.access_token
        					};
        					deferred.resolve(token);
        				} else {
        					deferred.reject();
        				}
        			}).catch(function (res) {
        				deferred.reject();
        			});

        			return deferred.promise;
                }

                function saveUlabToken(token) {
                    let now = new Date();
                    now.setHours(now.getHours() + token.expires/3600);
                    let expires = now;
                    $cookies.put(token.name, token.value, {
                        path: '/',
                        expires: expires
                    });
                }

                function deleteUlabToken() {
                    $cookies.remove('Bearer', {
                        path: '/'
                    });
                }

                function getUlabToken() {
                    var token = $cookies.get('Bearer');
                    if(token) {return token;} else {return false;}
                }
            }
        ]);
})();
