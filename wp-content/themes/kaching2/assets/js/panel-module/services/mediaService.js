(function(){
    'use strict';

    angular.module('panelApp')
        .factory('mediaService', [ '$q', 'apiService', function( $q, apiService ) {

            var getMedia = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 6,
                    offset: 0,
                    ordering: 'name'
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'ordering' in params ) {
                        requestParams.ordering = params.ordering;
                    }
                    if ( 'name' in params ) {
                        requestParams.name = params.name;
                    }
                }

                apiService.get( '/media/', requestParams, true ).then(
                    function( response ) {
                        console.log('getMedia() success', response);
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function( response ) {
                        console.log('getMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getMediaItem = function( mediaId ) {

                var deferred = $q.defer();

                apiService.get( '/media/'+mediaId+'/', false, true ).then(
                    function( response ) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteMedia = function( mediaId ) {

                var deferred = $q.defer();

                apiService.delete( '/media/'+mediaId+'/', false, true ).then(
                    function( response ) {
                        console.log('deleteMedia() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var createMedia = function( mediaName ) {

                var deferred = $q.defer();

                var data = { name: mediaName };

                apiService.post( '/media/', data, true ).then(
                    function( response ) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateMedia = function( mediaItem ) {

                var deferred = $q.defer();

                var data = {
                    name: mediaItem.name
                };

                apiService.patch( '/media/' + mediaItem.id + '/', data, true ).then(
                    function( response ) {
                        console.log('updateMedia() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('updateMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var imageSizeHelper = function( imageFile ) {

                var deferred = $q.defer();

                var reader = new FileReader();
                reader.readAsDataURL( imageFile );
                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        deferred.resolve({
                            width: this.width,
                            height: this.height
                        });
                    };
                };

                return deferred.promise;
            };

            var imageSizeValid = function( width, height ) {
                if ( width !== 1280 ) {
                    return false;
                }
                if ( height !== 1200 ) {
                    return false;
                }
                return true;
            };

            return {
                getMedia: getMedia,
                getMediaItem: getMediaItem,
                deleteMedia: deleteMedia,
                createMedia: createMedia,
                updateMedia: updateMedia,
                imageSizeHelper: imageSizeHelper,
                imageSizeValid: imageSizeValid
            };
        }]);
})();