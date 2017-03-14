(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'lotteryCtrl', [
            '$scope',
            '$state',
            '$q',
            'lotteryService',
            '$rootScope',
        function (
            $scope,
            $state,
            $q,
            lotteryService,
            $rootScope
        ) {
            var itemsPerPage = 8;
            if(!$rootScope.kaching) $rootScope.kaching = {};
            $rootScope.kaching.lotteryFilteredDataLength = 8;
            $scope.view = {
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10
            };

            $scope.data = {
                lotteryListsCount: 0,
                lotteryLists: []
            };

            $scope.changePage = function() {
                getLotteryList();
            };

            var getLotteryList = function(all) {

                var params = {
                    page_size: itemsPerPage,
                    page: $scope.view.currentPage
                };

                lotteryService.getLotteryList({page: 1, page_size: 9999999}).then(
                    function(data) {
                        // List for CSV
                        $scope.lotteryList = [];
                        // End list for CSV
                        $scope.data.lotteryLists = [];
                        $scope.view.busy = false;
                        var data = _.filter(data.items, function(item) { return item.participant_draws.length > 0; });

                        angular.forEach(data, function (item, key) {

                            var dataItem = {
                                date: item.winsel_date === null ? '-' : moment(item.winsel_date).format('MM-DD-YYYY hh:mm'),
                            };

                            angular.forEach(item.participant_draws, function(subItem, subKey) {
                                dataItem.photo = subItem.participant.avatar,
                                dataItem.winner = subItem.participant.name,
                                dataItem.dollars = subItem.winning_amount  ? '$ ' + subItem.winning_amount : '-'
                            });

                            $scope.data.lotteryLists.push(dataItem);
                            $scope.lotteryList.push({
                                photo: dataItem.photo,
                                winner: dataItem.winner,
                                date: dataItem.date,
                                dollars: dataItem.dollars
                            });
                        });
                    },
                    function(response) {
                        $scope.view.busy = false;
                    }
                );
            };

            // Filter Zone
            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate: null
                },
                min: moment().format('MM-DD-YYYY'),
                display: 'Select date range'
            };
            $scope.$watch('daterange.dates', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                if (newValue.startDate) {
                    $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
                }
            });

            var init = function() {
                getLotteryList();
            };

            init();

        }]);
})();
