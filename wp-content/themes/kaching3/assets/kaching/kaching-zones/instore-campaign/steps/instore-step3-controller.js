(function() {
    'use strict';

    angular.module('panelApp')
        .controller('instoreStep3Ctrl', [
            '$scope',
            'productsService',
            'campaignEditorService',
            'campaignsService',
            'utils',
            'FileUploader',
            'apiUrl',
            'authToken',
            '$http',
            '$q',
            '$element',
            'errorHandler',
            'kachingZonesHelpers',
            'kachingZonecampaignEditorService',
            'mediaService',
            function(
                $scope,
                productsService,
                campaignEditorService,
                campaignsService,
                utils,
                FileUploader,
                apiUrl,
                authToken,
                $http,
                $q,
                $element,
                errorHandler,
                kachingZonesHelpers,
                kachingZonecampaignEditorService,
                mediaService
            ) {
                var helper = kachingZonesHelpers;
                var editor = kachingZonecampaignEditorService;

                var uploader = $scope.uploader = new FileUploader({
                    url: apiUrl + '/products/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });
                function addProductToCampaign(product) {
                    var deferred = $q.defer();

                    campaignsService.saveProducts($scope.campaignId, product).then(
                        function(data){
                            helper.alert('success', 'Product has been added');
                            deferred.resolve( data );
                        },
                        function(response){
                            // $scope.view.busy = false;
                            deferred.reject( response );
                            errorHandler.processApiResponse( response );
                        }
                    );

                    return deferred.promise;
                }

                function createProduct() {

                    if ( $scope.data.url.match(/^http[s]?:\/\//i) === null ) {
                        $scope.data.url = 'http://' + $scope.data.url;
                    }

                    var productData = {
                        title: $scope.data.title,
                        description: $scope.data.description,
                        price: $scope.data.price,
                        url: $scope.data.url
                    };

                    if(($scope.data.arImageFile !== null) && typeof $scope.data.productImageFile === 'object') {
                        productData.image = $scope.data.productImageFile;
                    }

                    if ($scope.editMode === true) {
                        productData.id = $scope.data.productIdInEdit;
                    }

                    var deferred = $q.defer();

                    productsService.createProduct(productData).then(
                        function(data){
                            deferred.resolve(data);
                            $scope.data.productIdInEdit = undefined;
                            $scope.editMode = false;
                        },
                        function(response){
                            deferred.reject(response);
                            errorHandler.processApiResponse(response);
                        }
                    );

                    return deferred.promise;
                }

                $scope.view = {
                    busy: true,
                    productImageUploadStarted: false,
                    productImageUploadProgress: 0,
                    productImageUploadComplete: false
                };

                $scope.data = {
                    'title': '',
                    'description': '',
                    'pirce': '',
                    'url': ''
                };

                uploader.onAfterAddingFile = function(newItem) {
                    utils.cleanupUploaderQueue(uploader);
                    $scope.data.productImageFile = newItem._file;
                };
                $scope.recommendedProducts = [];
                $scope.carouselOptions = {
                    nav: true,
                    dots: false,
                    navText: ['<span class="glyphicon glyphicon-triangle-left"></span>','<span class="glyphicon glyphicon-triangle-right"></span>'],
                    navRewind: false,
                    loop: false,
                    items: 4
                };
                $scope.products = editor.dataGet('products');


                var myArr = [
                    {
                        type: 'type',
                        perDollarPerClick: 3
                    },
                    {
                        type: 'another type',
                        perDollarPerClick: 2
                    }
                ];
                $scope.purchaseAds = myArr;

                // $scope.increaseAmount = function(media) {
                //     media.bets_per_view = 1*media.bets_per_view + 1;
                //     $scope.updateAmount();
                // };
                // $scope.decreaseAmount = function(media) {
                //     if (media.bets_per_view > 1) {
                //         media.bets_per_view = 1*media.bets_per_view - 1;
                //         $scope.updateAmount();
                //     }
                // };
                $scope.increaseSetting = function(store, setting, value) {
                    store[setting] = 1*value + 1;
                    $scope.updateAmount();
                };
                $scope.decreaseSetting = function(store, setting, value) {
                    if (store[setting] > 0) {
                        store[setting] = 1*value - 1;
                        $scope.updateAmount();
                    }
                };
                $scope.updateAmount = function(media) {
                    $scope.grandTotal = 0;
                    angular.forEach($scope.storeList, function (storefront, key) {
                        var totalSetting = 0;

                        totalSetting = totalSetting + storefront.follow_beacon;
                        totalSetting = totalSetting + storefront.scan_receipt;
                        totalSetting = totalSetting + storefront.issue_qr;
                        totalSetting = totalSetting + storefront.send_information;
                        totalSetting = totalSetting + storefront.share;
                        totalSetting = totalSetting + storefront.product;

                        $scope.grandTotal += totalSetting;

                        angular.forEach(storefront.media, function (inStore, key) {
                            $scope.grandTotal += 1*inStore.bets_per_view;
                        });
                    });
                    if ($scope.campaign) {
                        $scope.grandTotal += 1*$scope.campaign.register;
                    }
                };

                $scope.saveProduct = function() {
                    if ($scope.data.url.match(/^http[s]?:\/\//i) === null) {
                        $scope.data.url = 'http://' + $scope.data.url;
                    }
                    var productData = {
                      title:      $scope.data.title,
                      description:$scope.data.description,
                      price:      $scope.data.price,
                      url:        $scope.data.url,
                      image:      $scope.data.productImageFile
                    };

                    var deferred = $q.defer();
                    productsService.createProduct(productData).then(function successCallback(response) {
                        deferred.resolve(response);
                    }, function errorCallback(response) {
                        deferred.reject(response);
                        errorHandler.processApiResponse(response);
                    });

                    return deferred.promise;
                };

                $scope.updateProduct = function(productId) {
                    if ($scope.data.url.match(/^http[s]?:\/\//i) === null) {
                        $scope.data.url = 'http://' + $scope.data.url;
                    }
                    var productData = {
                        id:         productId,
                        title:      $scope.data.title,
                        description:$scope.data.description,
                        price:      $scope.data.price,
                        url:        $scope.data.url
                    };
                    if (typeof $scope.data.productImageFile === 'object' && $scope.data.productImageFile != null) {
                        productData.image = $scope.data.productImageFile;
                    }
                    var deferred = $q.defer();
                    productsService.createProduct(productData).then(function successCallback(response) {
                        deferred.resolve(response);
                    }, function errorCallback(response) {
                        deferred.reject(response);
                        errorHandler.processApiResponse(response);
                    });
                    return deferred.promise;
                };

                $scope.submitProduct = function() {
                    if ($scope.editMode) {
                        $scope.updateProduct($scope.data.productIdInEdit).then(
                            function(response) {
                                helper.alert('success', 'Product have been updated');
                                $scope.loadSubmittedProducts();
                                $scope.editMode = false;
                            },
                            function(error) {
                                errorHandler.processApiResponse(error);
                                $scope.editMode = false;
                            }
                        );
                    } else {
                        $scope.view.busy = true;
                        $scope.saveProduct().then(
                            function(response) {
                                productsService.getProduct(response.id).then(
                                    function(product) {
                                        $scope.recommendedProducts.push(product);
                                        campaignsService.saveProducts($scope.campaignId, $scope.recommendedProducts).then(
                                            function(reponse) {
                                                $scope.view.busy = false;
                                                helper.alert('success', 'Product have been added');
                                            },
                                            function(error) {
                                                errorHandler.processApiResponse(error);
                                            }
                                        );
                                    },
                                    function(error) {
                                        errorHandler.processApiResponse(error);
                                    }
                                );
                            },
                            function(error) {
                                console.log(error);
                                $scope.view.busy = false;
                            }
                        );
                    }
                };

                $scope.selectRecommendedProduct = function(product) {
                    $scope.editMode = true;
                    $scope.data.productIdInEdit = product.id;
                    $scope.data.title = product.title;
                    $scope.data.description = product.description;
                    $scope.data.price = product.price;
                    $scope.data.url = product.url;
                    $scope.data.productImageFile = product.image;
                    helper.alert('info', 'Product in edit mode!');
                };
                $scope.fieldHasError = utils.fieldHasError;
                $scope.showErrors = function() {
                    return editor.stepGet('step3', 'submitted');
                };
                $scope.nextStep = function() {
                    editor.stepSet('step3', 'submitted', true);

                    $scope.view.busy = true;
                    editor.stepSet('step3', 'valid', true);
                    $scope.updateAllMedia().then(
                        function() {
                            $scope.goNext();
                            helper.alert('success', 'All media has been updated');
                            $scope.view.busy = false;
                            $scope.activeCampaign();
                        },
                        function(error) {
                            $scope.view.busy = false;
                            errorHandler.processApiResponse( error );
                        }
                    );
                };
                $scope.updateAllMedia = function() {
                    var deferred = $q.defer();
                    var promisses = [];

                    angular.forEach($scope.storeList, function(store) {
                        angular.forEach(store.media, function(media){
                            var prodDeferred = $q.defer();
                            promisses.push(prodDeferred.promise);
                            var mediaData = {
                                id: media.id,
                                bets_per_view: media.bets_per_view,
                                type: 'in_store'
                            };
                            campaignsService.updateMedia(mediaData).then(
                                function( response ) {
                                    prodDeferred.resolve( response );
                                },
                                function( response ) {
                                    prodDeferred.reject( response );
                                }
                            );
                        });

                        // update media
                        var rewardDeferred = $q.defer();
                        promisses.push(rewardDeferred.promise);
                        var rewardData = {
                            follow_beacon: store.follow_beacon,
                            scan_receipt: store.scan_receipt,
                            issue_qr: store.issue_qr,
                            send_information: store.send_information,
                            share: store.share,
                            product: store.product
                        };
                        mediaService.updateReward(store.id, rewardData).then(
                            function(response) {
                                rewardDeferred.resolve( response );
                            },
                            function(response) {
                                rewardDeferred.reject( response );
                            }
                        );

                        // update register
                        var registerDeferred = $q.defer();
                        promisses.push(registerDeferred.promise);
                        var campaign = {
                            id: $scope.campaignId,
                            register: $scope.campaign.register
                        };

                        campaignsService.saveKachingZoneCampagin(campaign).then(
                            function() {
                                registerDeferred.resolve();
                            },
                            function() {
                                registerDeferred.reject();
                            }
                        );
                    });
                    $q.all(promisses).then(function() {
                        deferred.resolve();
                    });
                    return deferred.promise;
                };

                $scope.loadSubmittedProducts = function() {
                    if (editor.dataGet().campaignId !== undefined) {
                        campaignsService.getCampaign(editor.dataGet().campaignId).then(function(response) {
                            $scope.recommendedProducts = response.products;
                        });
                    }
                };

                $scope.toggleExpand = function(event) {
                    var target = angular.element(event.target);
                    var $storeArea = angular.element(target).closest('.store-header-area');
                    var $expandItem = $storeArea.find('.media-preview-expanded');

                    $expandItem.slideToggle();

                    var $others = angular.element('.store-header-area').not($storeArea);
                    $others.find('.media-preview-expanded').slideUp();
                };

                var init = function() {

                    if (!$scope.editId) {
                        if (! editor.stepGet('step1', 'valid') || ! editor.stepGet('step2', 'valid')) {
                            $scope.updateStep(editor.currentStep());
                        }
                    }

                    editor.currentStep(3);
                    editor.previousState(3);

                    if ($scope.editId) {
                        $scope.campaignId = $scope.editId;
                    } else {
                        $scope.campaignId = editor.dataGet( 'campaignId' );
                    }

                    $scope.addedProducts = [];
                    $scope.loadSubmittedProducts();
                    utils.addUploaderTypeFilter( uploader, 'image', {
                        imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                    });

                    $scope.initStorefrontData($scope.campaignId).then(
                        function(){
                            $scope.view.busy = false;
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                            $scope.view.busy = false;
                        }
                    );
                };

                $scope.initStorefrontData = function(campaignId) {
                    var deferred = $q.defer();

                    campaignsService.getCampaign(campaignId).then(
                        function(data){

                            $scope.campaign = data;
                            if (!$scope.campaign.register) {
                                $scope.campaign.register = 0;
                            }

                            $scope.mediaList = data.media;
                            $scope.storeList = [];
                            if (data.media.length > 0) {
                                angular.forEach( data.media, function( item, id ){
                                    if (item.type === 'store_front') {
                                        var storefrontItem = {
                                            id: item.id,
                                            name: item.front_store_shop_name || 'undefined',
                                            media: _.where(data.media,{front_store_shop:item.id}),
                                            // action setting
                                            follow_beacon: 0,
                                            scan_receipt: 0,
                                            issue_qr: 0,
                                            send_information: 0,
                                            share: 0,
                                            product: 0
                                        };

                                        if (item.reward) {
                                            storefrontItem.follow_beacon = item.reward.follow_beacon;
                                            storefrontItem.scan_receipt = item.reward.scan_receipt;
                                            storefrontItem.issue_qr = item.reward.issue_qr;
                                            storefrontItem.send_information = item.reward.send_information;
                                            storefrontItem.share = item.reward.share;
                                            storefrontItem.product = item.reward.product
                                        }
                                        storefrontItem.media.unshift(item);
                                        $scope.storeList.push(storefrontItem);

                                    }
                                });

                                $scope.updateAmount();
                            }
                            deferred.resolve();
                        },
                        function(){
                            deferred.reject();
                        }
                    );

                    return deferred.promise;
                };

                $scope.$on('fund-broadcast', function() {
                    if ($scope.editId) {
                        $scope.saveProduct();
                        $scope.nextStep();
                    }
                });

                init();
            }
        ]);
})();
