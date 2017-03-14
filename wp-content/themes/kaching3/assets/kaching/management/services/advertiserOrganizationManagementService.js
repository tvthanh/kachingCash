(function() {
    'use strict';

    angular.module('panelApp')
        .factory('advertiserOrganizationManagementService', [
            '$q',
            'apiService',
        function(
            $q,
            apiService
            ) {
                return {
                    getStatus: getStatus,
                    getAdvertiserOrganizationList: getAdvertiserOrganizationList,
                    deleteAdvertiser: deleteAdvertiser,
                    getAdvertiserDetail: getAdvertiserDetail,
                    updateAdvertiserDetail: updateAdvertiserDetail,
                    createAdvertisement: createAdvertisement,
                    getCountryList: getCountryList
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

                function getAdvertiserOrganizationList(params) {

                    var requestParams = {
                        page_size: 10,
                        page: 1,
                        limit: 10,
                        offset: 0
                    };

                    if ( typeof params === 'object' ) {
                        if ( 'page_size' in params ) {
                            requestParams.page_size = params.page_size;
                        }
                        if ( 'page' in params ) {
                            requestParams.page = params.page;
                        }
                        // if ( 'limit' in params ) {
                        //     requestParams.limit = params.limit;
                        // }
                        // if ( 'offset' in params ) {
                        //     requestParams.offset = params.offset;
                        // }
                        if ( 'name' in params ) {
                            requestParams.name = params.name;
                        }
                        if ( 'status' in params ) {
                            requestParams.status = params.status;
                        }
                    }

                    var deferred = $q.defer();
                    var request = '/companies/';
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

                function deleteAdvertiser ( advertiserId ) {

                    var deferred = $q.defer();

                    apiService.delete( '/companies/' + advertiserId + '/', false, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

                function getAdvertiserDetail (advertiserId) {
                    var deferred = $q.defer();

                    apiService.get( '/companies/' + advertiserId + '/', false, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

                function updateAdvertiserDetail (data) {
                    var deferred = $q.defer();
                    apiService.patch( '/companies/' + data.id + '/', data, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

                function createAdvertisement (data) {
                    var deferred = $q.defer();
                    apiService.post( '/companies/', data, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

                // getCountryList
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
        }]);
})();
