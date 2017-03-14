(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'campaignsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'campaignsService',
            '$state',
            'utils',
            'userService',
            'kachingZonesHelpers',
            '$q',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            campaignsService,
            $state,
            utils,
            userService,
            kachingZonesHelpers,
            $q
        ) {
            var helper = kachingZonesHelpers;
            var itemsPerPage = 10;

            $scope.view = {
                initialLoadComplete: false,
                busy: true,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10,
                filtersActive: false,
                campaignStatuses: [
                    {code: -1, label: 'Any status'},
                    {code: 0, label: 'Incomplete'},
                    // {code: 1, label: 'Billing'},
                    // {code: 2, label: 'Prepared'},
                    {code: 3, label: 'Live'},
                    // {code: 4, label: 'Completed'},
                    {code: 5, label: 'Stopped'}
                ]
            };

            $scope.view.statusFilterModel = $scope.view.campaignStatuses[0];

            $scope.data = {
                campaignsCount: 0,
                campaigns: []
            };

            $scope.filters = {};

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                min: moment().format('YYYY-MM-DD'),
                display: 'Select date range'
            };

            $scope.campaignTypes = [
                {code: -1, label: 'Create New Campaign'},
                {code: 0, label: 'Billboards'},
                {code: 1, label: 'Instore Campaign'},
                {code: 2, label: 'Magazine Ads'},
                {code: 3, label: 'Radio Ads'},
                {code: 4, label: 'TV Ads'}
            ];

            var init = function() {
                $scope.availableCoin = 0;
                getBalance().then(
                    (coin) => {
                        $scope.availableCoin = coin;
                    }
                );
                initFilters();
                getCampaigns();
            };

            function initFilters () {
                $scope.filters = {
                    name: '',
                    client: '',
                    media_title: '',
                    start_date: '',
                    end_date: '',
                    status: undefined
                };
            }

            function getBalance() {
                var deferred = $q.defer();
                userService.getBalance().then(
                    function(response){
                        var coin = response.credits_balance / response.cash_to_credits_conversion_ratio;
                        deferred.resolve(coin);
                    },
                    function(response){
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            };

            $scope.changePage = function() {
                getCampaigns();
            };

            $scope.reloadCampaigns = function(page) {
                if (page) {
                    $scope.view.currentPage = page;
                } else {
                    $scope.view.currentPage = 1;
                }

                getCampaigns();
            };

            function getCampaigns ( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1)
                };

                if ( $scope.filters.name.length > 0 ) {
                    params.name = $scope.filters.name;
                }
                if ( $scope.filters.client.length > 0 ) {
                    params.client = $scope.filters.client;
                }
                if ( $scope.filters.media_title.length > 0 ) {
                    params.media_title = $scope.filters.media_title;
                }
                if ( $scope.filters.start_date && $scope.filters.start_date.length > 0 ) {
                    params.start_date = $scope.filters.start_date;
                }
                if ( $scope.filters.end_date && $scope.filters.end_date.length > 0 ) {
                    params.end_date = $scope.filters.end_date;
                }
                if ( typeof $scope.filters.status !== 'undefined' ) {
                    params.status = $scope.filters.status;
                }

                campaignsService.getCampaigns( params ).then(
                    function( campaigns ) {
                        $scope.data.campaignsCount = campaigns.count;
                        $scope.data.campaigns = campaigns.items;
                        $scope.view.initialLoadComplete = true;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = true;
                        errorHandler.processApiResponse( response );
                    }
                );
            }

            var deleteCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.deleteCampaign( campaign.id ).then(
                    function() {
                        $alert({
                            title: 'Campagin deleted.',
                            content: 'Campaign "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getCampaigns();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.startCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.startCampaign( campaign.id ).then(
                    function() {

                        $alert({
                            title: 'Campagin started.',
                            content: 'Campaign "' + name + '" is now live.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });

                        getCampaigns();

                    },
                    function( response ) {

                        var processingError = _.findWhere( response.data.errorDetails.logicProcessing.processingErrors, { code: 3 } ) ||
                                            _.findWhere( response.data.errorDetails.logicProcessing.processingErrors, { code: 40 } ) ||
                                            _.findWhere( response.data.errorDetails.logicProcessing.processingErrors, { code: 51 } );

                        var title = 'Incorrect campaign settings.';
                        if ( typeof processingError !== 'undefined' ) {
                            var errorMsg = 'Please review your campaign settings then start the campaign';
                            if (processingError.code === 40) {
                                errorMsg = processingError.message;
                            }
                            if (processingError.code === 51) {
                                errorMsg = processingError.message;
                                title = '';
                            }
                            $alert({
                                title: title,
                                content: errorMsg,
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'danger',
                                show: true
                            });
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );
            };

            var stopCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.stopCampaign( campaign.id ).then(
                    function() {
                        $alert({
                            title: 'Campagin stopped.',
                            content: 'Campaign "' + name + '" has been stopped.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getCampaigns();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteCampaignDialog = function( campaign ) {
                if (campaign.status === 3) {
                    $modal({
                        templateUrl: templateDirUri + '/assets/kaching/panel-module/components/campaignWarningStopModal/modalTmpl.html',
                        controller: 'campaignWarningStopModalCtrl',
                        animation: 'am-fade-and-scale',
                        placement: 'center'
                    });
                    return;
                }

                var options = {
                    delete: function( campaign ) {
                        console.log('delete camapgin', campaign);
                        deleteCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/campaignDeleteModal/modalTmpl.html',
                    controller: 'campaignDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        campaign: function () {
                            return campaign;
                        }
                    }
                });
            };

            $scope.checkCampaignActive = function(e, campaign){
                e.preventDefault();
                if(campaign.status === 3){
                    $scope.showStopCampaignDialog(campaign);
                }else if(campaign.status === 2 || campaign.status === 5){
                    $scope.showStartCampaignDialog(campaign);
                }
           };

            $scope.showStopCampaignDialog = function( campaign ) {
                var callbacks = {
                    stopCampaign: function( campaign ) {
                        console.log('stop camapgin', campaign);
                        stopCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/campaignStopModal/modalTmpl.html',
                    controller: 'campaignStopModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        },
                        campaign: function () {
                            return campaign;
                        }
                    }
                });
            };

            $scope.showStartCampaignDialog = function( campaign ) {
                var callbacks = {
                    startCampaign: function( campaign ) {
                        $scope.startCampaign(campaign);
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/campaignStartModal/modalTmpl.html',
                    controller: 'campaignStartModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        },
                        campaign: function () {
                            return campaign;
                        }
                    }
                });
            };

            $scope.updateFilters = function() {
                $scope.filters.status = ( $scope.view.statusFilterModel.code === -1 ) ? undefined : $scope.view.statusFilterModel.code;
                $scope.reloadCampaigns();
            };

            $scope.$watch('daterange.dates', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                if (newValue.startDate) {
                    $scope.filters.start_date = moment( newValue.startDate ).format('YYYY-MM-DD');
                    $scope.filters.end_date = moment( newValue.endDate ).format('YYYY-MM-DD');
                    $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
                } else {
                    $scope.filters.start_date = null;
                    $scope.filters.end_date = null;
                }
                $scope.updateFilters();
            });

            $scope.toggleFilters = function() {
                if ( $scope.view.filtersActive ) {
                    $scope.clearFilters();
                } else {
                    $scope.view.filtersActive = true;
                }
            };

            $scope.clearFilters = function() {
                $scope.view.filtersActive = false;
                initFilters();
                $scope.reloadCampaigns();
            };

            $scope.showCampaignPopup = function(campaign, viewDetail) {
                utils.setCampaignId(campaign.id);

                if (viewDetail) {
                    utils.setViewDetail(true);
                    $state.go('kaching.campaigns.view', { campaignId: campaign.id });
                } else {
                    if (campaign.status === 3) {
                        $modal({
                            templateUrl: templateDirUri + '/assets/kaching/panel-module/components/campaignWarningStopModal/modalTmpl.html',
                            controller: 'campaignWarningStopModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                        return;
                    }
                    
                    utils.setViewDetail(false);
                    $state.go('kaching.campaigns.edit', { campaignId: campaign.id });
                }
            };

            $scope.$on('reload-campaigns', function() {
                $scope.reloadCampaigns();
            });

            $scope.createCampaign = function() {
                if ($scope.availableCoin) {
                    utils.setCampaignId(undefined);
                    utils.setViewDetail(false);
                    $state.go('kaching.campaigns.newCampaign');
                } else {
                    helper.alert('danger', 'Your available fund is 0. Add fund before you create new campaign.', 5);
                }
            };

            init();
        }]);
})();
