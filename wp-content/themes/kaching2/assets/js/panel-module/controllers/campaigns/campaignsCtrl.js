(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'campaignsService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            campaignsService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10,
                filtersActive: false,
                campaignStatuses: [
                    {code: -1, label: 'Any status'},
                    {code: 0, label: 'Incomplete'},
                    {code: 1, label: 'Billing'},
                    {code: 2, label: 'Prepared'},
                    {code: 3, label: 'Live'},
                    {code: 4, label: 'Completed'},
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
                min: moment().format('YYYY-MM-DD')
            };

            var init = function() {
                initFilters();
                getCampaigns();
            };

            var initFilters = function() {
                $scope.filters = {
                    name: '',
                    client: '',
                    media_title: '',
                    start_date: '',
                    end_date: '',
                    status: undefined
                };
            };

            $scope.changePage = function() {
                getCampaigns();
            };

            $scope.reloadCampaigns = function() {
                $scope.view.currentPage = 1;
                getCampaigns();
            };

            var getCampaigns = function( argsObj ) {

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
                if ( $scope.filters.start_date.length >0 ) {
                    params.start_date = $scope.filters.start_date;
                }
                if ( $scope.filters.end_date.length >0 ) {
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
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

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

                        var processingError = _.findWhere( response.data.errorDetails.logicProcessing.processingErrors, { code: 3 } );

                        if ( typeof processingError !== 'undefined' ) {
                            $alert({
                                title: 'Incorrect campaign settings.',
                                content: 'Please review your campaign settings then start the campaign',
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

            $scope.showCampaignDetails = function( campaignId ) {
                $modal({
                    templateUrl: 'panel-module/components/campaignDetailsModal/modalTmpl.html',
                    controller: 'campaignDetailsModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        campaignId: function () {
                            return campaignId;
                        }
                    }
                });
            };

            $scope.showDeleteCampaignDialog = function( campaign ) {
                var options = {
                    delete: function( campaign ) {
                        console.log('delete camapgin', campaign);
                        deleteCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/campaignDeleteModal/modalTmpl.html',
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

            $scope.showStopCampaignDialog = function( campaign ) {
                var callbacks = {
                    stopCampaign: function( campaign ) {
                        console.log('stop camapgin', campaign);
                        stopCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/js/panel-module/components/campaignStopModal/modalTmpl.html',
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

            $scope.updateFilters = function() {
                $scope.filters.status = ( $scope.view.statusFilterModel.code === -1 ) ? undefined : $scope.view.statusFilterModel.code;
                $scope.reloadCampaigns();
            };

            $scope.$watch('daterange.dates.startDate', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                $scope.filters.start_date = moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD');
                $scope.filters.end_date = moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD');
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

            init();
        }]);
})();
