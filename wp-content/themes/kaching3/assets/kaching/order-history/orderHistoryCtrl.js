(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'orderHistoryCtrl', [
            '$scope',
            '$state',
            '$q',
            'orderService',
            '$rootScope',
        function (
            $scope,
            $state,
            $q,
            orderService,
            $rootScope
        ) {
            $scope.updatingId = $state.params.updatingId;

            $scope.data = {
                orderHistorys: []
            };
            if(!$rootScope.kaching) $rootScope.kaching = {};
            $rootScope.kaching.orderHistoryFilteredDataLength = 8;
            function getOrderListHistory() {
                var deferred = $q.defer();

                $scope.data.orderHistorys = JSON.parse(localStorage.getItem('orderHistory'));
                orderService.getOrderList().then(
                    function(response) {
                        $scope.updatingId = null;
                        var localOrderLists = [];
                        $scope.data.orderHistorys = [];
                        $scope.data.orderHistorysCount = response.orders.length;
                        $scope.view.busy = false;
                        $scope.orderHistoryList = [];
                        var orderLists = response.orders;
                        angular.forEach(orderLists, function (value, key) {
                            var dataItem = {
                                orderNumber:            value.id                                            ? value.id : '',
                                date:                   value.created_at === undefined                      ? '-' : moment(value.created_at).format('YYYY-MM-DD hh:mm'),
                                buyer:                  value.user && value.user.first_name                 ? value.user.first_name : '',
                                shippingAddress:        value.shipping_address                              ? value.shipping_address : '',
                                totalMount:             value.total_amount                                  ? parseFloat( value.total_amount.toFixed(2) ) : '',
                                totalItem:              value.products && value.products.product_quantity   ? value.products.product_quantity : '',
                                status:                 value.process_status                                ? value.process_status : '',
                                zipCode:                value.shipping_zipcode                              ? value.shipping_zipcode : '',
                                userEmail:              value.user && value.user.email                      ? value.user.email : '',
                                shippingCity:           value.shipping_city                                 ? value.shipping_city : '',
                                shippingPhoneNumber:    value.shipping_phone                                ? value.shipping_phone : '',
                                shippingCountry:        value.shipping_country                              ? value.shipping_country : '',
                                products:               value.products                                      ? value.products : ''
                            };

                            if (value.products) {
                                angular.forEach(value.products, function(item, key) {
                                    dataItem.totalItem += item.product_quantity;
                                });
                            }

                            $scope.data.orderHistorys.push(dataItem);
                            localOrderLists.push(dataItem);

                            var csvItem = {
                                orderNumber: dataItem.orderNumber,
                                date: dataItem.date,
                                buyer: dataItem.buyer,
                                shippingAddress: dataItem.shippingAddress,
                                totalMount: dataItem.totalMount,
                                totalItem: dataItem.totalItem,
                                status: dataItem.status
                            }
                            $scope.orderHistoryList.push(csvItem);
                        });
                        var localOrderListsString = JSON.stringify(localOrderLists);
                        localStorage.setItem('orderHistory', localOrderListsString);
                        deferred.resolve();
                    },
                    function(response) {
                        $scope.view.busy = false;
                        deferred.reject();
                    }
                );

                return deferred.promise;
            }

            // Filter Zone
            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate: null
                },
                min: moment().format('YYYY-MM-DD'),
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

            // End Filter Zone

            // Pagination Zone
            var itemsPerPage = 8;

            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10,
                filtersActive: false,
            };

            $scope.changePage = function() {
                getOrderListHistory();
            };
            // End Pagination Zone

            $scope.editOrder = function(orderItem) {
                $state.go('kaching.orderHistory.edit', {order: orderItem, orderNumber: orderItem.orderNumber});
            };

            function init() {
                getOrderListHistory();
            }

            init();

        }]);
})();





/**
 * API kaching
 */

// (function(){
//     'use strict';
//
//     angular.module('panelApp')
//         .controller( 'orderHistoryCtrl', [
//             '$scope',
//             '$state',
//             '$q',
//             'orderService',
//         function (
//             $scope,
//             $state,
//             $q,
//             orderService
//         ) {
//             $scope.updatingId = $state.params.updatingId;
//
//             $scope.data = {
//                 orderHistorys: []
//             };
//
//             function getOrderListHistory() {
//                 var deferred = $q.defer();
//
//                 $scope.data.orderHistorys = JSON.parse(localStorage.getItem('orderHistory'));
//                 orderService.getOrderList().then(
//                     function(response) {
//                         $scope.updatingId = null;
//                         var localOrderLists = [];
//                         $scope.data.orderHistorys = [];
//                         // $scope.data.orderHistorysCount = response.orders.length;
//                         $scope.data.orderHistorysCount = response.count;
//                         $scope.view.busy = false;
//                         $scope.orderHistoryList = [];
//                         var orderLists = response.orders;
//                         angular.forEach(orderLists, function (value, key) {
//                             var dataItem = {
//                                 orderNumber:            value.id                                            ? value.id : '',
//                                 date:                   value.created_at === undefined                      ? '-' : moment(value.created_at).format('YYYY-MM-DD hh:mm'),
//                                 buyer:                  value.owner && value.owner.name                     ? value.owner.name : '',
//                                 shippingAddress:        value.shipping_address                              ? value.shipping_address : '',
//                                 totalMount:             value.total_amount                                  ? '$' + parseFloat( value.total_amount.toFixed(2) ) : '-',
//                                 totalItem:              value.products && value.products.product_quantity   ? value.products.product_quantity : '',
//                                 status:                 value.process_status                                ? value.process_status : '',
//                                 zipCode:                value.shipping_zipcode                              ? value.shipping_zipcode : '',
//                                 userEmail:              value.owner && value.owner.email                      ? value.owner.email : '',
//                                 shippingCity:           value.shipping_city                                 ? value.shipping_city : '',
//                                 shippingPhoneNumber:    value.shipping_phone                                ? value.shipping_phone : 0,
//                                 shippingCountry:        value.shipping_country                              ? value.shipping_country : '',
//                                 products:               value.products                                      ? value.products : ''
//                             };
//
//                             if (value.products) {
//                                 angular.forEach(value.products, function(item, key) {
//                                     dataItem.totalItem += item.product_quantity;
//                                 });
//                             }
//
//                             $scope.data.orderHistorys.push(dataItem);
//                             localOrderLists.push(dataItem);
//
//                             var csvItem = {
//                                 orderNumber: dataItem.orderNumber,
//                                 date: dataItem.date,
//                                 buyer: dataItem.buyer,
//                                 shippingAddress: dataItem.shippingAddress,
//                                 totalMount: dataItem.totalMount,
//                                 totalItem: dataItem.totalItem,
//                                 status: dataItem.status
//                             }
//                             $scope.orderHistoryList.push(csvItem);
//                         });
//                         var localOrderListsString = JSON.stringify(localOrderLists);
//                         localStorage.setItem('orderHistory', localOrderListsString);
//                         deferred.resolve();
//                     },
//                     function(response) {
//                         $scope.view.busy = false;
//                         deferred.reject();
//                     }
//                 );
//
//                 return deferred.promise;
//             }
//
//             // Filter Zone
//             $scope.daterange = {
//                 dates: {
//                     startDate: null,
//                     endDate: null
//                 },
//                 min: moment().format('YYYY-MM-DD'),
//                 display: 'Select date range'
//             };
//             $scope.$watch(function() {
//                 return $scope.daterange.dates;
//             }, function(newValue, oldValue) {
//                 if (newValue === undefined || newValue.startDate === null || newValue.endDate === null) {
//                     return;
//                 }
//                 $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
//             });
//
//             // End Filter Zone
//
//             // Pagination Zone
//             var itemsPerPage = 8;
//
//             $scope.view = {
//                 initialLoadComplete: false,
//                 itemsPerPage: itemsPerPage,
//                 currentPage: 1,
//                 maxSize: 10,
//                 filtersActive: false,
//             };
//
//             $scope.changePage = function() {
//                 getOrderListHistory();
//             };
//             // End Pagination Zone
//
//             $scope.editOrder = function(orderItem) {
//                 $state.go('kaching.orderHistory.edit', {order: orderItem, orderNumber: orderItem.orderNumber});
//             };
//
//             function init() {
//                 getOrderListHistory();
//             }
//
//             init();
//
//         }]);
// })();

/**
 *  End API kaching
 */
