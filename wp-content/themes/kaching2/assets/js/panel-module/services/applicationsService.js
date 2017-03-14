(function(){
    'use strict';

    angular.module('panelApp')
        .factory('applicationsService', [ '$q', 'apiService', 'userService', function( $q, apiService, userService ) {

            var getApps = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 10,
                    offset: 0
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'name' in params ) {
                        requestParams.name = params.name;
                    }
                    if ( 'api_key' in params ) {
                        requestParams.api_key = params.api_key;
                    }
                }

                apiService.get( '/applications/', requestParams, true ).then(
                    function( data ) {
                        console.log('getApps() success', data);
                        deferred.resolve({
                            count: data.count,
                            items: data.results
                        });
                    },
                    function( response ) {
                        console.log('getApps() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteApp = function( appId ) {

                var deferred = $q.defer();

                apiService.delete( '/applications/' + appId + '/', false, true ).then(
                    function( data ) {
                        console.log('deleteApp() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('deleteApp() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var addApp = function( appName, selectedCategories ) {

                var deferred = $q.defer();

                userService.getUser().then(
                    function ( user ) {

                        var data = {
                            name: appName,
                            publisher: user.id,
                            app_categories: selectedCategories
                        };

                        apiService.post( '/applications/', data, true ).then(
                            function( data ) {
                                console.log('addApp() success', data);
                                deferred.resolve( data );
                            },
                            function( response ) {
                                console.log('addApp() failure', response);
                                deferred.reject( response );
                            }
                        );
                    },
                    function () {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateApp = function( id, appName, selectedCategories ) {

                var deferred = $q.defer();

                var data = {
                    name: appName,
                    app_categories: selectedCategories
                };

                apiService.patch( '/applications/' + id + '/', data, true ).then(
                    function( data ) {
                        console.log('updateApp() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('updateApp() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getCategories = function( selectedCategories ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/categories/', null, true ).then(
                    function( response ) {

                        var categories = [];

                        angular.forEach( response, function( name, id ){

                            id = parseInt( id );
                            var item = { id: id, name: name, selected: false };

                            if ( typeof selectedCategories !== 'undefined' && selectedCategories.indexOf( id ) !== -1 ) {
                                item.selected = true;
                            }

                            categories.push( item );
                        });

                        deferred.resolve( categories );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            return {
                getApps: getApps,
                deleteApp: deleteApp,
                addApp: addApp,
                updateApp: updateApp,
                getCategories: getCategories
            };
        }]);
})();