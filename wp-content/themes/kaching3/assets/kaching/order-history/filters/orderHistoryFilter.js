(function() {
    'use strict';

    angular.module('panelApp')
        .filter('orderHistoryFilter', ['$window', '$rootScope', function($window, $rootScope) {
            return (items, from, to, orderNo, buyerName) => {
                var fromDate = new Date(from).getTime();
                var toDate = new Date(to).getTime();
                var dataFilterDate = from && to ?
                    items.filter((item) => {
                        var itemTime = new Date(item.date.split(' ')[0]).getTime();
                        return itemTime >= fromDate && itemTime <= toDate;
                    }) :
                    items;

                var dataFilterOrder = orderNo ?
                    dataFilterDate.filter((item) => {
                        return item.orderNumber.indexOf(orderNo) > -1 ? true : false;
                    }) :
                    dataFilterDate;

                var dataFilterBuyer = buyerName ?
                    dataFilterOrder.filter((item) => {
                        return item.buyer.toLowerCase().indexOf(buyerName.toLowerCase()) > -1 ? true : false;
                    }) :
                    dataFilterOrder;

                var filteredData = dataFilterBuyer;
                $rootScope.kaching.orderHistoryFilteredDataLength = filteredData.length;
                return filteredData;
            };
        }]);

})();
