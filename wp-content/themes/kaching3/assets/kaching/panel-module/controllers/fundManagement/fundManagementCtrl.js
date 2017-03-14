(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'fundManagementCtrl', [
            '$scope',
            '$state',
            '$q',
            'orderService',
            '$rootScope',
            'advertiserOrganizationManagementService',
        function (
            $scope,
            $state,
            $q,
            orderService,
            $rootScope,
            advertiserOrganizationManagementService
        ) {
            $scope.updatingId = $state.params.updatingId;

            $scope.data = {
                fundList: []
            };

            var itemsPerPage = 8;

            $scope.view = {
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 8,
                filtersActive: false,
            };
            $scope.companyName = '';

            if(!$rootScope.kaching) $rootScope.kaching = {};
            $scope.getAdvertiserOrganizationList = function() {
                var deferred = $q.defer();

                var requestParams = {
                    page_size: $scope.view.itemsPerPage,
                    page: $scope.view.currentPage,
                    limit: $scope.view.maxSize
                };

                if ( $scope.companyName.length > 0 ) {
                    requestParams.name = $scope.companyName;
                }

                $scope.view.busy = true;

                advertiserOrganizationManagementService.getAdvertiserOrganizationList(requestParams).then(
                    function(response) {
                        $scope.view.totalItem = response.count;
                        $scope.updatingId = null;
                        $scope.data.fundList = [];
                        $scope.data.fundListCount = response.results.length;
                        $scope.totalAvailable = response.total_credit;
                        $scope.totalFund = response.total_funded_credit;
                        $scope.totalSpent = response.total_spent_credit;
                        $scope.view.busy = false;
                        var orderLists = response.results;
                        angular.forEach(orderLists, function (value, key) {
                            var dataItem = {
                                name: value.name,
                                funded_credit: value.funded_credit,
                                spent_credit: value.spent_credit,
                                balance_credit: value.balance_credit
                            };
                            $scope.data.fundList.push(dataItem);
                        });
                        deferred.resolve();
                    },
                    function(response) {
                        $scope.view.busy = false;
                        deferred.reject();
                    }
                );

                return deferred.promise;
            }

            $scope.changePage = function() {
                $scope.getAdvertiserOrganizationList();
            };

            $scope.editOrder = function(orderItem) {
                $state.go('kaching.orderHistory.edit', {order: orderItem, orderNumber: orderItem.orderNumber});
            };

            function init() {
                $scope.getAdvertiserOrganizationList();
            }

            init();

        }]);
})();
