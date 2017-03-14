(function() {
    'use strict';

    angular.module('panelApp')
        .factory('mediaService', ['$q', 'apiService', function($q, apiService) {
            return {
                getMedia: getMedia,
                getMediaItem: getMediaItem,
                deleteMedia: deleteMedia,
                createMedia: createMedia,
                updateMedia: updateMedia,
                updateBeacons: updateBeacons,
                imageSizeHelper: imageSizeHelper,
                imageSizeValid: imageSizeValid,
                createMediaNew: createMediaNew,
                saveKachingZoneMedia: saveKachingZoneMedia,
                getShapes: getShapes,
                getMarkerStand: getMarkerStand,
                getMarkerSize: getMarkerSize,
                getMaterials: getMaterials,
                updateReward: updateReward,
                getMakerDimension: getMakerDimension,
                getDistance: getDistance,
                getGroups: getGroups,
                saveGroups: saveGroups
            };

            function getMedia(params) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 6,
                    offset: 0,
                    ordering: 'name'
                };

                if (typeof params === 'object') {
                    if ('limit' in params) {
                        requestParams.limit = params.limit;
                    }
                    if ('offset' in params) {
                        requestParams.offset = params.offset;
                    }
                    if ('ordering' in params) {
                        requestParams.ordering = params.ordering;
                    }
                    if ('name' in params) {
                        requestParams.name = params.name;
                    }
                }

                apiService.get('/media/', requestParams, true).then(
                    function(response) {
                        console.log('getMedia() success', response);
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function(response) {
                        console.log('getMedia() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function getMediaItem(mediaId) {

                var deferred = $q.defer();

                apiService.get('/media/' + mediaId + '/', false, true).then(
                    function(response) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function deleteMedia(mediaId) {

                var deferred = $q.defer();

                apiService.delete('/media/' + mediaId + '/', false, true).then(
                    function(response) {
                        console.log('deleteMedia() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('deleteMedia() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function createMedia(mediaName, externalLink) {

                var deferred = $q.defer();

                var data = {
                    name: mediaName
                };
                if (externalLink) {
                    data.video_external_link = externalLink;
                }

                apiService.post('/media/', data, true).then(
                    function(response) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function createMediaNew(media) {

                var deferred = $q.defer();

                var mediaData = {
                    name: media.name,
                    description: media.description,
                    ar_name: media.ar_name,
                    ar_appearance: 2,
                    image_name: media.image_name,
                    image_format: 'bill_board',
                    latitude: 10.123223,
                    longitude: 11.22322,
                    inclusion_zone: 100.4,
                    inclusion_zone_unit: 'KM',
                    ar_resource_type: 'image',
                    ar_resource: media.arResource,
                    display: media.display,
                    floor: media.floor,
                    address_group: media.address_group
                };

                var data = new FormData();
                data.append('name', mediaData.name);
                data.append('description', mediaData.description);
                data.append('ar_name', mediaData.ar_name);
                data.append('ar_appearance', mediaData.ar_appearance);
                data.append('image_name', mediaData.image_name);
                data.append('image_format', mediaData.image_format);
                data.append('latitude', mediaData.latitude);
                data.append('longitude', mediaData.longitude);
                data.append('inclusion_zone', mediaData.inclusion_zone);
                data.append('inclusion_zone_unit', mediaData.inclusion_zone_unit);
                data.append('ar_resource_type', mediaData.ar_resource_type);
                data.append('ar_resource', mediaData.ar_resource);
                data.append('display', mediaData.display);

                apiService.postMultiPartForm('/media/', data, true).then(
                    function(response) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function updateMedia(mediaItem, externalLink, id) {
                var deferred = $q.defer();

                // var data = {
                //     name: mediaItem.name
                // };
                var data = mediaItem;
                if (externalLink) {
                    data.video_external_link = externalLink;
                }

                apiService.patch('/media/' + id + '/', data, true).then(
                    function(response) {
                        console.log('updateMedia() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('updateMedia() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function updateBeacons(media, beacons) {
                var deferred = $q.defer();

                apiService.post('/media/' + media.id + '/beacons/', beacons, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function imageSizeHelper(imageFile) {

                var deferred = $q.defer();

                var reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = function(e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function() {
                        deferred.resolve({
                            width: this.width,
                            height: this.height
                        });
                    };
                };

                return deferred.promise;
            }

            function imageSizeValid(width, height) {
                if (width !== 1280) {
                    return false;
                }
                if (height !== 1200) {
                    return false;
                }
                return true;
            }

            function saveKachingZoneMedia(media) {

                var deferred = $q.defer();

                if (typeof media.id === 'undefined') {
                    apiService.postMultiPart('/media/', media, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );
                } else {
                    apiService.patchMultiPart('/media/' + media.id + '/', media, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );
                }

                return deferred.promise;
            }

            // Api address groups control

            function getGroups() {

                var deferred = $q.defer();

                apiService.get( '/address_groups/', null, true ).then(
                    function( response ) {
                        deferred.resolve(response);
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function saveGroups(data) {

                var deferred = $q.defer();

                apiService.post( '/address_groups/', data, true ).then(
                    function( response ) {
                        deferred.resolve(response);
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }
            // End Api address groups control

            function getShapes() {
                return [{
                    value: 'circle',
                    label: 'Circle'
                }, {
                    value: 'rectangle',
                    label: 'Rectangle'
                }, {
                    value: 'square',
                    label: 'Square'
                }];
            }

            function getMarkerStand() {
                return [{
                    value: 0,
                    label: 'None'
                }, {
                    value: 1,
                    label: 'Medium'
                }, {
                    value: 2,
                    label: 'High'
                }];
            }

            function getMarkerSize() {
                return [{
                    value: 2,
                    label: 'Large'
                }, {
                    value: 1,
                    label: 'Medium'
                }, {
                    value: 0,
                    label: 'Small'
                }];
            }

            function getMaterials() {
                return [
                    'wood',
                    'steel',
                    'aluminium'
                ];
            }

            function getMakerDimension() {
                return [{
                    label: 'Small',
                    value: '100,100'
                }, {
                    label: 'Medium',
                    value: '150,150'
                }, {
                    label: 'Large',
                    value: '257,257'
                }];
            }

            function getDistance() {
                return [{
                    label: 'Very close (< 5m)',
                    value: 1
                }, {
                    label: 'Close (< 20m)',
                    value: 10
                }, {
                    label: 'Near by (100m)',
                    value: 100
                }, {
                    label: 'Far (500m)',
                    value: 500
                }, {
                    label: 'Very far away (1 km)',
                    value: 1000
                }, {
                    label: '5km (developer mode only)',
                    value: 5000
                }];
            }

            function updateReward(mediaId, data) {

                var deferred = $q.defer();

                apiService.post('/media/' + mediaId + '/reward/', data, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }
        }]);
})();
