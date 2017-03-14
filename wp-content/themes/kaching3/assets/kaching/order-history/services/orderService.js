(function() {
    'use strict';

    angular.module('panelApp')
        .factory('orderService', [
            '$http',
            '$q',
            'ulabService',
            'apiUlabService',
            function(
            $http,
            $q,
            ulabService,
            apiUlabService
            ) {
            return {
                getOrderList:   getOrderList,
                updateOrder:    updateOrder
            };

            function getOrderList() {
                var deferred = $q.defer();

                apiUlabService.post('/order/list', {}, true).then((response) => {
                    deferred.resolve(response);
                }, (error) => {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function updateOrder(params) {
    			var deferred = $q.defer();

                apiUlabService.post('/order/update?', params, true).then((response) => {
                    deferred.resolve(response);
                }, (error) => {
                    deferred.reject(error);
                });

    			return deferred.promise;
    		}

        }]);
})();
