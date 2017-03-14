(function() {
    'use strict';

    angular.module('panelApp')
        .filter('lotteryFilter', ['$window', '$rootScope', function($window, $rootScope) {
            return (items, from, to, winnerName) => {
                var fromDate = new Date(from).getTime();
                var toDate = new Date(to).getTime();
                var dataFilterDate = from && to ?
                    items.filter((item) => {
                        var itemTime = new Date(item.date.split(' ')[0]).getTime();
                        return itemTime >= fromDate && itemTime <= toDate;
                    }) :
                    items;

                var dataFilterWinner = winnerName ?
                    dataFilterDate.filter((item) => {
                        return item.winner.toLowerCase().indexOf(winnerName.toLowerCase()) > -1 ? true : false;
                    }) :
                    dataFilterDate;

                var filteredData = dataFilterWinner;
                $rootScope.kaching.lotteryFilteredDataLength = filteredData.length;
                return filteredData;
            };
        }]);

})();
