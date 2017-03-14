(function() {
    'use strict';

    angular.module('panelApp')
        .controller('step1Ctrl', [
            '$scope',
            '$state',
            '$stateParams',
            'apiUrl',
            'authToken',
            'errorHandler',
            'campaignEditorService',
            'utils',
            'FileUploader',
            'campaignsService',
            '$q',
            '$http',
            '$location',
            '$anchorScroll',
            'kachingZonesHelpers',
            'kachingZonecampaignEditorService',
            'userService',
            '$uibModal',
            'mediaService',
            function(
                $scope,
                $state,
                $stateParams,
                apiUrl,
                authToken,
                errorHandler,
                campaignEditorService,
                utils,
                FileUploader,
                campaignsService,
                $q,
                $http,
                $location,
                $anchorScroll,
                kachingZonesHelpers,
                kachingZonecampaignEditorService,
                userService,
                $uibModal,
                mediaService
            ) {
                var helper = kachingZonesHelpers;
                // var editor = campaignEditorService;
                var editor = kachingZonecampaignEditorService;

                if (!$state.params.campaignId) {
                    $scope.campaignId = utils.getCampaignId();
                } else {
                    $scope.campaignId = $state.params.campaignId;
                }

                $scope.view = {
                    busy: true
                };
                $scope.fieldHasError = utils.fieldHasError;

                $scope.campaignTypes = [
                    {value:'billboard', label: 'Billboard'},
                    {value:'in_store', label: 'Instore Campaign'},
                    {value:'magazine', label: 'Magazine Ads'},
                    {value:'radio', label: 'Radio Ads'},
                    {value:'tv-ads', label: 'Tv Ads'},
                    {value:'on-signup', label: 'On Signup'}
                ];

                var uploader = $scope.uploader = new FileUploader({
                    url: apiUrl + '/media/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });

                var imageFilter = { imageFilter: ['image/png', 'image/jpg', 'image/jpeg']};

                utils.addUploaderTypeFilter( uploader, 'customerLogo', imageFilter);
                utils.addUploaderTypeFilter( uploader, 'backgroundImage', imageFilter);

                uploader.onAfterAddingFile = function(newItem) {
                    utils.cleanupUploaderQueue(uploader);
                    if (newItem.alias === 'customerLogo') {
                        $scope.campaign.logo_image = newItem._file;
                    }
                    if (newItem.alias === 'backgroundImage') {
                        $scope.campaign.header_image = newItem._file;
                    }
                };

                $scope.campaign = {};
                $scope.targeting = {};
                $scope.budgeting = {};
                $scope.daterange = {
                    dates: {
                        startDate: null,
                        endDate: null
                    },
                    min: moment().format('YYYY-MM-DD'),
                    display: 'Select date range'
                };

                $scope.data = {
                    campaign: $scope.campaign,
                    targeting: $scope.targeting,
                    budgeting: $scope.budgeting,
                    daterange: $scope.daterange
                };
                $scope.hasBudget = false;

                // campaign status
                // INCOMPLETE = 0
                // BILLING = 1
                // PREPARED = 2
                // LIVE = 3
                // COMPLETED = 4
                // STOPPED = 5
                $scope.campaignStatus = {
                    status: 'start'
                };

                var initCampaign = function() {
                    var deferred = $q.defer();
                    if ($scope.editId !== undefined) {
                        campaignsService.getCampaign($scope.editId).then(
                            function successful(campaign) {
                                $scope.campaign = campaign;
                                $scope.campaign.logo_image = campaign.logo_image;
                                $scope.campaign.header_image = campaign.header_image;
                                $scope.campaign.client = campaign.client;
                                $scope.campaign.description = campaign.description;
                                $scope.campaign.spentCoins = campaign.spent;
                                $scope.campaign.remainningCoins = campaign.fund - campaign.spent;

                                if (typeof $scope.campaign.start_date !== 'undefined' && typeof $scope.campaign.end_date !== 'undefined') {
                                    $scope.daterange.dates = {
                                        startDate: moment($scope.campaign.start_date),
                                        endDate: moment($scope.campaign.end_date)
                                    };
                                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                                }
                                // $scope.campaign.type = 'billboard';
                                $scope.selectedCampaignType = _.findWhere($scope.campaignTypes, {value:$scope.campaign.type});
                                deferred.resolve();
                            },
                            function failed(error) {
                                errorHandler.processApiResponse(error);
                                deferred.reject();
                            }
                        );
                    } else {
                        $scope.campaign = editor.dataGet('campaign');
                        if (typeof $scope.campaign.start_date !== 'undefined' && typeof $scope.campaign.end_date !== 'undefined') {
                            $scope.daterange.dates.startDate = moment($scope.campaign.start_date);
                            $scope.daterange.dates.endDate = moment($scope.campaign.end_date);
                            $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                        }
                        // if ($scope.campaign.id) {
                        //     $scope.editId = $scope.campaign.id;
                        // }
                        // $scope.campaign.type = 'billboard';
                        if ($scope.campaign.type) {
                            $scope.selectedCampaignType = _.findWhere($scope.campaignTypes, {value:$scope.campaign.type});
                        } else {
                            $scope.selectedCampaignType = $scope.campaignTypes[0];
                        }
                        deferred.resolve();
                    }
                    return deferred.promise;
                };

                function initTargetings() {
                    var deferred = $q.defer();
                    var targetingData = editor.dataGet('targeting');
                    if (!_.isEmpty(targetingData)) {
                        $scope.targeting = targetingData;
                        $scope.selectedLocation = $scope.targeting.locations;
                        $scope.locations = $scope.targeting.locationList;
                        $scope.locations = _.sortBy($scope.locations, function(o) { return o.short_name; });
                        $scope.updateCountryList($scope.locations);
                        deferred.resolve();
                    } else {
                        var id = $scope.editId || undefined;
                        campaignsService.getTargeting(id).then(
                            function successful(response) {
                                $scope.targeting.categories = response.categories;
                                $scope.locations = response.locations;
                                $scope.locations = _.sortBy($scope.locations, function(o) { return o.short_name; });
                                $scope.updateCountryList($scope.locations);
                                $scope.selectedLocation = response.selectedCountry;
                                $scope.updateSelectedCountry($scope.selectedLocation);
                                $scope.targeting.gender = response.gender;
                                $scope.targeting.os = response.os;
                                $scope.targeting.ageRange = response.ageRange;
                                $scope.targeting.ageRanges = response.ageRanges;
                                deferred.resolve();
                            },
                            function failed(error) {
                                errorHandler.processApiResponse(error);
                                deferred.reject();
                            }
                        );
                    }
                    return deferred.promise;
                }
                function initBudgeting() {
                    var deferred = $q.defer();
                    var budgetingData = editor.dataGet('budgeting');
                    if (!_.isEmpty(budgetingData)) {
                        $scope.budgeting = budgetingData;
                        $scope.hasBudget = true;
                    } else {
                        if ($scope.editId) {
                            campaignsService.getCampaignBudget($scope.editId).then(
                                function successful(data) {
                                    $scope.budgeting = data.results[0];
                                    $scope.hasBudget = true;
                                    deferred.resolve();
                                },
                                function failed(error) {
                                    errorHandler.processApiResponse(error);
                                    deferred.reject();
                                }
                            );
                        }
                    }
                    deferred.resolve();
                    return deferred.promise;
                }

                function initBalance() {
                    var deferred = $q.defer();
                    userService.getBalance().then(
                        function successful(response){
                            $scope.balance = response.credits_balance / response.cash_to_credits_conversion_ratio;
                            $scope.updateBalance($scope.balance);
                            deferred.resolve(response);
                        },
                        function failed(error){
                            deferred.reject(error);
                        }
                    );
                    return deferred.promise;
                }
                function initData() {
                    var deferred = $q.defer();
                    var deferred1 = $q.defer();
                    var deferred2 = $q.defer();
                    var deferred3 = $q.defer();
                    var deferred4 = $q.defer();

                    var promisses = [
                        deferred1.promise,
                        deferred2.promise,
                        deferred3.promise,
                        deferred4.promise
                    ];

                    initCampaign().then(
                        function successful() {
                            $scope.updateCampaignType($scope.campaign.type);
                            deferred1.resolve();
                        },
                        function failed() {
                            deferred1.reject();
                        }
                    );
                    initTargetings().then(
                        function successful() {
                            deferred2.resolve();
                        },
                        function failed() {
                            deferred2.reject();
                        }
                    );
                    initBudgeting().then(
                        function successful() {
                            deferred3.resolve();
                        },
                        function failed() {
                            deferred3.reject();
                        }
                    );

                    initBalance().then(
                        function successful() {
                            deferred4.resolve();
                        },
                        function failed() {
                            deferred4.reject();
                        }
                    );

                    $q.all(promisses).then(
                        function successful() {
                            deferred.resolve();
                        },
                        function failed(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function init() {
                    $scope.selectedCountry = null;
                    editor.currentStep(1);
                    editor.previousState(1);
                    $scope.fundError = false;

                    $scope.catAccordionStatus = {
                        open: true
                    };

                    $scope.countriesAccordionStatus = {
                        open: true
                    };

                    $scope.view.busy = true;
                    initData().then(
                        function() {
                            if ($scope.editId) {
                                $scope.campaign.id = $scope.editId;
                                // $scope.hasBudget = true;
                            }
                            $scope.view.busy = false;
                        },
                        function() {
                            $scope.view.busy = false;
                        }
                    );
                }

                $scope.changeStatusGender = function(isMale) {
                    if(!$scope.targeting.gender.male && !$scope.targeting.gender.female) {
                        if (isMale) {
                            $scope.targeting.gender.male = true;
                        } else {
                            $scope.targeting.gender.female = true;
                        }
                        helper.alert('danger', 'Please choose at least one Gender.');
                    }
                };

                $scope.changeStatusOS = function(iOS) {
                    if(!$scope.targeting.os.ios && !$scope.targeting.os.android) {
                        if (iOS) {
                            $scope.targeting.os.ios = true;
                        } else {
                            $scope.targeting.os.android = true;
                        }
                        helper.alert('danger', 'Please choose at least one OS.');
                    }
                };

                $scope.$watch(function() {
                    return $scope.daterange.dates;
                }, function(newValue, oldValue) {
                    if (newValue === undefined || newValue.startDate === null || newValue.endDate === null) {
                        return;
                    }
                    $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
                });
                $scope.showErrors = function() {
                    return editor.stepGet('step1', 'submitted');
                };

                $scope.scrollToFirstError = function() {
                    if(angular.element('.has-error').length > 0) {
                        var firstErrorId = angular.element('.has-error')[0].id;

                        // angular.element()
                        $location.hash(firstErrorId);
                        $anchorScroll();
                    }
                };

                function createOnSignUpMedia() {
                    var deferred = $q.defer();
                    if ($scope.editId) {
                        deferred.resolve();
                    } else {
                        var mediaData = {
                            campaign: $scope.campaignId,
                            type: 'on-signup'
                        };

                        mediaService.saveKachingZoneMedia(mediaData).then(
                            function(data) {
                                deferred.resolve(data);
                            },
                            function(response) {
                                deferred.reject(response);
                            }
                        );
                    }

                    return deferred.promise;
                }

                $scope.nextStep = function() {
                    editor.stepSet('step1', 'submitted', true);

                    editor.dataSet('campaignStatus', $scope.campaignStatus.status);
                    if ($scope.form1.$valid) {
                        $scope.view.busy = true;
                        editor.stepSet('step1', 'valid', true);

                        $scope.campaign.start_date = $scope.daterange.dates.startDate.toISOString();
                        $scope.campaign.end_date = $scope.daterange.dates.endDate.toISOString();

                        $scope.campaign.client = 'test';
                        $scope.campaign.type = $scope.selectedCampaignType.value;
                        // update fund
                        var total = 1*$scope.campaign.spentCoins + 1* $scope.campaign.remainningCoins;
                        var newFund = 1*$scope.campaign.fund - total;

                        $scope.campaign.newFund = newFund;
                        editor.dataSet('campaign', $scope.campaign);

                        $scope.targeting.locations = $scope.selectedLocation;
                        $scope.targeting.locationList = $scope.locations;
                        editor.dataSet('targeting', $scope.targeting);
                        editor.dataSet('selectedCountry', $scope.selectedCountry);

                        // dummy budgeting data - TODO: replace this with real data
                        if ($scope.editId === undefined && !$scope.hasBudget) {
                            $scope.budgeting = {
                                cost_per_view: 12,
                                amount: 0,
                                type: 1
                            };
                        }
                        $scope.budgeting.hasBudget = $scope.hasBudget;

                        editor.dataSet('budgeting', $scope.budgeting);

                        $scope.fundError = false;
                        editor.save('step1').then(
                            function(data) {
                                $scope.updateCampaignType($scope.campaign.type);
                                $scope.campaignId = data.campaign.id;
                                // $scope.editId = data.campaign.id;
                                // $scope.goNext();
                                if ($scope.selectedCampaignType.value === 'on-signup') {
                                    if (!$scope.campaignId) {
                                        editor.stepSet('step2', 'submitted', true);
                                        editor.stepSet('step2', 'valid', true);
                                        $scope.updateStep(3, 3);
                                        return;
                                    } else {
                                        createOnSignUpMedia().then(
                                            function(){
                                                editor.stepSet('step2', 'submitted', true);
                                                editor.stepSet('step2', 'valid', true);
                                                $scope.updateStep(3, 3);
                                            },
                                            function() {
                                                // error
                                            }
                                        )
                                    }
                                } else {
                                    $scope.goNext();
                                }
                                $scope.view.busy = false;
                                if ($scope.editId !== undefined && editor.stepGet('step1', 'submitted')) {
                                    helper.alert('success', 'Campaign has been updated.');
                                } else {
                                    helper.alert('success', 'Campaign has been created.');
                                }
                                // $scope.activateCampaign();
                                $scope.updateCreated();
                            },
                            function(response) {
                                if (response.status === 400 && response.data.errorDetails.logicProcessing.processingErrors[0].code === 44) {
                                    helper.alert('danger', response.data.errorDetails.logicProcessing.processingErrors[0].message);
                                    $scope.fundError = true;
                                } else {
                                    errorHandler.processApiResponse(response);
                                }
                                $scope.view.busy = false;
                            }
                        );
                    } else {
                        editor.stepSet('step1', 'valid', false);
                        if (angular.element('.ng-invalid').length > 0) {
                            angular.element('.ng-invalid').focus();
                        }
                        if (angular.element('.image-error').length > 0) {
                            angular.element('.image-error').focus();
                        }
                        setTimeout(function() {
                            $scope.scrollToFirstError();
                        }, 100);
                    }
                };

                $scope.$on('fund-broadcast', function() {
                    if ($scope.editId) {
                        $scope.nextStep();
                    }
                });

                $scope.$watch('selectedLocation', function(newValue, oldValue) {
                    $scope.updateSelectedCountry(newValue);
                });

                init();

            }
        ]);
})();
