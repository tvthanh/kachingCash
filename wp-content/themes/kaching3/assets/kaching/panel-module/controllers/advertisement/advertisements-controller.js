(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'advertisementsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'advertisementEditorService',
            'campaignsService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            advertisementEditorService,
            campaignsService
        ) {
            var itemsPerPage = 10;
            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10,
                filtersActive: false,
                advertTypes: []
            };

            // $scope.view.statusFilterModel = $scope.view.advertTypes[0];

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
                getAdvertList();
            };

            function initFilters() {
                $scope.filters = {
                    name: '',
                    client: '',
                    media_title: '',
                    start_date: '',
                    end_date: '',
                    status: undefined
                };
            }

            $scope.changePage = function() {
                getAdvertList();
            };

            $scope.reloadCampaigns = function() {
                $scope.view.currentPage = 1;
                getAdvertList();
            };

            function getAdvertList( argsObj ) {

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

                advertisementEditorService.getAdvertismentsByCategory().then(function (data) {
                    var newArrays = [];
                    var firstItem = {'id': 0, 'name':'All', 'visibility': true};
                    newArrays.push(firstItem);

                    for(var i=0; i < data.results.length; i++){
                        newArrays.push(data.results[i]);
                    }

                    $scope.view.advertTypes = newArrays;

                    if($scope.view.statusFilterModel === undefined){
                        $scope.view.statusFilterModel = newArrays[0];
                    }

                    if($scope.view.statusFilterModel.id === 0){
                        advertisementEditorService.getAdvertisments().then(function (data) {
                            updateAdvertList(data);
                        });
                    }else{
                        advertisementEditorService.getAdvertismentsByCategoryId($scope.view.statusFilterModel.id).then(function (data) {
                            updateAdvertList(data);
                        });
                    }

                    $scope.view.initialLoadComplete = true;
                });
            }

            function updateAdvertList(data) {
                var arrays = [];

                for(var i = 0; i < data.length; i++){
                    var categoryResults = data[i].items;

                    for(var j = 0; j < categoryResults.length; j++){
                        arrays.push(categoryResults[j]);
                    }
                }

                $scope.data.advertListCount = arrays.length;
                $scope.data.advertList = arrays;
            }

            // var deleteCampaign = function( advert ) {
            //     var name = campaign.name;
            //     advertisementEditorService.deleteAdvert( advert.id ).then(
            //         function() {
            //             $alert({
            //                 title: 'Advertisement deleted.',
            //                 content: 'Advertisement '' + name + '' has been deleted.',
            //                 container: '#alerts-container',
            //                 placement: 'top',
            //                 duration: 3,
            //                 type: 'success',
            //                 show: true
            //             });
            //             getAdvertList();
            //         },
            //         function( response ) {
            //             errorHandler.processApiResponse( response );
            //         }
            //     );
            // };

            function deleteAdvert ( advert ) {
                var name = advert.name;
                advertisementEditorService.deleteAdvert( advert.id ).then(
                    function() {
                        $alert({
                            title: 'Advertisement deleted.',
                            content: 'Advertisement "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getAdvertList();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            }

            $scope.startCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.startCampaign( campaign.id ).then(
                    function() {

                        $alert({
                            title: 'Advertisement started.',
                            content: 'Advertisement "' + name + '" is now live.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });

                        getAdvertList();

                    },
                    function( response ) {

                        var processingError = _.findWhere( response.data.errorDetails.logicProcessing.processingErrors, { code: 3 } );

                        if ( typeof processingError !== 'undefined' ) {
                            $alert({
                                title: 'Incorrect advert settings.',
                                content: 'Please review your advertisement settings then start the advertisement!',
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
                            title: 'Advertisement stopped.',
                            content: 'Advertisement "' + name + '" has been stopped.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getAdvertList();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showAdvertDetails = function( advertId ) {
                $modal({
                    // templateUrl: 'panel-module/components/campaignDetailsModal/modalTmpl.html',
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/advertDetailsModal/modalTmpl.html',
                    controller: 'advertDetailsModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        advertId: function () {
                            return advertId;
                        }
                    }
                });
            };

            $scope.showDeleteAdvertDialog = function( advert ) {
                var options = {
                    delete: function( advert ) {
                        deleteAdvert( advert );
                    }
                };
                $modal({
                    // templateUrl: 'panel-module/components/campaignDeleteModal/modalTmpl.html',
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/advertDeleteModal/modalTmpl.html',
                    controller: 'advertDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        advert: function () {
                            return advert;
                        }
                    }
                });
            };

            $scope.checkCampaignActive = function(e, campaign){
                e.preventDefault();
                if(campaign.status === 3){
                    $scope.showStopCampaignDialog(campaign);
                }else if(campaign.status === 5){
                    $scope.startCampaign(campaign);
                }
            };

            $scope.showStopCampaignDialog = function( campaign ) {
                var callbacks = {
                    stopCampaign: function( campaign ) {
                        console.log('stop advertisement', campaign);
                        stopCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/advertStopModal/modalTmpl.html',
                    controller: 'advertStopModalCtrl',
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
                $scope.filters.status = ( $scope.view.statusFilterModel.id === 0 ) ? undefined : $scope.view.statusFilterModel.id;
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
