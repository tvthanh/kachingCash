(function() {
    'use strict';

    angular.module('panelApp')
        .factory('userManagementService', [
            '$q',
            'apiService',
        function(
            $q,
            apiService
            ) {
                return {
                    getStatus: getStatus,
                    getCountryList: getCountryList,
                    getUserList: getUserList,
                    getUserDetail: getUserDetail,
                    saveUserDetail: saveUserDetail,
                    createUser: createUser,
                    deleteUser: deleteUser
                }

                function getStatus() {
                    return [{
                        value: 0,
                        label: 'Pending'
                    }, {
                        value: 1,
                        label: 'Active'
                    }, {
                        value: 2,
                        label: 'Inactive'
                    }];
                }

                function getCountryList () {

                    var deferred = $q.defer();

                    apiService.get( '/countries/', null, true ).then(
                        function( response ) {
                            deferred.resolve(response);
                        },
                        function( response ) { deferred.reject( response ); }
                    );

                    return deferred.promise;
                }

                function getUserList(params) {

                    var requestParams = {
                        page_size: 10,
                        page: 1
                    };

                    if ( typeof params === 'object' ) {
                        if ( 'page_size' in params ) {
                            requestParams.page_size = params.page_size;
                        }
                        if ( 'page' in params ) {
                            requestParams.page = params.page;
                        }

                        if ( 'first_name' in params ) {
                            requestParams.first_name = params.first_name;
                        }

                        if ( 'last_name' in params ) {
                            requestParams.last_name = params.last_name;
                        }

                        if ( 'company' in params ) {
                            requestParams.company = params.company;
                        }

                        if ( 'status' in params ) {
                            requestParams.status = params.status;
                        }
                    }

                    var deferred = $q.defer();
                    var request = '/admin/users/';
                    apiService.get(request, requestParams, true).then(
                        function successful(response) {
                            deferred.resolve(response);
                        },
                        function fail(error) {
                            deferred.reject(error);
                        }
                    )
                    return deferred.promise;
                }

                function getUserDetail(userID) {
                    var deferred = $q.defer();

                    apiService.get( '/admin/users/' + userID + '/', false, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

                function saveUserDetail(data) {
                    var deferred = $q.defer();
                    if (data.avatar) {
                        apiService.patchMultiPart( '/admin/users/' + data.id + '/', data, true ).then(
                            function( response ) {
                                deferred.resolve( response );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    } else {
                        apiService.patch( '/admin/users/' + data.id + '/', data, true ).then(
                            function( response ) {
                                deferred.resolve( response );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    }
                    return deferred.promise;
                }

                function createUser(data) {
                    var deferred = $q.defer();
                    if (data.avatar) {
                        apiService.postMultiPart( '/admin/users/', data, true ).then(
                            function( response ) {
                                deferred.resolve( response );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    } else {
                        apiService.post( '/admin/users/', data, true ).then(
                            function( response ) {
                                deferred.resolve( response );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    }
                    return deferred.promise;
                }

                function deleteUser(userID) {

                    var deferred = $q.defer();

                    apiService.delete( '/admin/users/' + userID + '/', false, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

        }]);
})();
