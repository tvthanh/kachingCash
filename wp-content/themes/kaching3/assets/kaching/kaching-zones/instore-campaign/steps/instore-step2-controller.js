(function() {
    'use strict';

    angular.module('panelApp')
        .controller('instoreStep2Ctrl', [
            '$scope',
            '$state',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
            'countryService',
            'campaignEditorService',
            'campaignsService',
            '$http',
            '$q',
            'errorHandler',
            '$anchorScroll',
            '$location',
            'kachingZonesHelpers',
            'kachingZonecampaignEditorService',
            function(
                $scope,
                $state,
                apiUrl,
                authToken,
                utils,
                mediaService,
                FileUploader,
                countryService,
                campaignEditorService,
                campaignsService,
                $http,
                $q,
                errorHandler,
                $anchorScroll,
                $location,
                kachingZonesHelpers,
                kachingZonecampaignEditorService
            ) {
                var helper = kachingZonesHelpers;
                var editor = kachingZonecampaignEditorService;
                helper.preventDefaultByPressingEnter();
                $scope.formSummited = false;
                $scope.fieldHasError = utils.fieldHasError;
                $scope.$watch('selectedStore', function(newVal, oldVal) {
                    $scope.form1.$setPristine();
                });

                var uploader = $scope.uploader = new FileUploader({
                    url: apiUrl + '/media/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });
                uploader.onAfterAddingFile = function(newItem) {
                    utils.cleanupUploaderQueue(uploader);
                    if (newItem.alias === 'arDisplay') {
                        $scope.data.arImageFile = newItem._file;
                    }
                    if (newItem.alias === 'brandImage') {
                        $scope.data.brandImageFile = newItem._file;
                    }
                    if (newItem.alias === 'display') {
                        $scope.data.imageFile = newItem._file;
                        setTimeout(function(){
                            var $review = angular.element('.uploader-dropzone.image-selected');
                            var imgStyle = $review.attr('style');
                            $scope.imageList[$scope.imageReviewIdx] = imgStyle;
                            $scope.imageFileList[$scope.imageReviewIdx] = $scope.data.imageFile;
                            $scope.imageReviewIdx++;
                            if ($scope.imageReviewIdx === 4) {
                                $scope.imageReviewIdx = 0;
                            }

                            $scope.$apply();
                        }, 100);
                    }
                };

                function geocodePosition (marker) {
                    marker.icon.url = $scope.updateLogoIcon();
                    $scope.position = marker.getPosition();
                    $scope.$apply();
                    $scope.geocoder.geocode({
                        latLng: $scope.position
                    }, function(responses) {
                        if (responses && responses.length > 0) {
                            $scope.address = responses[0].formatted_address;
                        } else {
                            $scope.address = 'Cannot determine address at this location.';
                        }
                        var dumpImage = '/wp-content/themes/kaching3/assets/images/billboards/media-thumb.png';
                        var dumpLogo = '/wp-content/themes/kaching3/assets/images/logo.png';
                        var mapPopup =
                        `<div class='popup'>
                            <img class="popup-logo" src="${dumpLogo}">
                            <label class="popup-name">${$scope.campaign.name}</label>
                            <h6 class="popup-address">${responses[0].formatted_address}</h6>
                        </div>`;

                        $scope.infoWindow.setContent(mapPopup);
                        $scope.infoWindow.open($scope.map, marker);
                        $scope.map.setZoom(16);
                        $scope.map.setCenter($scope.selectedMarker.getPosition());
                        $scope.$apply();
                    });
                }
                function getSixDigit(num){
                    var number = '' + num;
                    var dotIndex = number.indexOf('.');
                    var intStr = number.substr(0, dotIndex + 1);
                    var decimalStr = number.substr(dotIndex + 1, 6);
                    return 1 * (intStr.concat(decimalStr));
                }
                function saveMedia() {

                    var deferred = $q.defer();
                    var hasAr = $scope.data.arImageFile !== null && typeof($scope.data.arImageFile) === 'object';

                    if ($scope.form1.$valid &&  (hasAr || $scope.storeList.length > 0) || $scope.selectedFormat.value === 'In-Store' && $scope.lastLocation !== undefined){
                        $scope.validateError = false;
                        $scope.isAddImage = false;

                        var mediaData = {
                            description: $scope.data.description,
                            type: $scope.selectedFormat.value,
                            ar_name: $scope.data.arImageName,
                            ar_appearance: $scope.appearance,
                            ar_resource_type: $scope.imageType,
                            target_name: $scope.data.imageName,
                            target_format: 'in_store',
                            inclusion_zone_unit: $scope.measure.code,
                            gender: $scope.selectedGender,
                            category: $scope.selectedCategory,
                            animation_type: $scope.data.animation,
                            marker_shape: $scope.shape && $scope.shape.value ? $scope.shape.value : null,
                            marker_material: $scope.material,
                            shop_name: $scope.address,
                            address: $scope.address
                        };

                        mediaData.inclusion_zone = $scope.inclusionZone || 0;

                        if ($scope.selectedStore && $scope.selectedStore.id) {
                            mediaData.front_store_shop = $scope.selectedStore.id;
                        }

                        if ($scope.selectedFormat.value === 'In-Store' && !$scope.latitude && !$scope.longitude && $scope.lastLocation !== undefined) {
                            mediaData.address = $scope.lastLocation.address;
                            mediaData.latitude = $scope.lastLocation.latitude;
                            mediaData.longitude = $scope.lastLocation.longitude;
                        } else {
                            mediaData.latitude = $scope.latitude;
                            mediaData.longitude = $scope.longitude;
                        }

                        if ($scope.data.url) {
                            mediaData.target_url = $scope.data.url;

                            if (mediaData.target_url.indexOf('http://') === -1) {
                                mediaData.target_url = 'http://' + mediaData.target_url;
                            }
                        }

                        if ($scope.editMode) {
                            mediaData.id = $scope.previewMediaId;
                        }

                        mediaData.latitude = getSixDigit(mediaData.latitude);
                        mediaData.longitude = getSixDigit(mediaData.longitude);

                        if($scope.data.arImageFile && typeof($scope.data.arImageFile) === 'object'){
                            mediaData.ar_resource = $scope.data.arImageFile;
                        }
                        if($scope.data.imageFile && typeof($scope.data.imageFile) === 'object'){
                            mediaData.target = $scope.data.imageFile;
                        } else {
                            if (!$scope.data.imageFile) {
                                mediaData.target = '';
                            }
                        }
                        if($scope.data.brandImageFile && typeof($scope.data.brandImageFile) === 'object'){
                            mediaData.brand_image = $scope.data.brandImageFile;
                        }
                        if ($scope.dimensionWidth && $scope.dimensionHeight) {
                            mediaData.marker_dimension = $scope.dimensionWidth + ',' + $scope.dimensionHeight;
                            mediaData.marker_shape = $scope.shape && $scope.shape.value ? $scope.shape.value : null;
                        }

                        mediaService.saveKachingZoneMedia(mediaData).then(
                            function(data){
                                deferred.resolve(data);
                            },
                            function(response){
                                deferred.reject(response);
                            }
                        );
                    } else {
                        $scope.validateError = true;
                        editor.stepSet('step2', 'valid', false);
                        setTimeout(function() {
                            helper.scrollToFirstError();
                        }, 100);
                        deferred.reject();
                    }
                    return deferred.promise;
                }
                function clearForm() {
                    helper.clearForm();

                    $scope.data = {
                        arImageFile: '',
                        imageFile: '',
                        mediaName: '',
                        mediaId: '',
                        imageName: '',
                        arImageName: '',
                        description: '',
                        brandImageFile: '',
                        brandDescription: '',
                        animation: ''
                    };

                    $scope.dimensionWidth = undefined;
                    $scope.dimensionHeight = undefined;
                    $scope.shape = $scope.shapes[0] || undefined;

                    helper.clearFileUploader('#imageFile');
                    helper.clearFileUploader('#arImageFile');
                    helper.clearFileUploader('#brandImageFile');
                    helper.clearFileUploader('.image-review-list');

                    $scope.imageList = [];
                    var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                    while($scope.imageList.length < 4) {
                      $scope.imageList.push(emptyImageStyle);
                    }
                    $scope.imageFileList = [];
                    $scope.imageReviewIdx = 0;

                    if (!!$scope.selectedMarker) {
                        $scope.selectedMarker.setMap(null);
                    }

                    $scope.position = null;
                    $scope.latitude = null;
                    $scope.longitude = null;
                    $scope.address = null;
                }
                function getMedia( mediaId ) {
                    var deferred = $q.defer();
                    $scope.view.busy = true;
                    mediaService.getMediaItem( mediaId ).then(
                        function( mediaItem ) {
                            $scope.view.busy = false;
                            $scope.media = mediaItem;
                            editor.dataSet('media', $scope.media);

                            editor.save('step2').then(
                                function(){
                                    $scope.campaignId = editor.dataGet( 'campaignId' );
                                    // show notification
                                    helper.alert('success', 'Media has been created.');
                                    deferred.resolve();
                                },
                                function( response ){
                                    errorHandler.processApiResponse( response );
                                    deferred.reject();
                                }
                            );
                        },
                        function() {
                            $scope.view.busy = false;
                            deferred.reject();
                        }
                    );
                    return deferred.promise;
                }
                function getCities(cities) {
                    angular.forEach( cities, function( item, id ){
                        countryService.getCities(item).then(
                            function(data) {
                                $scope.cityList = $scope.cityList.concat(data.geonames);
                                $scope.selectedCity = $scope.cityList[0];
                            }
                        );
                    });
                }
                function getFormats() {
                    $scope.formats = [
                        { value: 'store_front', label: 'Storefront' }
                    ];
                    $scope.selectedFormat = $scope.formats[0];
                }
                function finish() {

                    var deferred = $q.defer();
                    var campaignStatus = editor.dataGet('campaignStatus');
                    var campaign = editor.dataGet('campaign');

                    if (campaignStatus === 'start' && !campaign.status || $scope.editId) {
                        $scope.activeCampaign().then(
                            function(){
                                deferred.resolve();
                            },
                            function(){
                                deferred.reject();
                            }
                        );
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }
                function initTargetings() {
                    var deferred = $q.defer();
                    var targetingData = editor.dataGet('targeting');

                    if (!_.isEmpty(targetingData)) {
                        var cities = [];
                        angular.forEach( targetingData.locations, function( item, id ){
                            if (item.selected) {
                                cities.push(item.name.alpha2_code);
                            }
                        });
                        deferred.resolve(cities);
                    } else {
                        var id = $scope.editId || undefined;
                        campaignsService.getTargeting(id).then(
                            function(data) {
                                var cities = [];
                                angular.forEach(data.locations, function(item, id) {
                                    if (item.selected) {
                                        cities.push(item.name.alpha2_code);
                                    }
                                });
                                deferred.resolve(cities);
                            },
                            function(response) {
                                errorHandler.processApiResponse(response);
                                deferred.reject();
                            }
                        );
                    }
                    return deferred.promise;
                }
                function initShapeDimension() {
                    $scope.dimensionWidth = undefined;
                    $scope.dimensionHeight = undefined;
                    $scope.shapes = mediaService.getShapes();
                    $scope.shape = $scope.shapes[0] || undefined;
                }
                function init() {

                    if ($scope.form1) {
                        $scope.form1.$setPristine();
                    }

                    $scope.storeList  = [];
                    $scope.editId = $scope.editId || editor.dataGet('campaignId');
                    $scope.validateError = false;
                    $scope.isAddImage = false;
                    getFormats();
                    initShapeDimension();
                    $scope.materials = mediaService.getMaterials();
                    initStorefrontData();

                    if (!$scope.editId) {
                        if ( ! editor.stepGet('step1', 'valid') ) {
                            $scope.updateStep(editor.currentStep());
                        }
                    }

                    editor.currentStep(2);
                    editor.previousState(2);

                    $scope.storeList = [];
                    if ($scope.editId) {
                        initStorefrontData($scope.editId);
                    } else {
                        var storeListData = editor.dataGet('storeList');
                        if (  ! _.isEmpty( storeListData ) ) {
                            $scope.storeList = storeListData;
                        }
                    }

                    $scope.districtList = [];
                    $scope.cityList = [];

                    initTargetings().then(
                        function(data) {
                            getCities(data);
                            $scope.view.busy = false;
                        },
                        function() {
                            $scope.view.busy = false;
                        }
                    );

                    $scope.editMediaMode = false;
                    $scope.editMode = false;
                }
                function initStorefrontData() {
                    var deferred = $q.defer();
                    campaignsService.getCampaign($scope.editId).then(
                        function(data) {
                            $scope.campaign = data;
                            $scope.storeList = data.media;
                            $scope.storeList = [];

                            if (data.media.length > 0) {
                                angular.forEach( data.media, function( item, id ){
                                    if (item.type === 'store_front') {
                                        var storefrontItem = {
                                            id: item.id,
                                            name: item.front_store_shop_name || 'undefined',
                                            media: _.where(data.media,{front_store_shop:item.id})
                                        };

                                        if (item.ar_resource_type === 'video') {
                                            storefrontItem.hasVideo  = true;
                                            storefrontItem.hasImage =  _.find(storefrontItem.media,{ar_resource_type:'image'}) ? true : false;
                                        } else {
                                            if (item.ar_resource_type === 'image') {
                                                storefrontItem.hasImage  = true;
                                                storefrontItem.hasVideo =  _.find(storefrontItem.media,{ar_resource_type:'video'}) ? true : false;
                                            } else {
                                                storefrontItem.hasVideo = _.find(storefrontItem.media,{ar_resource_type:'video'}) ? true : false;
                                                storefrontItem.hasImage = _.find(storefrontItem.media,{ar_resource_type:'image'}) ? true : false;
                                            }
                                        }
                                        storefrontItem.media.unshift(item);
                                        $scope.storeList.push(storefrontItem);
                                    }
                                });

                                $scope.selectedStore = $scope.storeList[0];
                                if ($scope.storeList.length > 0) {
                                    $scope.formats = [
                                        { value: 'store_front', label: 'Storefront' },
                                        { value: 'in_store', label: 'In-Store' }
                                    ];
                                } else {
                                    $scope.formats = [
                                        { value: 'store_front', label: 'Storefront' }
                                    ];
                                }

                                deferred.resolve();
                            } else {
                                $scope.formats = [
                                    { value: 'store_front', label: 'Storefront' }
                                ];
                                deferred.reject();
                            }
                        }
                    );
                    return deferred.promise;
                }
                function checkFormPristine() {
                    if (!$scope.form1.$pristine) {
                        return false;
                    } else {
                        if ($scope.latitude || $scope.longitude) {
                            return false;
                        }
                        for (var property in $scope.data) {
                            if ($scope.data[property]) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                function placeMarker (location, keepAddress) {
                    $scope.updateLogoIcon();
                    if (!!$scope.selectedMarker) {
                        $scope.selectedMarker.setMap(null);
                    }

                    $scope.selectedMarker = new google.maps.Marker({
                        position: location,
                        map: $scope.map,
                        draggable: true,
                        icon: $scope.iconMarker
                    });

                    var marker = $scope.selectedMarker;
                    var pos = marker.getPosition();

                    $scope.geocoder.geocode({
                        latLng: pos
                    }, function(responses) {
                        var address = 'Cannot determine address at this location.';
                        if (!keepAddress) {
                            if (responses && responses.length > 0) {
                                $scope.address = address = responses[0].formatted_address;
                            }
                        } else {
                            address = responses[0].formatted_address;
                        }

                        $scope.$apply();
                        var dumpImage = '/wp-content/themes/kaching3/assets/images/billboards/media-thumb.png';
                        var dumpLogo = '/wp-content/themes/kaching3/assets/images/logo.png';
                        var mapPopup =
                        `<div class='popup'>
                            <img class="popup-logo" src="${dumpLogo}">
                            <label class="popup-name">${$scope.campaign.name}</label>
                            <h6 class="popup-address">${address}</h6>
                        </div>`;

                        $scope.infoWindow.setContent(mapPopup);
                        $scope.infoWindow.open($scope.map, marker);
                        $scope.map.setZoom(16);
                        $scope.map.setCenter($scope.selectedMarker.getPosition());
                    });

                    google.maps.event.addListener(marker, 'dragend', function(event) {
                        $scope.position = event.latLng;
                        $scope.latitude = $scope.position.lat();
                        $scope.longitude = $scope.position.lng();
                        $scope.searchBoxMarker.forEach(function(marker) {
                            marker.setMap(null);
                        });
                        $scope.searchBoxMarker = [];
                        $scope.$apply();
                        geocodePosition(marker);
                    });
                }

                var imageStyle = 'background-image: none;border-color: #ccc;';
                $scope.imageList = [imageStyle,imageStyle,imageStyle,imageStyle];
                $scope.imageFileList = [];
                $scope.imageReviewIdx = 0;
                $scope.selectedMarker = null;
                $scope.searchBoxMarker = [];

                var mapOptions = {
                    zoom: 4,
                    center: new google.maps.LatLng(40.0000, -98.0000),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };

                $scope.updateLogoIcon = function(useDefault) {
                    var imageUrl = '';
                    if (useDefault) {
                        $scope.data.brandImageFile = '';
                        helper.clearFileUploader('#brandImageFile');
                    }
                    if($scope.data.brandImageFile) {
                        imageUrl = document.getElementById('brandImageFile').style.backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, '');
                        if (!imageUrl) {
                            var idx = $scope.data.brandImageFile.lastIndexOf('.');
                            if (idx !== -1) {
                                if ('|jpg|png|jpeg|'.indexOf($scope.data.brandImageFile.substr(idx + 1)) !== -1) {
                                    imageUrl = $scope.data.brandImageFile;
                                }
                            }
                        }
                    }

                    if (!imageUrl) {
                        imageUrl = kachingAppConfig.wpTemplateUri + '/assets/images/crowblackedit.png';
                    }

                    $scope.iconMarker = {
                        url: imageUrl,
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(50, 50)
                    };

                    return imageUrl;
                };

                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                google.maps.event.addListenerOnce($scope.map, 'mouseover', () => {
                    // This method is a trick to re-render map for the first time map renders.
                    google.maps.event.trigger($scope.map, 'resize');
                });
                google.maps.event.addListenerOnce($scope.map, 'idle', () => {
                    // This method is a trick to re-render map for the first time map renders.
                    google.maps.event.trigger($scope.map, 'resize');
                });
                $scope.geocoder = new google.maps.Geocoder();
                $scope.infoWindow = new google.maps.InfoWindow();

                // Create the search box and link it to the UI element.
                var input = document.getElementById('pac-input');
                var searchBox = new google.maps.places.SearchBox(input);
                $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                // Bias the SearchBox results towards current map's viewport.
                $scope.map.addListener('bounds_changed', function() {
                    searchBox.setBounds($scope.map.getBounds());
                });

                // var markers = [];
                $scope.searchBoxMarker = [];
                // Listen for the event fired when the user selects a prediction and retrieve
                // more details for that place.
                searchBox.addListener('places_changed', function()  {
                    $scope.updateLogoIcon();
                    // searchBox.set($scope.map, null);
                    var places = searchBox.getPlaces();

                    if (places.length === 0) {
                        return;
                    }
                    // Clear out the old markers.
                    $scope.searchBoxMarker.forEach(function(marker) {
                        marker.setMap(null);
                    });
                    $scope.searchBoxMarker = [];

                    // For each place, get the icon, name and location.
                    var bounds = new google.maps.LatLngBounds();

                    if (places.length > 0) {
                        $scope.position = places[0].geometry.location;
                        $scope.address = places[0].formatted_address;
                        $scope.latitude = $scope.position.lat();
                        $scope.longitude = $scope.position.lng();
                        $scope.$apply();
                    }

                    placeMarker(places[0].geometry.location);

                    places.forEach(function(place) {
                        if (!place.geometry) {
                            console.log('Returned place contains no geometry');
                            return;
                        }
                        var newMarker = new google.maps.Marker({
                            map: $scope.map,
                            icon: $scope.iconMarker,
                            title: place.name,
                            position: place.geometry.location
                        });

                        google.maps.event.addListener(newMarker, 'dragend', function() {
                            geocodePosition(newMarker);
                        });

                        $scope.searchBoxMarker.push(newMarker);

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    $scope.map.fitBounds(bounds);
                    $scope.$apply();
                });

                google.maps.event.addListener($scope.map, 'click', function(event) {
                    $scope.position = event.latLng;
                    $scope.latitude = $scope.position.lat();
                    $scope.longitude = $scope.position.lng();
                    placeMarker(event.latLng);
                    $scope.searchBoxMarker.forEach(function(marker) {
                        marker.setMap(null);
                    });
                    $scope.searchBoxMarker = [];
                    $scope.$apply();
                });

                $scope.view = {
                    busy: true,
                    uploading: false,
                    submitted: false,
                    mediaCreated: false
                };
                $scope.data = {
                    arImageFile: '',
                    imageFile: '',
                    mediaName: '',
                    mediaId: '',
                    imageName: '',
                    arImageName: '',
                    description: '',
                    brandImageFile: '',
                    brandDescription: '',
                    animation: ''
                };
                $scope.genders = ['Male', 'Female'];
                $scope.categories = ['T-shirt'];
                $scope.position = null;
                $scope.measures = [
                    { name: 'Meters', code: 'meter' },
                    { name: 'Kilometres', code: 'kilometre' }
                ];
                $scope.mediaTypeProp = {
                    'type': 'select',
                    'name': 'media_type',
                    'mediaTypeSelect': 'Upload Media',
                    'values': ['Upload Media', 'External Link']
                };
                $scope.iconMarker = {
                    url: kachingAppConfig.wpTemplateUri + '/assets/images/crowblackedit.png',
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(50, 50)
                };
                $scope.errors = {
                    video: {},
                    image: {},
                    arImage: {}
                };

                $scope.updateMapManually = function() {
                    if(isNaN($scope.latitude)) {
                        if($scope.latitude === '-') {
                            return;
                        } else {
                            $scope.latitude = 0;
                        }
                    }
                    if(isNaN($scope.longitude)) {
                        if($scope.longitude === '-') {
                            return;
                        } else {
                            $scope.longitude = 0;
                        }
                    }
                    $scope.position = {lat: Number($scope.latitude), lng: Number($scope.longitude)};
                    placeMarker($scope.position);
                    $scope.searchBoxMarker.forEach(function(marker) {
                        marker.setMap(null);
                    });
                    $scope.searchBoxMarker = [];
                };
                $scope.updateReviewIndex = function(idx) {
                    $scope.imageReviewIdx = idx;
                    $scope.data.imageFile = $scope.imageFileList[$scope.imageReviewIdx];
                    console.log($scope.data.imageFile);
                };
                $scope.showErrors = function() {
                    return ($scope.storeList.length === 0 && editor.stepGet('step2', 'submitted')) || $scope.validateError;
                };
                $scope.imageHasError = function() {
                    if (typeof $scope.data.imageFile !== 'object') {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.arImageHasError = function() {
                    if(typeof $scope.data.arImageFile !== 'object') {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.changeFormat = function() {
                    if ($scope.selectedFormat && $scope.selectedFormat.value === 'in_store') {
                        $scope.latitude = $scope.selectedStore.media[0].latitude;
                        $scope.longitude = $scope.selectedStore.media[0].longitude;
                    } else {
                        $scope.latitude = null;
                        $scope.longitude = null;
                    }
                };
                $scope.submitMedia = function() {
                    var deferred = $q.defer();

                    if($scope.form1.$valid) {
                        $scope.view.busy = true;
                        saveMedia().then(
                            function(data){
                                $scope.form1.$setPristine();
                                if ($scope.editMode) {
                                    $scope.editMode = false;
                                    helper.alert('success', 'Media has been updated.');
                                    $scope.view.busy = false;
                                    clearForm();
                                    initStorefrontData();
                                    deferred.resolve();
                                } else {
                                    $scope.storeList.push(data);
                                    editor.dataSet('storeList', $scope.storeList);
                                    getMedia(data.id).then(
                                        function() {
                                            initStorefrontData();
                                            deferred.resolve();
                                        },
                                        function() {
                                            deferred.reject();
                                        }
                                    );
                                    clearForm();
                                }

                                $scope.lastLocation = {
                                    address: data.address,
                                    latitude: data.latitude,
                                    longitude: data.longitude
                                };
                                $scope.form1.$setPristine();
                            },
                            function (response) {
                                $scope.form1.$setPristine();
                                $scope.view.busy = false;
                                deferred.reject();
                            }
                        );
                    } else {
                        helper.scrollToFirstError($scope);
                        helper.alert('danger', 'Please fill all required fields');
                        deferred.reject();
                    }
                    return deferred.promise;
                };
                $scope.removeAddImageForm = function() {
                    $scope.data.description = '';
                    $scope.data.imageName = '';
                    $scope.data.imageFile = '';
                    helper.clearFileUploader('#imageFile');
                    helper.clearFileUploader('.image-review-list');
                    $scope.imageList = [];
                    $scope.imageReviewIdx = 0;
                    var imageStyle = 'background-image: none;border-color: #ccc;';
                    $scope.imageList = [imageStyle, imageStyle, imageStyle, imageStyle];

                    var mediaData = {
                        description: '',
                        target: '',
                        target_name: '',
                        target_format: ''
                    };

                    $scope.isAddImage = false;
                };
                $scope.cancelEdit = function() {
                    clearForm();
                    $scope.editMode = false;
                    $scope.isAddImage = false;
                };
                $scope.editMedia = function(mediaId) {
                    clearForm();
                    helper.alert('info', 'You are in edit mode!');
                    $scope.editMode = true;
                    helper.resetAngularFields($scope);
                    $scope.previewMediaId = mediaId.id;
                    $scope.dimensionWidth = undefined;
                    $scope.dimensionHeight = undefined;
                    mediaService.getMediaItem($scope.previewMediaId).then((response) => {
                        $scope.data.description     = response.description;
                        $scope.data.arImageFile     = helper.getMediaPreviewFromUrl(response.ar_resource);
                        $scope.data.arImageName     = response.ar_name;
                        $scope.appearance           = response.ar_appearance;
                        $scope.imageType            = response.ar_resource_type;
                        $scope.data.imageName       = response.target_name;
                        $scope.data.url             = response.target_url;
                        $scope.data.imageFile       = response.target;
                        $scope.latitude             = response.latitude;
                        $scope.longitude            = response.longitude;
                        $scope.inclusionZone        = response.inclusion_zone;
                        $scope.measure.code         = response.inclusion_zone_unit;
                        $scope.address              = response.front_store_shop_name;
                        $scope.data.brandImageFile  = response.brand_image;
                        $scope.selectedGender       = response.gender;
                        $scope.selectedCategory     = response.category;
                        $scope.data.animation       = response.animation_type;
                        $scope.material             = response.marker_material;
                        $scope.shape = _.findWhere($scope.shapes,{value:response. marker_shape});
                        $scope.selectedFormat = _.find($scope.formats,{value: response.type});
                        $scope.selectedStore = _.find($scope.storeList,{id: response.front_store_shop});

                        if (response.marker_dimension) {
                            $scope.dimensionWidth = response.marker_dimension.split(',')[0];
                            $scope.dimensionHeight = response.marker_dimension.split(',')[1];
                        }
                        placeMarker({lat: Number($scope.latitude), lng: Number($scope.longitude)}, true);

                        $scope.imageList = [];
                        $scope.imageFileList = [];
                        $scope.imageReviewIdx = 0;
                        if ($scope.data.imageFile) {
                            setTimeout(function(){
                                var $review = angular.element('.uploader-dropzone.image-selected');
                                var imgStyle = $review.attr('style');
                                $scope.imageList.push(imgStyle);
                                $scope.imageFileList.push(imgStyle);
                                $scope.imageReviewIdx = 1;
                                var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                                while($scope.imageList.length < 4) {
                                  $scope.imageList.push(emptyImageStyle);
                                }
                                if ($scope.imageList.length > 0) {
                                    $scope.isAddImage = true;
                                }
                            }, 100);
                        } else {
                            var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                            while($scope.imageList.length < 4) {
                              $scope.imageList.push(emptyImageStyle);
                            }
                        }
                    });
                    $scope.editMediaMode = true;
                };
                $scope.deleteMedia = function(media) {
                    $scope.previewMediaId = media.id;
                    campaignsService.deleteMedia($scope.previewMediaId).then(
                        function(response) {
                            console.log(response);
                            helper.alert('success', 'Media has been deleted.');
                            initStorefrontData();
                        },
                        function(response) {
                            console.log(response);
                            helper.alert('danger', 'Media has not been deleted');
                        }
                    );
                };
                $scope.lastLocation = undefined;
                $scope.updateDistrict = function() {
                    $scope.updateMap($scope.selectedCity);
                    countryService.getDistricts($scope.selectedCity.countryCode, $scope.selectedCity.name).then(
                        function(data) {
                            $scope.districtList = data.geonames;
                            $scope.selectedDistrict = $scope.districtList[0];
                        }
                    );
                };
                $scope.updateMap = function(data) {
                    var info = {
                        lat: data.lat,
                        lng: data.lng,
                        title: data.name
                    };

                    if (!!$scope.selectedMarker) {
                        $scope.selectedMarker.setMap(null);
                    }
                    $scope.map.setCenter(new google.maps.LatLng(info.lat, info.lng));
                    $scope.map.setZoom(17);
                };
                $scope.nextStep = function() {
                    $scope.form1.$setSubmitted();
                    if (checkFormPristine() && $scope.storeList.length > 0) {
                        editor.stepSet('step2', 'submitted', true);
                        if ($scope.storeList.length > 0) {
                            editor.stepSet('step2', 'valid', true);
                            finish().then(
                                function(){
                                    $scope.goNext();
                                }
                            );
                        } else {
                            editor.stepSet('step2', 'valid', false);
                            setTimeout(function() {
                                helper.scrollToFirstError();
                            }, 100);
                            helper.alert('danger', 'Please add at least one AR');
                        }
                    } else {
                        $scope.submitMedia().then(
                            function() {
                                editor.stepSet('step2', 'submitted', true);
                                if ($scope.storeList.length > 0) {
                                    editor.stepSet('step2', 'valid', true);
                                    finish().then(
                                        function() {
                                            $scope.goNext();
                                        }
                                    );
                                } else {
                                    editor.stepSet('step2', 'valid', false);
                                    setTimeout(function() {
                                        helper.scrollToFirstError();
                                    }, 100);
                                    helper.alert('danger', 'Please add at least one AR');
                                }
                            }
                        );
                    }
                };
                $scope.$on('fund-broadcast', function() {
                    if ($scope.editId) {
                        $scope.nextStep();
                    }
                });
                $scope.needBasicValidateZone = function() {
                  return $scope.data.imageFile || $scope.data.imageName || $scope.data.url || $scope.data.description;
                };
                $scope.needBrandValidationZone = function() {
                    return $scope.data.brandImageFile || $scope.data.shoppingMall || $scope.data.shopNumber || $scope.data.brandIconLogo || $scope.dimensionWidth || $scope.dimensionHeight;
                };



                init();
            }
        ]);
})();
