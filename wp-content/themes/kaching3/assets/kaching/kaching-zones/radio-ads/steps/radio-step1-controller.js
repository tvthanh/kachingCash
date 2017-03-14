(function() {
    'use strict';

    angular.module('panelApp')
        .controller('radioStep1Ctrl', [
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
                userService
            ) {
                var helper = kachingZonesHelpers;
                // var editor = campaignEditorService;
                var editor = kachingZonecampaignEditorService;

                $scope.view = {
                    busy: true
                };
                $scope.fieldHasError = utils.fieldHasError;

                var uploader = $scope.uploader = new FileUploader({
                    url: apiUrl + '/media/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });
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

                $scope.campaignStatus = {
                    status: 'start'
                };

                // flatform
                $scope.allFlatform = {
                    all: 'true'
                }
                $scope.flatform = {
                    os: 'ios'
                };

                $scope.$watch('allFlatform.all', function(newValue, oldValue) {
                    if (newValue === 'true' || newValue === true) {
                        $scope.flatform.os = null;
                    } else {
                        if ($scope.flatform.os === null) {
                            $scope.flatform.os = 'ios';
                        }
                    }
                });

                $scope.$watch('flatform.os', function(newValue, oldValue) {
                    if (newValue !== null) {
                        $scope.allFlatform.all = 'false';
                    }
                });

                // gender
                $scope.allGender = {
                    all: 'true'
                }
                $scope.gender = {
                    sex: 'male'
                };

                $scope.$watch('allGender.all', function(newValue, oldValue) {
                    if (newValue === 'true' || newValue === true) {
                        $scope.gender.sex = null;
                    } else {
                        if ($scope.gender.sex === null) {
                            $scope.gender.sex = 'male';
                        }
                    }
                });

                $scope.$watch('gender.sex', function(newValue, oldValue) {
                    if (newValue !== null) {
                        $scope.allGender.all = 'false';
                    }
                });

                // community

                $scope.communityOption = {
                    all: true
                };
                $scope.unSelectAllCommunities = function() {
                    $scope.targeting.selectedCommunity = [];
                };
                $scope.firstSelectCommunity = function() {
                    if ($scope.data.selectedCommunity.length === 0) {
                        $scope.data.selectedCommunity = ['Urban'];
                    }
                };
                $scope.toggleCommunity = function(item, list) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    } else {
                        list.push(item);
                    }

                    $scope.communityOption.all = false;
                };
                $scope.communityExists = function(item, list) {
                    return list.indexOf(item) > -1;
                };

                $scope.updateDataModel = function(e, obj) {
                    e.preventDefault();
                    obj.selected = !obj.selected;
                    console.log($scope.data);
                };
                var initCampaign = function() {
                    var deferred = $q.defer();
                    if ($scope.editId !== undefined) {
                        campaignsService.getCampaign($scope.editId).then(
                            function(campaign) {
                                $scope.campaign = campaign;
                                $scope.campaign.logo_image = campaign.logo_image;
                                $scope.campaign.header_image = campaign.header_image;
                                // $scope.campaign.amount = campaign.fund;
                                $scope.campaign.customerName = campaign.client;
                                $scope.campaign.description = campaign.description;
                                $scope.campaign.logo_description = campaign.logo_description;
                                $scope.campaign.header_description = campaign.header_description;

                                if (typeof $scope.campaign.start_date !== 'undefined' && typeof $scope.campaign.end_date !== 'undefined') {
                                    $scope.daterange.dates.startDate = moment($scope.campaign.start_date);
                                    $scope.daterange.dates.endDate = moment($scope.campaign.end_date);
                                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                                }
                                $scope.campaign.type = 'radio';
                                deferred.resolve();
                            },
                            function(response) {
                                errorHandler.processApiResponse(response);
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
                        $scope.campaign.type = 'radio';
                        deferred.resolve();
                    }
                    return deferred.promise;
                };

                var updateGender = function() {
                    if ($scope.targeting.gender.male && $scope.targeting.gender.female) {
                        $scope.allGender.all = 'true';
                        $scope.gender.sex = null;
                    } else {
                        if ($scope.targeting.gender.male) {
                            $scope.gender.sex = 'male';
                        } else {
                            $scope.gender.sex = 'female';
                        }
                        $scope.allGender.all = 'false';
                    }
                };

                var updatePlatform = function() {
                    if ($scope.targeting.os.ios && $scope.targeting.os.android) {
                        $scope.allFlatform.all = 'true';
                        $scope.flatform.os = null;
                    } else {
                        if ($scope.targeting.os.ios) {
                            $scope.flatform.os = 'ios';
                        } else {
                            $scope.flatform.os = 'android';
                        }
                        $scope.allFlatform.all = 'false';
                    }
                };

                var initTargetings = function() {
                    var deferred = $q.defer();
                    var targetingData = editor.dataGet('targeting');
                    if (!_.isEmpty(targetingData)) {
                        $scope.targeting = targetingData;
                        updateGender();
                        updatePlatform();
                        deferred.resolve();
                    } else {
                        // $scope.view.busy = true;
                        var id = $scope.editId || undefined;
                        campaignsService.getTargeting(id).then(
                            function(response) {
                                $scope.targeting.allCategories = response.allCategories;
                                $scope.targeting.allLocations = response.allLocations;
                                $scope.targeting.categories = response.categories;
                                $scope.targeting.locations = response.locations;
                                $scope.targeting.gender = response.gender;
                                $scope.targeting.os = response.os;
                                $scope.targeting.ageRange = response.ageRange;
                                $scope.targeting.ageRanges = response.ageRanges;
                                // $scope.view.busy = false;
                                updateGender();
                                updatePlatform();
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
                var initBudgeting = function() {
                    var deferred = $q.defer();
                    var budgetingData = editor.dataGet('budgeting');
                    if (!_.isEmpty(budgetingData)) {
                        $scope.budgeting = budgetingData;
                        $scope.hasBudget = true;
                    } else {
                        if ($scope.editId) {
                            campaignsService.getCampaignBudget($scope.editId).then(
                                function(data) {
                                    $scope.budgeting = data.results[0];
                                    $scope.hasBudget = true;
                                    deferred.resolve();
                                },
                                function(response) {
                                    errorHandler.processApiResponse(response);
                                    deferred.reject();
                                }
                            );
                        }
                    }
                    deferred.resolve();
                    return deferred.promise;
                };
                var initBalance = function() {
                    var deferred = $q.defer();
                    userService.getBalance().then(
                        function(response){
                            $scope.balance = response.credits_balance / response.cash_to_credits_conversion_ratio;
                            console.log('balance: ', $scope.balance);
                            $scope.updateBalance($scope.balance);
                            deferred.resolve(response);
                        },
                        function(response){
                            deferred.reject(response);
                        }
                    );
                    return deferred.promise;
                }
                var initData = function() {
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
                    initBudgeting().then(
                        function() {
                            deferred3.resolve();
                        },
                        function() {
                            deferred3.reject();
                        }
                    );

                    initBalance().then(
                        function() {
                            deferred4.resolve();
                        },
                        function() {
                            deferred4.reject();
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
                function checkAllOption (allVal, arrVal) {
                    var all = true;
                    angular.forEach(arrVal, function(item, index) {
                        if (item.selected === false) {
                            all = false;
                            return;
                        }
                    });
                    return all;
                }

                $scope.scrollToFirstError = function() {
                    if(angular.element('.has-error').length > 0) {
                        var firstErrorId = angular.element('.has-error')[0].id;

                        // angular.element()
                        $location.hash(firstErrorId);
                        $anchorScroll();
                    }
                };

                $scope.nextStep = function() {
                    editor.stepSet('step1', 'submitted', true);

                    editor.dataSet('campaignStatus', $scope.campaignStatus.status);

                    $scope.targeting.allCategories = checkAllOption($scope.targeting.allCategories, $scope.targeting.categories);
                    $scope.targeting.allLocations = checkAllOption($scope.targeting.allLocations, $scope.targeting.locations);

                    if ($scope.form1.$valid) {
                        $scope.view.busy = true;
                        editor.stepSet('step1', 'valid', true);

                        $scope.campaign.start_date = $scope.daterange.dates.startDate.toISOString();
                        $scope.campaign.end_date = $scope.daterange.dates.endDate.toISOString();
                        // Store data to model in kaching zone campaign editor service.
                        editor.dataSet('campaign', $scope.campaign);

                        if ($scope.allFlatform.all === 'true') {
                            $scope.targeting.os.android = true;
                            $scope.targeting.os.ios = true;
                        } else {
                            if ($scope.flatform.os === 'ios') {
                                $scope.targeting.os.ios = true;
                                $scope.targeting.os.android = false;
                            } else {
                                $scope.targeting.os.ios = false;
                                $scope.targeting.os.android = true;
                            }
                        }

                        if ($scope.allGender.all === 'true') {
                            $scope.targeting.gender.male = true;
                            $scope.targeting.gender.female = true;
                        } else {
                            if ($scope.gender.sex === 'male') {
                                $scope.targeting.gender.male = true;
                                $scope.targeting.gender.female = false;
                            } else {
                                $scope.targeting.gender.male = false;
                                $scope.targeting.gender.female = true;
                            }
                        }

                        // Store data to model in kaching zone campaign editor service.
                        editor.dataSet('targeting', $scope.targeting);

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
                                $scope.goNext();
                                $scope.view.busy = false;
                                if ($scope.editId !== undefined && editor.stepGet('step1', 'submitted')) {
                                    helper.alert('success', 'Campaign has been updated.');
                                } else {
                                    helper.alert('success', 'Campaign has been created.');
                                }
                                $scope.activeCampaign();
                            },
                            function(response) {
                                if (response.status == 400 && response.data.errorDetails.logicProcessing.processingErrors[0].code == 44) {
                                    helper.alert('danger', response.data.errorDetails.logicProcessing.processingErrors[0].message);
                                    $scope.fundError = true;
                                } else {
                                    errorHandler.processApiResponse(response);
                                }
                                $scope.view.busy = false;
                                console.log('create campaign error');
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
                $scope.logControllerData = function() {
                    console.log('campaignEditorStep1Ctrl - campaign', angular.copy($scope.campaign));
                };

                $scope.$on('fund-broadcast', function() {
                    if ($scope.editId) {
                        $scope.nextStep();
                    }
                });

                init();

            }
        ]);
})();
