(function() {
    'use strict';

    angular.module('panelApp')
        .factory('orderService', [
            '$http',
            '$q',
            'apiService',
            function(
            $http,
            $q,
            apiService
            ) {
                return {
                    getOrderList: getOrderList,
                    saveOrder: saveOrder
                };

                function getOrderList ( params ) {

                    var deferred = $q.defer();

                    var requestParams = {
                        page_size: 10,
                        page: 1,
                        limit: 10,
                        offset: 0
                    };

                    if ( typeof params === 'object' ) {
                        if ( 'page_size' in params ) {
                            requestParams.page_size = params.page_size;
                        }
                        if ( 'page' in params ) {
                            requestParams.page = params.page;
                        }
                        if ( 'limit' in params ) {
                            requestParams.limit = params.limit;
                        }
                        if ( 'offset' in params ) {
                            requestParams.offset = params.offset;
                        }
                    }

                    apiService.get( '/cart/', requestParams, true ).then(
                        function( response ) {
                            deferred.resolve({
                                count: response.count,
                                orders: response.results,
                                next: response.next,
                                previous: response.previous
                            });
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );

                    return deferred.promise;
                }

                function saveOrder (order) {
                    var deferred = $q.defer(),
                        deferred1 = $q.defer(),
                        deferred2 = $q.defer();

                    var promisses = [
                        deferred1.promise,
                        deferred2.promise
                    ];

                    if (order) {
                        saveOrderStatus(order).then(
                            function (response) {
                                deferred1.resolve(response);
                            },
                            function (response) {
                                deferred1.reject(response)
                            }
                        );
                        saveCartProduct(order.products).then(
                            function (response) {
                                deferred2.resolve(response);
                            },
                            function (response) {
                                deferred2.reject(response)
                            }
                        );
                    }

                    $q.all( promisses ).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function saveOrderStatus (orderData) {

                    var deferred = $q.defer();

                    var data = {
                        id:                 orderData.id,
                        shipping_address:   orderData.shipping_address,
                        process_status:     orderData.process_status,
                        shipping_zipcode:   orderData.shipping_zipcode,
                        shipping_city:      orderData.shipping_city,
                        shipping_phone:     orderData.shipping_phone,
                        shipping_country:   orderData.shipping_country
                    };

                    apiService.put('/cart/' + data.id + '/', data, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function saveCartProduct (orderProduct) {

                    var deferred = $q.defer();

                    var data = {};
                    data.products = [];
                    data.products.push(orderProduct);
                    
                    apiService.put('/cart/updateCartProducts/', data, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

            }
        ]);
})();
