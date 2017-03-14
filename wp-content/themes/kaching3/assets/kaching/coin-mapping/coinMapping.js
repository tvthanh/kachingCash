(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'coinMappingCtrl', [
            '$scope',
            '$state',
            '$q',
            'coinMappingService',
            'kachingZonesHelpers',
            '$rootScope',
        function (
            $scope,
            $state,
            $q,
            coinMappingService,
            kachingZonesHelpers,
            $rootScope
        ) {
            if(!$rootScope.kaching) $rootScope.kaching = {};
            $rootScope.kaching.coinMappingFilteredDataLength = 8;
            var helper = kachingZonesHelpers;
            var itemsPerPage = 8;
            var maxSize = 10;

            $scope.view = {
                itemsPerPage: itemsPerPage,
                maxSize: maxSize,
                currentPage: 1
            };

            $scope.data = {
                coinMappingListCount: 0,
                coinMappingList: []
            };

            $scope.changePage = function() {
                getCoinMappingList();
            };

            $scope.changeRate = function(item) {
                if (!item.rate) {
                    item.hasChanged = false;
                    return;
                }
                if (item.rate != item.oldRate) {
                    item.hasChanged = true;
                } else {
                    item.hasChanged = false;
                }
                // item.oldRate = item.rate;
            };

            $scope.checkRate = function(item) {
                if (!item.rate) {
                    item.rate = item.oldRate;
                }
            };

            $scope.updateRate = function(item) {
                coinMappingService.updateRateExchange(item).then(
                    (response) => {
                        helper.alert('success', 'Coin mapping has been updated successfully.');
                        item.oldRate = response.rate_exchange;
                        item.hasChanged = false;
                        $scope.$apply();
                    },
                    (response) => {
                        helper.alert('danger', 'Cannot update coin mapping now. Please try later.');
                    }
                )
            };

            var getCoinMappingList = function() {

                coinMappingService.getCountries().then(
                    function(data) {
                        $scope.data.coinMappingListCount = data.count;
                        $scope.data.coinMappingList = [];
                        $scope.view.busy = false;
                        angular.forEach(data.items, function (value, key) {
                            var dataItem = {
                                id: value.id,
                                country: value.short_name,
                                rate: value.rate_exchange,
                                oldRate: value.rate_exchange,
                                hasChanged: false
                            };
                            $scope.data.coinMappingList.push(dataItem);
                        });
                        $scope.data.coinMappingList = _.sortBy($scope.data.coinMappingList, function(o) { return o.country; });
                    },
                    function(response) {
                        $scope.view.busy = false;
                        deferred.reject();
                    }
                );
            };

            var init = function() {
                getCoinMappingList();
            };

            init();

        }]);
})();
