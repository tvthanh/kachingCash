(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'billboardsCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            'campaignEditorService',
            '$timeout',
            // 'campaignId',
            // 'viewDetail',
            'kachingZonecampaignEditorService',
            'campaignsService',
            '$q',
            'utils',
        function (
            $scope,
            $state,
            $stateParams,
            campaignEditorService,
            $timeout,
            // campaignId,
            // viewDetail,
            kachingZonecampaignEditorService,
            campaignsService,
            $q,
            utils
        ) {
            var editor = kachingZonecampaignEditorService;

            $scope.logData = function() {
                editor.logData();
            };

            var campaignId = $stateParams.campaignId;
            var viewDetail = utils.getViewDetail() || $state.current.name === 'kaching.campaigns.view';

            editor.init( campaignId );

            $scope.step = 1;

            if (viewDetail) {
                $scope.step = 4;
                $scope.viewDetail = viewDetail;
            }

            $scope.progress = 1;
            $scope.balance = undefined;
            $scope.availableCoin = undefined;
            $scope.selectedCountry = undefined;
            $scope.isCreated = false;
            $scope.countryList = [];

            if (campaignId !== undefined) {
                $scope.editId = campaignId;
                $scope.loadEditMode = false;
                $scope.progress = 4;
            } else {
                $scope.createMode = true;
            }

            var templateFolder = kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/billboards/steps/';
            $scope.billboardsStep = {
                step1 : templateFolder + 'step1.html',
                step2 : templateFolder + 'step2.html',
                step3 : templateFolder + 'step3.html',
                step4 : templateFolder + 'step4.html'
            };

            $scope.goNext = function() {
                $scope.step += 1;
                $scope.progress += 1;
            };

            $scope.goPrev = function() {
                $scope.step -= 1;
            };

            $scope.updateStep = function(newVal, progress) {
                if ($scope.campaignType === 'On Signup' && newVal === 2) return;
                if (progress) {
                    $scope.progress = progress;
                }
                if ($scope.editId) {
                    $scope.step = newVal;
                } else {
                    $scope.createMode = false;
                    if(newVal <= $scope.progress) {
                        $scope.step = newVal;
                    } else {
                        return;
                    }
                }
            };

            $scope.updateCreated = function() {
                $scope.isCreated = true;
            };

            $scope.activateCampaign = function() {
                var deferred = $q.defer();
                var campaignStatus = editor.dataGet('campaignStatus');
                // var campaign = editor.dataGet('campaign');
                var campaignId = editor.dataGet('campaignId');

                campaignsService.getCampaign(campaignId).then(
                    function(data){
                        if (data.media && data.media.length > 0) {
                            if (campaignStatus === 'start' || campaignStatus === false || !$scope.editId && !campaignStatus) {
                                $scope.campaignId = editor.dataGet('campaignId');
                                campaignsService.setPrepared($scope.campaignId).then(
                                    function(response) {
                                        deferred.resolve(response);
                                    },
                                    function(response) {
                                        deferred.reject(response);
                                    }
                                );
                            }
                        } else {
                            deferred.reject();
                        }
                    },
                    function(){
                        deferred.reject();
                    }
                );

                return deferred.promise;
            };

            $scope.showMapFunds = function() {
                $scope.isShowMapFunds = true;
            };

            $scope.hideMapFunds = function() {
                $timeout(function() {
                    $scope.isShowMapFunds = false;
                }, 1000);
            };

            $scope.updateBalance = function(value) {
                $scope.balance = value;
                $scope.updateAvailableCoin();
            };

            $scope.updateSelectedCountry = function(value) {
                $scope.selectedCountry = value;
                $scope.updateAvailableCoin();
            };

            $scope.updateAvailableCoin = function() {
                if ($scope.balance && $scope.selectedCountry) {
                    var rate = $scope.selectedCountry.rate_exchange;
                    if (rate && rate == 0) {
                        rate = 1;
                    }
                    $scope.availableCoin = Math.floor($scope.balance/rate);
                }
            };

            $scope.updateCountryList = function(value) {
                $scope.countryList = value;
            };

            $scope.campaignType = '';
            $scope.updateCampaignType = function (value) {

                if (value === 'billboard') {
                    $scope.campaignType = 'billboard';
                }

                if (value === 'in_store') {
                    $scope.campaignType = 'instore';
                }

                if (value === 'magazine') {
                    $scope.campaignType = 'magazine ads';
                }

                if (value === 'radio') {
                    $scope.campaignType = 'radio ads';
                }

                if (value === 'tv-ads') {
                    $scope.campaignType = 'tv ads';
                }

                if (value === 'on-signup') {
                    $scope.campaignType = 'On Signup';
                }
            };

            $scope.goToFund = function(modal) {
                $scope.$broadcast('fund-broadcast');
                $state.go('funds');
            };
        }]);
})();
