(function() {
    'use strict';

    angular.module('panelApp')
        .controller('radioStep4Ctrl', [
            '$scope',
            'productsService',
            'campaignsService',
            'campaignEditorService',
            'kachingZonecampaignEditorService',
            '$q',
            'errorHandler',
            function(
                $scope,
                productsService,
                campaignsService,
                campaignEditorService,
                kachingZonecampaignEditorService,
                $q,
                errorHandler
            ) {
                var editor = kachingZonecampaignEditorService;
                $scope.view = {
                    busy: true
                };

                $scope.locations = {};
                $scope.categories = {};

                var initCampaign = function() {
                    var deferred = $q.defer();
                    var mediaListData = editor.dataGet('mediaList');
                    if (  ! _.isEmpty( mediaListData ) ) {
                        $scope.mediaList = mediaListData;
                        $scope.campaignId = editor.dataGet('campaignId');
                        $scope.media = editor.dataGet('media');
                        campaignsService.getCampaign($scope.campaignId).then(function(response) {
                            $scope.campaign = response;
                        });
                        deferred.resolve();
                    } else {
                        campaignsService.getCampaign($scope.editId).then(
                            function(data) {
                                $scope.mediaList = data.media;
                                $scope.campaign = data;
                                angular.forEach($scope.mediaList, function (value, key) {
                                    $scope.grandTotal += 1*value.bets_per_view;
                                });
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
                        var id = $scope.editId || undefined;
                        campaignsService.getTargeting(id).then(
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

                    if (!$scope.editId) {
                        if (! editor.stepGet('step1', 'valid') || ! editor.stepGet('step2', 'valid') || ! editor.stepGet('step3', 'valid')) {
                            $scope.updateStep(editor.currentStep());
                        }
                    }

                    editor.currentStep(4);
                    editor.previousState(4);

                    $scope.campaignId = editor.dataGet('campaignId');
                    $scope.media = editor.dataGet('media');
                    campaignsService.getCampaign($scope.campaignId).then(function(response) {
                        $scope.dataFromApi = response;
                    });

                    $scope.mediaList = [];
                    $scope.grandTotal = 0;

                    initData().then(
                        function(){
                            $scope.view.busy = false;
                        },
                        function(){
                            $scope.view.busy = false;
                        }
                    );
                };

                init();
            }
        ]);
})();
