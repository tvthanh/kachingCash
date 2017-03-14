(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'advertiserOrganizationManagementCtrl', [
            '$scope',
            '$state',
            '$q',
            'advertiserOrganizationManagementService',
            '$modal',
            '$alert',
        function (
            $scope,
            $state,
            $q,
            advertiserOrganizationManagementService,
            $modal,
            $alert
        ) {
            var service = advertiserOrganizationManagementService;

            $scope.statusAdvertisers = service.getStatus();
            $scope.statusAdvertisers.unshift({
                value: -1,
                label: 'Any status'
            });
            $scope.statusAdvertiser = $scope.statusAdvertisers[0] || undefined;
            $scope.goToUserList = goToUserList;
            $scope.editAdvertisement = editAdvertisement;
            $scope.createAdvertisement = createAdvertisement;

            var itemsPerPage = 10;
            var maxSize = 10;

            $scope.view = {
                itemsPerPage: itemsPerPage,
                maxSize: maxSize,
                currentPage: 1
            };

            $scope.data = {
                advertiserCount: 0,
                advertiserOrganizationList: []
            };

            $scope.changePage = function() {
                getAdvertiserOrganizationList();
            };

            $scope.filters = {};

            $scope.updateFilters = function() {
                $scope.filters.status = ( $scope.statusAdvertiser.value === -1 ) ? undefined : $scope.statusAdvertiser.value;
                $scope.reloadAdvertiseList();
            };

            $scope.reloadAdvertiseList = function(page) {
                if (page) {
                    $scope.view.currentPage = page;
                } else {
                    $scope.view.currentPage = 1;
                }

                getAdvertiserOrganizationList();
            };

            function getAdvertiserOrganizationList() {

                var params = {
                    page_size: itemsPerPage,
                    page: $scope.view.currentPage
                };

                if ( $scope.filters.name && $scope.filters.name.length > 0 ) {
                    params.name = $scope.filters.name;
                }
                if ( typeof $scope.filters.status !== 'undefined' ) {
                    params.status = $scope.filters.status;
                }

                advertiserOrganizationManagementService.getAdvertiserOrganizationList(params).then(
                    function getSuccessfully(data) {
                        $scope.data.advertiserOrganizationList = [];
                        $scope.data.advertiserCount = data.count;
                        $scope.view.busy = false;
                        $scope.data.advertiserOrganizationList = data.results.map(function(item) {
                            var status;
                            switch (item.status) {
                                case 0:
                                    status = 'Pending'
                                    break;
                                case 1:
                                    status = 'Active'
                                    break;
                                case 2:
                                    status = 'Inactive'
                                    break;
                                default:
                            }
                            return {
                                id: item.id,
                                name: item.name || '',
                                date: item.date_joined ? moment(item.date_joined).format('YYYY-MM-DD hh:mm') : '-',
                                status: status
                            }
                        })
                    },
                    function getFailingly(err) {
                        console.error(err);
                    }
                );
            }

            var deleteAdvertiser = function(advertiserId) {
                $scope.view.busy = true;
                advertiserOrganizationManagementService.deleteAdvertiser(advertiserId).then(
                    (data) => {
                        $alert({
                            title: 'Advertiser deleted.',
                            content: '',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getAdvertiserOrganizationList();
                        $scope.view.busy = false;
                    },
                    (error) => {
                        $scope.view.busy = false;
                        $alert({
                            title: '',
                            content: 'Cannot delete this advertiser. Please try again another.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'danger',
                            show: true
                        });
                    }
                );
            }

            function editAdvertisement(orderItem) {
                $state.go('kaching.advertiserOrganizationManagement.edit', {id: orderItem.id});
            };

            function createAdvertisement() {
                $state.go('kaching.advertiserOrganizationManagement.new');
            }

            $scope.showDeleteConfirm = function(advertiser) {
                var advertiserId = advertiser.id;
                var options = {
                    okFunction: function(advertiser) {
                        deleteAdvertiser(advertiser.id);
                    },
                    modalData: function () {
                        return modalData;
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/confirmModal/modalTmpl.html',
                    controller: 'confirmModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        modalTitle: function () {
                            return 'Confirmation';
                        },
                        modalContent: function() {
                            return 'Are you sure you want to delete this business?';
                        },
                        cancelText: function() {
                            return 'Cancel';
                        },
                        okText: function() {
                            return 'Continue';
                        },
                        modalData: function () {
                            return advertiser;
                        }
                    }
                });
            };

            function goToUserList(company) {
                $state.go('kaching.userManagement.company', {company: company});
            }

            function initFilters() {
                $scope.filters = {
                    name: '',
                    status: undefined
                };
            }

            function init() {
                getAdvertiserOrganizationList();
                initFilters()
            };

            init();

        }]);
})();
