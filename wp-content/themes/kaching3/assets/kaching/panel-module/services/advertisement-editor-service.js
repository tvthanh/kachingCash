(function(){
    'use strict';

    angular.module('panelApp')
        .factory('advertisementEditorService', [ '$q', 'apiService', function( $q, apiService ) {
            return {
                getAdvertisments: getAdvertisments,
                getAdvertismentsByCategory: getAdvertismentsByCategory,
                getAdvertismentsByCategoryId: getAdvertismentsByCategoryId,
                getCategories: getCategories,
                saveAdvertisement: saveAdvertisement,
                updateCategories: updateCategories,
                updateMedia: updateMedia,
                deleteAdvert: deleteAdvert
            };
            function getAdvertisments (advertId) {
                var deferred = $q.defer();
                var url = '/advertisement/';

                if (advertId) {
                    url = url + advertId + '/';
                }

                apiService.get( url, null, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function getAdvertismentsByCategory () {
                var deferred = $q.defer();

                apiService.get( '/advertisement/category/', null, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function getAdvertismentsByCategoryId (id) {
                var deferred = $q.defer();

                apiService.get( '/advertisement/?category=' + id, null, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function getCategories( selectedCategories ) {

                var deferred = $q.defer();

                apiService.get( '/advertisement/category/', null, true ).then(
                    function( response ) {

                        var allCategories = true;
                        var categories = [];

                        angular.forEach( response.results, function( name, id ){

                            name.selected = true;
                            categories.push( name );
                        });

                        deferred.resolve({
                            allCategories: allCategories,
                            categories: categories
                        });
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function saveAdvertisement( advertisement ) {

                var deferred = $q.defer();

                if ( typeof advertisement.id === 'undefined' ) {
                    apiService.post( '/advertisement/', advertisement, true ).then(
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

            function updateCategories( advertisementId, settings ) {

                var deferred = $q.defer();
                var data = {};
                var error = {
                    validationErrors: {}
                };

                // Categories
                data.app_categories = [];
                angular.forEach( settings.categories, function( category ){
                    if ( settings.allCategories === true || category.selected === true ) {
                        data.app_categories.push( category.id );
                    }
                });
                if ( data.app_categories.length === 0 ) {
                    error.validationErrors.categories = true;
                }

                if ( _.isEmpty( error.validationErrors ) ) {
                    // Save data in the backend
                    //  http://127.0.0.1:8080/cms-api/advertisement/1/category/
                    apiService.patch( '/advertisement/' + advertisementId + '/category/', data.app_categories, true ).then(
                        function( response ) { deferred.resolve( response ); },
                        function( response ) { deferred.reject( response ); }
                    );
                } else {
                    deferred.reject( error );
                }

                return deferred.promise;
            }

            function updateMedia( advertisementId, media ) {

                var deferred = $q.defer();

                // Categories
                apiService.patch( '/advertisement/' + advertisementId + '/media/', media, true ).then(
                    function( response ) { deferred.resolve( response ); },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function deleteAdvert( advertId ) {

                var deferred = $q.defer();

                //http://54.179.156.207/cms-api/advertisement/9
                apiService.delete( '/advertisement/' + advertId + '/', false, true ).then(
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
