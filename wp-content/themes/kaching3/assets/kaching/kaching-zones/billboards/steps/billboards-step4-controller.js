(function() {
    'use strict';

    angular.module('panelApp')
        .controller('step4Ctrl', [
            '$scope',
            'productsService',
            'campaignsService',
            'campaignEditorService',
            'kachingZonecampaignEditorService',
            '$q',
            '$modal',
            'errorHandler',
            '$state',
            'NgMap',
            function(
                $scope,
                productsService,
                campaignsService,
                campaignEditorService,
                kachingZonecampaignEditorService,
                $q,
                $modal,
                errorHandler,
                $state,
                NgMap
            ) {
                var editor = kachingZonecampaignEditorService;
                var flagUrl = kachingAppConfig.wpTemplateUri + '/assets/images/flag/';

                $scope.flagUrl = flagUrl + 'SG.gif';
                $scope.view = {
                    busy: true
                };

                $scope.locations = {};
                $scope.categories = {};

                $scope.loadSubmittedProducts = function() {
                    if (editor.dataGet().campaignId !== undefined) {
                        campaignsService.getCampaign(editor.dataGet().campaignId).then(function(response) {
                            $scope.recommendedProducts = response.products;
                        });
                    }
                };

                $scope.goToCampaign = function() {
                    $state.go('kaching.campaigns');
                };

                var initCampaign = function() {
                    var deferred = $q.defer();
                    var mediaListData = editor.dataGet('mediaList');
                    if (  ! _.isEmpty( mediaListData ) ) {
                        $scope.mediaList = mediaListData;
                        if ($scope.mediaList.length > 0) {
                            $scope.noMedia = false;
                        }
                        $scope.campaignId = editor.dataGet('campaignId');
                        $scope.media = editor.dataGet('media');
                        campaignsService.getCampaign($scope.campaignId).then(
                            function(response){
                                $scope.campaign = response;
                                initMediaList($scope.campaign);
                                deferred.resolve($scope.campaign);
                            },
                            function(){
                                deferred.reject();
                            });
                    } else {
                        campaignsService.getCampaign($scope.campaignId).then(
                            function(data) {
                                if ($scope.viewDetail) {
                                    $scope.updateCampaignType(data.type);
                                }
                                $scope.mediaList = data.media;
                                if ($scope.mediaList.length > 0) {
                                    $scope.noMedia = false;
                                }
                                $scope.campaign = data;
                                initMediaList($scope.campaign);
                                angular.forEach($scope.mediaList, function (value, key) {
                                    $scope.grandTotal += 1*value.bets_per_view;
                                });
                                deferred.resolve($scope.campaign);
                            },
                            function(response) {
                                errorHandler.processApiResponse(response);
                                deferred.reject();
                            }
                        );
                    }
                    return deferred.promise;
                };

                var initTargetings = function() {
                    var deferred = $q.defer();
                    var targetingData = editor.dataGet('targeting');
                    if (!_.isEmpty(targetingData)) {
                        $scope.targeting = targetingData;
                        var arrLocations = [],
                          arrCategories = [];
                        // Get a location have selected true
                        angular.forEach($scope.targeting.locations, function(item, id) {
                          if (item.selected === true) {
                            arrLocations.push(item);
                          }
                        });
                        // Get a category have selected true
                        angular.forEach($scope.targeting.categories, function(item, id) {
                          if (item.selected === true) {
                            arrCategories.push(item);
                          }
                        });
                        $scope.locations = arrLocations;
                        $scope.categories = arrCategories;
                        deferred.resolve();
                    } else {
                        // $scope.view.busy = true;
                        // var id = editor.dataGet('campaignId') || $scope.editId || undefined;
                        campaignsService.getTargeting($scope.campaignId).then(
                            function(response) {
                                $scope.targeting = response;
                                var arrLocations = [],
                                  arrCategories = [];
                                // Get a location have selected true
                                angular.forEach($scope.targeting.locations, function(item, id) {
                                  if (item.selected === true) {
                                    arrLocations.push(item);
                                  }
                                });
                                // Get a category have selected true
                                angular.forEach($scope.targeting.categories, function(item, id) {
                                  if (item.selected === true) {
                                    arrCategories.push(item);
                                  }
                                });
                                $scope.locations = arrLocations;
                                $scope.categories = arrCategories;
                                deferred.resolve();
                            },
                            function(response) {
                                errorHandler.processApiResponse(response);
                                deferred.reject();
                            }
                        );
                    }
                    return deferred.promise;
                };

                var initMediaList = function(data) {
                    // $scope.mediaList = [];
                    $scope.mediaList = [];
                    if (data.type === 'in_store') {
                        if (data.media.length > 0) {
                            angular.forEach( data.media, function( item, id ){
                                if (item.type === 'store_front') {
                                    var storefrontItem = {
                                        id: item.id,
                                        name: item.front_store_shop_name || 'undefined',
                                        media: _.where(data.media,{front_store_shop:item.id})
                                    };

                                    storefrontItem.media.unshift(item);
                                    $scope.mediaList.push(storefrontItem);
                                }
                            });

                            $scope.selectedStore = $scope.mediaList[0];
                        }
                    } else {
                        $scope.mediaList = data.media;
                    }
                };

                var initData = function() {
                    var deferred = $q.defer();
                    var deferred1 = $q.defer();
                    var deferred2 = $q.defer();

                    var promisses = [
                        deferred1.promise,
                        deferred2.promise
                    ];

                    initCampaign().then(
                        function() {
                            initMap();
                            deferred1.resolve();
                        },
                        function() {
                            deferred1.reject();
                        }
                    );

                    initTargetings().then(
                        function() {
                            deferred2.resolve();
                        },
                        function() {
                            deferred2.reject();
                        }
                    );

                    $q.all(promisses).then(
                        function() {
                            deferred.resolve();
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                };

                var init = function() {
                    $scope.view.busy = true;
                    $scope.selectedMedia = null;
                    $scope.isSignupCampaign = $scope.campaignType === 'On Signup';

                    if (!$scope.editId) {
                        if (! editor.stepGet('step1', 'valid') || ! editor.stepGet('step2', 'valid') || ! editor.stepGet('step3', 'valid')) {
                            $scope.updateStep(editor.currentStep());
                        }
                    }

                    editor.currentStep(4);
                    editor.previousState(4);

                    $scope.loadSubmittedProducts();
                    // $scope.view.busy = false;

                    $scope.noMedia = true;

                    $scope.mediaList = [];
                    $scope.grandTotal = 0;
                    $scope.campaignId = $scope.editId || editor.dataGet('campaignId');

                    if ($scope.selectedCountry) {
                        $scope.flagUrl = flagUrl + $scope.selectedCountry.alpha2_code + '.gif';
                    } else {
                        campaignsService.getTargeting($scope.campaignId).then(
                            function(response) {
                                $scope.selectedCountry = response.selectedCountry;
                                $scope.flagUrl = flagUrl + $scope.selectedCountry.alpha2_code + '.gif';
                            }
                        );
                    }

                    initData().then(
                        function(){
                            $scope.view.busy = false;
                        },
                        function(){
                            $scope.view.busy = false;
                        }
                    );
                };

                var initMap = function() {
                    $scope.points = [];
                    if ($scope.campaign && $scope.campaign.media) {
                        angular.forEach($scope.campaign.media, function (value, key) {
                            var item = {
                                latitude: value.latitude,
                                longitude: value.longitude,
                                customIcon: {
                                    "scaledSize": [32, 32],
                                    "url": value.brand_image || kachingAppConfig.wpTemplateUri + '/assets/images/crowblackedit.png'
                                }

                            };
                            $scope.points.push(item);
                        });

                        $scope.mapCenter = [];

                        if ($scope.points.length > 0) {
                            $scope.mapCenter.push($scope.points[0].latitude);
                            $scope.mapCenter.push($scope.points[0].longitude);
                        }
                    }
                };

                $scope.showFinishPopup = function( campaign ) {
                    var options = {
                        activateCampaign: $scope.activateCampaign
                    };
                    $modal({
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/billboards/steps/finish.html',
                        controller: 'campaignFinishModalCtrl',
                        animation: 'am-fade-and-scale',
                        placement: 'center',
                        resolve: {
                            modalOptions: function() {
                                return options;
                            }
                        },
                        onHide: function (){
                            $scope.goToCampaign();
                        }
                    });
                };

                init();
            }
        ]);
})();
