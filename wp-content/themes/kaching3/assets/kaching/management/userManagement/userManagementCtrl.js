(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'userManagementCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$q',
            '$modal',
            '$alert',
            'userManagementService',
        function (
            $scope,
            $state,
            $stateParams,
            $q,
            $modal,
            $alert,
            userManagementService
        ) {
            var service = userManagementService;

            $scope.statusAdvertisers = service.getStatus();
            $scope.statusAdvertisers.unshift({
                value: -1,
                label: 'Any status'
            });
            $scope.status = $scope.statusAdvertisers[0] || undefined;
            var itemsPerPage = 10;
            var maxSize = 10;

            $scope.view = {
                itemsPerPage: itemsPerPage,
                maxSize: maxSize,
                currentPage: 1
            };

            $scope.data = {
                userListCount: 0,
                userList: []
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

            $scope.changePage = function() {
                getUserList();
            };

            function getUserList() {

                var params = {
                    page_size: itemsPerPage,
                    page: $scope.view.currentPage
                };

                if ( $scope.filters.name.length > 0 ) {
                    params.first_name = $scope.filters.name;
                    // params.last_name = $scope.filters.name;
                }
                if ($stateParams.company) {
                    $scope.filters.company = $stateParams.company;
                }
                if ( $scope.filters.company.length > 0 ) {
                    params.company = $scope.filters.company;
                }
                if ( $scope.status.value !== -1 ) {
                    params.status = $scope.status.value;
                }

                service.getUserList(params).then(
                    function getSuccessfully(data) {
                        $scope.view.busy = false;
                        $scope.data.userList = [];
                        $scope.data.userListCount = data.count;

                        angular.forEach(data.results, function(item, key) {
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

                            var dataItem = {
                                id: item.id,
                                photo: item.avatar,
                                userName: item.first_name + ' ' + item.last_name,
                                advertiser: item.advertiser.name,
                                date: item.date_joined ? moment(item.date_joined).format('YYYY-MM-DD hh:mm') : '-',
                                status: status
                            };

                            $scope.data.userList.push(dataItem);
                        });
                    },
                    function getFailingly(err) {
                        console.error(err);
                    }
                );
            }

            var deleteUser = function(userID) {
                $scope.view.busy = true;
                service.deleteUser(userID).then(
                    (data) => {
                        $alert({
                            title: 'User deleted.',
                            content: '',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getUserList();
                        $scope.view.busy = false;
                    },
                    (error) => {
                        $scope.view.busy = false;
                        $alert({
                            title: '',
                            content: 'Cannot delete this user. Please try again another.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'danger',
                            show: true
                        });
                    }
                );
            }

            $scope.showDeleteConfirm = function(userItem) {
                var userID = userItem.id;
                var options = {
                    okFunction: function(userItem) {
                        deleteUser(userItem.id);
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
                            return 'Are you sure you want to delete this user?';
                        },
                        cancelText: function() {
                            return 'Cancel';
                        },
                        okText: function() {
                            return 'Continue';
                        },
                        modalData: function () {
                            return userItem;
                        }
                    }
                });
            };

            $scope.editUser = function(userItem) {
                $state.go('kaching.userManagement.edit', {id: userItem.id});
            };

            $scope.createUser = function() {
                $state.go('kaching.userManagement.new');
            };

            $scope.updateFilters = function() {
                $scope.reloadUserList();
            };

            $scope.reloadUserList = function(page) {
                if (page) {
                    $scope.view.currentPage = page;
                } else {
                    $scope.view.currentPage = 1;
                }

                getUserList();
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

            function initFilters () {
                $scope.filters = {
                    name: '',
                    company: ''
                };
            }

            function init() {
                initFilters();
                getUserList();
            }

            init();

        }]);
})();
