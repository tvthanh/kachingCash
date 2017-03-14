(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'radioStep3Ctrl', [
          '$scope',
          'productsService',
          'campaignEditorService',
          'campaignsService',
          'mediaService',
          'utils',
          'FileUploader',
          'apiUrl',
          'authToken',
          '$http',
          '$q',
          'errorHandler',
          'kachingZonesHelpers',
          'kachingZonecampaignEditorService',
        function (
          $scope,
          productsService,
          campaignEditorService,
          campaignsService,
          mediaService,
          utils,
          FileUploader,
          apiUrl,
          authToken,
          $http,
          $q,
          errorHandler,
          kachingZonesHelpers,
          kachingZonecampaignEditorService
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


            $scope.view = {
                busy: true,
                productImageUploadStarted: false,
                productImageUploadProgress: 0,
                productImageUploadComplete: false
            };

            uploader.onAfterAddingFile = function(newItem) {
                utils.cleanupUploaderQueue(uploader);
                $scope.data.productImageFile = newItem._file;
            };

            uploader.onBeforeUploadItem = function(item) {
                $scope.view.productImageUploadStarted = true;
                item.url = apiUrl + '/media/' + $scope.data.mediaId + '/';
            };

            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.view.productImageUploadComplete = true;
            };

            uploader.onProgressItem = function(fileItem, progress) {
                $scope.view.productImageUploadProgress = progress;
            };

            uploader.onCompleteAll = function() {
                $scope.view.mediaCreated = true;

            };

            $scope.data = {
                'title': '',
                'description': '',
                'pirce': '',
                'url': ''
            };

            $scope.previewData = {
                isInstore: false,
                followIBeacon: {enabled: false},
                scanReceipt: { enabled: false},
                issueQR: { enabled: false},
                buyProducts: { enabled: false},
                sendInformation: { enabled: false},
                register: { enabled: false},
                share: { enabled: false},
                openMicrophone: { enabled: false},
                watchVideo: { enabled: false}
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

            var getRecommendedProducts = function(){
                productsService.getProducts({ limit: 16, offset: 0, ordering: '-last_used_date' }).then(
                    function( products ) {
                        $scope.recommendedProducts = products.items;
                    }
                );
            };

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

            $scope.saveProduct = function() {
                var deferred  = $q.defer();
                createProduct().then(
                    function(data){
                        if (data && data.id) {
                            addProductToCampaign($scope.addedProducts.concat([data])).then(
                                function(){
                                    campaignsService.getCampaign( $scope.campaignId ).then(
                                        function( campaign ){
                                            $scope.addedProducts = campaign.products;
                                        },
                                        function( response ) {
                                        }
                                    );
                                },
                                function(){
                                }
                            );
                        }
                    },
                    function(response){
                        errorHandler.processApiResponse( response );
                        $scope.view.busy = false;
                    }
                );
                return deferred.promise;
            };

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

                if(typeof $scope.data.productImageFile === 'object') {
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

            // campaignsService.saveProducts
            function addProductToCampaign (product) {
                var deferred = $q.defer();

                campaignsService.saveProducts($scope.campaignId, product).then(
                    function(data){
                        // $scope.view.busy = false;
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
                if($scope.form1.$valid) {
                    $scope.view.busy = true;
                    editor.stepSet('step3', 'valid', true);
                    $scope.updateAllMedia($scope.medias).then(
                        function() {
                            $scope.goNext();
                            helper.alert('success', 'All media has been updated');
                            $scope.view.busy = false;
                            $scope.activeCampaign();
                        },
                        function(response) {
                            $scope.view.busy = false;
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };


            $scope.updateAllMedia = function(medias) {
                var deferred = $q.defer();
                var promisses = [];

                angular.forEach(medias, function(media) {
                    var prodDeferred = $q.defer();
                    promisses.push(prodDeferred.promise);
                    var mediaData = {
                        id: media.id,
                        bets_per_view: media.bets_per_view,
                        type: 'radio'
                    };
                    campaignsService.updateMedia(mediaData).then(
                        function( response ) {
                            prodDeferred.resolve( response );
                        },
                        function( response ) {
                            prodDeferred.reject( response );
                        }
                    );

                    // Update media
                    var rewardDeferred = $q.defer();
                    promisses.push(rewardDeferred.promise);
                    var rewardData = {
                        send_information: media.reward.send_information,
                        share: media.reward.share,
                        product: media.reward.product
                    };
                    mediaService.updateReward(media.id, rewardData).then(
                        function(response) {
                            rewardDeferred.resolve(response);
                        },
                        function(response) {
                            rewardDeferred.reject(response);
                        }
                    );

                    // Update Register
                    var registerDeferred = $q.defer();
                    promisses.push(registerDeferred.promise);
                    var campaign = {
                        id: $scope.campaignId,
                        register: $scope.campaign.register
                    }
                    campaignsService.saveKachingZoneCampagin(campaign).then(
                        function(response) {
                            registerDeferred.resolve();
                        },
                        function(response) {
                            registerDeferred.reject();
                        }
                    );
                });
                $q.all(promisses).then(function() {
                    deferred.resolve();
                });
                return deferred.promise;
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
                getRecommendedProducts();
                utils.addUploaderTypeFilter( uploader, 'image', {
                    imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                });
                $scope.grandTotal = 0;
                campaignsService.getCampaign( $scope.campaignId ).then(
                    function( campaign ){
                        $scope.addedProducts = campaign.products;
                        angular.forEach(campaign.media, (media, index) => {
                            if(media.target === null && media.type === 'radio') {
                                media.target = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
                            }
                        });

                        $scope.campaign = campaign;

                        if ( !$scope.campaign.register ) {
                            $scope.campaign.register = 0;
                        }

                        if ( campaign.media.length > 0 ) {
                            $scope.medias = campaign.media;
                            angular.forEach($scope.medias, function (value, key) {
                                $scope.grandTotal += 1*value.bets_per_view;
                                if (!value.reward) {
                                    value.reward = {
                                        send_information: 0,
                                        share: 0,
                                        product: 0
                                    }
                                }
                            });
                        }
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            init();

            $scope.$watchCollection('medias', function (newVal, oldVal) {
            });

            $scope.$on('fund-broadcast', function() {
                if ($scope.editId) {
                    $scope.saveProduct();
                    $scope.nextStep();
                }
            });
        }]);
})();
