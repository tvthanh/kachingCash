(function() {
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
            'ulabService',
            function(
                $q,
                $cookies,
                utils,
                apiService,
                authToken,
                userService,
                sessionDays,
                ulabService
            ) {
                return {
                    switchUserType: switchUserType,
                    isLoggedIn: isLoggedIn,
                    getUsertype: getUsertype,
                    isAdvertiser: isAdvertiser,
                    isDeveloper: isDeveloper,
                    login: login,
                    logout: logout
                };

                function switchUserType (type) {

                    var expires = new Date();
                    expires.setDate(expires.getDate() + sessionDays);

                    if (type === 'advertiser') {
                        if (isAdvertiser()) {
                            return false;
                        }
                        $cookies.put('usertype', 'advertiser', {
                            path: '/',
                            expires: expires
                        });
                        return true;
                    } else if (type === 'developer') {
                        if (isDeveloper()) {
                            return false;
                        }
                        $cookies.put('usertype', 'developer', {
                            path: '/',
                            expires: expires
                        });
                        return true;
                    }
                }

                function parseUsertype (usertype) {
                    usertype = parseInt(usertype);
                    if (usertype === 1) {
                        return 'advertiser';
                    } else if (usertype === 2) {
                        return 'developer';
                    } else {
                        return false;
                    }
                }

                function isLoggedIn () {
                    return (authToken.get(true) !== false && typeof getUsertype() !== 'undefined') ? true : false;
                }

                function getUsertype() {
                    return $cookies.get('usertype');
                }

                function isAdvertiser() {
                    return getUsertype() === 'advertiser';
                }

                function isDeveloper() {
                    return getUsertype() === 'developer';
                }

                function requestAuthToken (email, password) {

                    var deferred = $q.defer();

                    apiService.post('/api-token-auth/', {
                        email: email,
                        password: password
                    }).then(
                        function(response) {
                            deferred.resolve(response.token);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function login (email, password) {

                    var deferred = $q.defer();

                    $cookies.remove('usertype', {
                        path: '/'
                    });
                    authToken.delete();
                    ulabService.deleteUlabToken();

                    requestAuthToken(email, password).then(
                        function(token) {

                            // var expires = new Date();
                            // expires.setDate(expires.getDate() + sessionDays);
                            let now = new Date();
                            now.setHours(now.getHours() + 2);
                            let expires = now;

                            authToken.save(token, expires);

                            userService.getUser().then(
                                function(user) {
                                    $cookies.put('usertype', 'advertiser', {
                                        path: '/',
                                        expires: expires
                                    });
                                    deferred.resolve(user);
                                },
                                function() {
                                    deferred.reject();
                                }
                            );
                        },
                        function() {
                            deferred.reject();
                        }
                    );

                    ulabService.requestUlabAuthToken().then((ulabToken) => {
                        ulabService.saveUlabToken(ulabToken);
                    });

                    return deferred.promise;
                }

                function logout () {

                    var deferred = $q.defer();

                    apiService.post('/auth/logout/', false, true).finally(function() {
                        $cookies.remove('usertype', {
                            path: '/'
                        });
                        authToken.delete();
                        deferred.resolve();
                    });

                    ulabService.deleteUlabToken();

                    return deferred.promise;
                }
            }
        ]);
})();
