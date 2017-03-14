(function() {
    'use strict';

    angular.module('panelApp')
        .factory('productsService', ['$http', '$q', 'apiService', function($http, $q, apiService) {
            return {
                getProduct: getProduct,
                getProducts: getProducts,
                deleteProduct: deleteProduct,
                updateProduct: updateProduct,
                updateProducts: updateProducts,
                searchExternalProducts: searchExternalProducts,
                createProductFromExternal: createProductFromExternal,
                createProduct: createProduct
            };

            function getProducts (params) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 6,
                    offset: 0,
                    ordering: 'title'
                };

                if (typeof params === 'object') {
                    if ('limit' in params) {
                        requestParams.limit = params.limit;
                    }
                    if ('offset' in params) {
                        requestParams.offset = params.offset;
                    }
                    if ('ordering' in params) {
                        requestParams.ordering = params.ordering;
                    }
                    if ('title' in params) {
                        requestParams.title = params.title;
                    }
                }

                apiService.get('/products/', requestParams, true).then(
                    function(response) {
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function getProduct (productId) {

                var deferred = $q.defer();

                apiService.get('/products/' + productId + '/', false, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function searchExternalProducts (params) {

                var deferred = $q.defer();

                $http({
                    url: 'http://search.ulab.com/wrapper/get_data',
                    method: 'POST',
                    data: {
                        url: 'http://staging.shopide.com/api/v1/products?search=' + encodeURIComponent(params.search) + '&page=' + params.page + '&per=' + params.per,
                        type: 'GET'
                    },
                    headers: {
                        Accept: 'application/vnd.ulab.v0+json'
                    }
                }).then(
                    function(response) {
                        console.log('searchExternalProducts() success', response);
                        deferred.resolve(JSON.parse(response.data.data));
                    },
                    function(response) {
                        console.log('searchExternalProducts() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function deleteProduct (productId) {

                var deferred = $q.defer();

                apiService.delete('/products/' + productId + '/', false, true).then(
                    function(response) {
                        console.log('deleteProduct() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('deleteProduct() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function updateProduct (product) {

                var deferred = $q.defer();

                var data = {
                    title: product.title,
                    url: product.url,
                    price: product.price,
                    description: product.description
                };

                if (data.url.match(/^http[s]?:\/\//i) === null) {
                    data.url = 'http://' + data.url;
                }

                apiService.patch('/products/' + product.id + '/', data, true).then(
                    function(response) {
                        console.log('updateProduct() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('updateProduct() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function updateProducts (products) {

                var deferred = $q.defer();

                var promisses = [];

                angular.forEach(products, function(product) {

                    var prodDeferred = $q.defer();

                    promisses.push(prodDeferred.promise);

                    updateProduct(product).then(
                        function(response) {
                            prodDeferred.resolve(response);
                        },
                        function(response) {
                            prodDeferred.reject(response);
                        }
                    );
                });

                $q.all(promisses).then(function() {
                    deferred.resolve();
                });

                return deferred.promise;
            }

            function createProductFromExternal (product) {

                var deferred = $q.defer();

                var data = {
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    image_url: product.image_url,
                    url: product.url,
                    external_id: product.external_id,
                    product: product.external_id + '.png'
                };

                if (data.url.match(/^http[s]?:\/\//i) === null) {
                    data.url = 'http://' + data.url;
                }

                apiService.post('/products/', data, true).then(
                    function(response) {
                        console.log('createProductFromExternal() success', response);
                        deferred.resolve(response);
                    },
                    function(response) {
                        console.log('createProductFromExternal() failure', response);
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function createProduct (product) {

                var deferred = $q.defer();

                if (typeof product.id === 'undefined') {
                    apiService.postMultiPart('/products/', product, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );
                } else {
                    apiService.patchMultiPart('/products/' + product.id + '/', product, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );
                }

                return deferred.promise;
            }

        }]);
})();
