(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'orderHistoryDetailCtrl', [
            '$scope',
            'analyticsService',
            '$state',
            '$stateParams',
            'orderService',
            'kachingZonesHelpers',
        function (
            $scope,
            analyticsService,
            $state,
            $stateParams,
            orderService,
            kachingZonesHelpers
        ) {
            var helpers = kachingZonesHelpers;

            $scope.onlyNumbers = '/^[a-zA-Z]*$/';
            $scope.regex = RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$', 'i');

            $scope.goToOrderLists = goToOrderLists;

            $scope.saveOrderItem = saveOrderItem;

            $scope.changeOrderStatus = changeOrderStatus;

            init();

            function init() {
                getOrderItem();
            }

            function getOrderItem() {

                if(!$stateParams.order) {
                    $scope.orderData = JSON.parse(localStorage.getItem('orderItemHistory'));
                } else {
                    $scope.orderData = $stateParams.order;
                }

                $scope.status = $scope.orderData.status;

                // Save localStorage
                var localStoreOrderItem = $scope.orderData;
                var localOrderItemString = JSON.stringify(localStoreOrderItem);
                localStorage.setItem('orderItemHistory', localOrderItemString);
            }

            function saveOrderItem() {
                let orderData = this.orderData;
                let data = {
                    id:                 orderData.orderNumber ? orderData.orderNumber : '',
                    shipping_address:   orderData.shippingAddress ? orderData.shippingAddress : '',
                    // total_amount:       orderData.totalMount ? orderData.totalMount : '',
                    process_status:     orderData.status ? orderData.status : '',
                    shipping_zipcode:   orderData.zipCode ? orderData.zipCode : '',
                    shipping_city:      orderData.shippingCity ? orderData.shippingCity :'',
                    shipping_phone:     orderData.shippingPhoneNumber ? orderData.shippingPhoneNumber : 0,
                    shipping_country:   orderData.shippingCountry ? orderData.shippingCountry : ''
                };

                if (orderData.products) {
                    angular.forEach(orderData.products, function(product, key) {
                        data.products = {
                            product: product.product ? product.product : '',
                            cart: product.cart ? product.cart : '',
                            product_quantity: product.product_quantity ? product.product_quantity : '',
                            product_price: product.product_price ? product.product_price : '',
                            product_name: product.product_name ? product.product_name : '',
                            product_description: product.product_description ? product.product_description : '',
                            product_image: product.product_image ? product.product_image : '',
                            product_url: product.product_url ? product.product_url : '',
                            product_currency: product.product_currency ? product.product_currency : ''
                        }
                    });
                }

                orderService.saveOrder(data).then(
                    (response) => {
                        helpers.alert('success', 'Order has been updated.');
                        $state.go('kaching.orderHistory', { updatingId: orderData.orderNumber });
                    },
                    (error) => {
                        helpers.alert('danger', 'Order has not been updated.');
                    }
                );
            }

            function goToOrderLists() {
                $state.go('kaching.orderHistory');
            }

            function changeOrderStatus(status) {
                if ($scope.orderData && $scope.orderData.status) {
                    $scope.orderData.status = status;
                }
            }
        }]);
})();
