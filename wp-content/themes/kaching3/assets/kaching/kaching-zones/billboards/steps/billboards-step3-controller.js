(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'step3Ctrl', [
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
            'errorHandler',
            'kachingZonesHelpers',
            'kachingZonecampaignEditorService',
            'mediaService',
        function (
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
                if ($scope.grandTotal > $scope.availableCoin) {
                    helper.alert('danger', 'Total coins allocation is greater than available coins. Please adjust it.');
                } else {
                    editor.stepSet('step3', 'submitted', true);

                    if ($scope.form1.$valid) {
                        $scope.view.busy = true;
                        editor.stepSet('step3', 'valid', true);
                        $scope.updateAllMedia($scope.medias).then(
                            function () {
                                $scope.goNext();
                                helper.alert('success', 'All media has been updated');
                                $scope.view.busy = false;
                            },
                            function (response) {
                                $scope.view.busy = false;
                                errorHandler.processApiResponse(response);
                            }
                        );
                    } else {
                        $scope.validateError = true;
                        helper.scrollToFirstError($scope);
                        helper.alert('danger', 'Please fill all required fields.');
                    }
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
                        type: media.type
                    };

                    campaignsService.updateMedia(mediaData).then(
                        function( response ) {
                            prodDeferred.resolve( response );
                        },
                        function( response ) {
                            prodDeferred.reject( response );
                        }
                    );

                    // products
                    var mediaProdDeferred = $q.defer();
                    promisses.push(mediaProdDeferred.promise);

                    var productIds = [];
                    media.products.forEach(function(item){
                        productIds.push(item.id);
                    });

                    campaignsService.updateMediaProduct({id: media.id, products: productIds}).then(
                        function( response ) {
                            mediaProdDeferred.resolve( response );
                        },
                        function( response ) {
                            mediaProdDeferred.reject( response );
                        }
                    );

                    // questions
                    var mediaQuestionDeferred = $q.defer();
                    promisses.push(mediaQuestionDeferred.promise);

                    var questionIds = [];
                    media.questions.forEach(function(item){
                        questionIds.push(item.id);
                    });

                    campaignsService.updateMediaQuestion({id: media.id, questions: questionIds}).then(
                        function( response ) {
                            mediaQuestionDeferred.resolve( response );
                        },
                        function( response ) {
                            mediaQuestionDeferred.reject( response );
                        }
                    );

                    // instore rewards
                    var mediaRewardDeferred = $q.defer();
                    promisses.push(mediaRewardDeferred.promise);

                    campaignsService.updateMediaInstoreRewards(media).then(
                        function(response) {
                            mediaRewardDeferred.resolve(response);
                        },
                        function(response) {
                            mediaRewardDeferred.reject(response);
                        }
                    );

                    // update media
                    var rewardDeferred = $q.defer();
                    promisses.push(rewardDeferred.promise);
                    var rewardData = {
                        // send_information: media.reward.send_information,
                        share: media.reward.share,
                        product: media.reward.product,
                        share_message: media.reward.share_message,
                        survey: media.reward.survey
                    };
                    mediaService.updateReward(media.id, rewardData).then(
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

            var init = function() {

                $scope.isSignupCampaign = $scope.campaignType === 'On Signup';

                $scope.selectedMedia = null;

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
                        $scope.isSignupCampaign = campaign.type === 'on-signup';
                        $scope.addedProducts = campaign.products;
                        $scope.campaign = campaign;
                        if (!$scope.campaign.register) {
                            $scope.campaign.register = 0;
                        }
                        if ( campaign.media.length > 0 ) {
                            $scope.medias = campaign.media;
                            angular.forEach($scope.medias, function (value, key) {
                                $scope.grandTotal += 1*value.bets_per_view;
                                if (!value.reward) {
                                    value.reward = {
                                        share: 0,
                                        // send_information: 0,
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
