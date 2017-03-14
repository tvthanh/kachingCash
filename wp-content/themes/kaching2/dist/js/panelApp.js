(function($){
(function() {
    "use strict";

    angular.module('panelApp', [
            'underscore',
            'ngSanitize',
            'ngCookies',
            'ngAnimate',
            'ngTouch',
            'ui.router',
            'ui.bootstrap',
            'mgcrea.ngStrap',
            'daterangepicker',
            'com.2fdevs.videogular',
            'infinite-scroll',
            'angularFileUpload',
            'chart.js'
        ])
        .constant('apiUrl', kachingAppConfig.apiUrl)
        .constant('sessionDays', 30)
        .constant('statePermissions', {
            advertiser: [
                'expired',
                'account',
                'cards',
                'funds',
                'billing',
                'campaigns',
                'campaigns.edit',
                'campaigns.new',
                'campaigns.new.step1',
                'campaigns.new.step2',
                'campaigns.new.step3',
                'campaigns.new.step4',
                'campaigns.new.step5',
                'campaigns.new.step6',
                'media',
                'media.view',
                'media.edit',
                'products',
                'products.view',
                'products.edit'
            ],
            developer: [
                'expired',
                'account',
                'apikeys'
            ]
        });

    angular.module('panelApp').config([
        '$stateProvider',
        '$urlRouterProvider',
        'statePermissions',
        function(
            $stateProvider,
            $urlRouterProvider,
            statePermissions
        ) {

            var controllersPath = 'panel-module/controllers/';

            var globalHeaderView = {
                controller: 'headerCtrl',
                templateUrl: 'panel-module/components/header/headerTmpl.html'
            };

            $stateProvider
                // Session expired
                .state('expired', {
                    url: '/expired',
                    data: { title: 'Session Expired' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'expiredCtrl',
                            templateUrl: controllersPath + 'expired/expiredTmpl.html'
                        }
                    }
                })
                // Account settings
                .state('account', {
                    url: '/account',
                    data: { title: 'Account Settings' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'profileCtrl',
                            templateUrl: controllersPath + 'profile/profileTmpl.html'
                        }
                    }
                })
                // Credit cards
                .state('cards', {
                    url: '/credit-cards',
                    data: { title: 'Credit Cards' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'creditCardsCtrl',
                            templateUrl: controllersPath + 'creditCards/creditCardsTmpl.html'
                        }
                    }
                })
                // Add funds
                .state('funds', {
                    url: '/add-funds',
                    data: { title: 'Add Funds' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'addFundsCtrl',
                            templateUrl: controllersPath + 'addFunds/addFundsTmpl.html'
                        }
                    }
                })
                // Billing
                .state('billing', {
                    url: '/billing',
                    data: { title: 'Billing' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'billingCtrl',
                            templateUrl: controllersPath + 'billing/billingTmpl.html'
                        }
                    }
                })

                ////////////
                // Campaigns
                ////////////
                .state('campaigns', {
                    url: '/campaigns',
                    data: { title: 'Campaigns' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'campaignsCtrl',
                            templateUrl: controllersPath + 'campaigns/campaignsTmpl.html'
                        }
                    }
                })
                .state('campaigns.edit', {
                    url: '/edit/:campaignId',
                    data: { title: 'Edit Campaign' },
                    views: {
                        'main@': {
                            controller: 'editCampaignCtrl',
                            templateUrl: controllersPath + 'campaignEditor/editCampaignTmpl.html'
                        }
                    }
                })
                .state('campaigns.new', {
                    url: '/new-campaign',
                    data: { title: 'New Campaign' },
                    views: {
                        'main@': {
                            controller: 'campaignEditorCtrl',
                            templateUrl: controllersPath + 'campaignEditor/campaignEditorTmpl.html'
                        }
                    }
                })
                .state('campaigns.new.step1', {
                    views: {
                        'campaignEditorMain': {
                            controller: 'campaignEditorStep1Ctrl',
                            templateUrl: controllersPath + 'campaignEditor/steps/step1Tmpl.html'
                        }
                    }
                })
                .state('campaigns.new.step2', {
                    views: {
                        'campaignEditorMain': {
                            controller: 'campaignEditorStep2Ctrl',
                            templateUrl: controllersPath + 'campaignEditor/steps/step2Tmpl.html'
                        }
                    }
                })
                .state('campaigns.new.step3', {
                    views: {
                        'campaignEditorMain': {
                            controller: 'campaignEditorStep3Ctrl',
                            templateUrl: controllersPath + 'campaignEditor/steps/step3Tmpl.html'
                        }
                    }
                })
                .state('campaigns.new.step4', {
                    views: {
                        'campaignEditorMain': {
                            controller: 'campaignEditorStep4Ctrl',
                            templateUrl: controllersPath + 'campaignEditor/steps/step4Tmpl.html'
                        }
                    }
                })
                .state('campaigns.new.step5', {
                    views: {
                        'campaignEditorMain': {
                            controller: 'campaignEditorStep5Ctrl',
                            templateUrl: controllersPath + 'campaignEditor/steps/step5Tmpl.html'
                        }
                    }
                })
                .state('campaigns.new.step6', {
                    views: {
                        'campaignEditorMain': {
                            controller: 'campaignEditorStep6Ctrl',
                            templateUrl: controllersPath + 'campaignEditor/steps/step6Tmpl.html'
                        }
                    }
                })

                /////////
                // Media
                /////////
                .state('media', {
                    url: '/media',
                    data: { title: 'Media' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'mediaCtrl',
                            templateUrl: controllersPath + 'media/mediaTmpl.html'
                        }
                    }
                })
                .state('media.view', {
                    url: '/view/:mediaId',
                    data: { title: 'View Media' },
                    views: {
                        'main@': {
                            controller: 'mediaViewCtrl',
                            templateUrl: controllersPath + 'mediaView/mediaViewTmpl.html'
                        }
                    }
                })
                .state('media.edit', {
                    url: '/edit/:mediaId',
                    data: { title: 'Edit Media' },
                    views: {
                        'main@': {
                            controller: 'mediaEditCtrl',
                            templateUrl: controllersPath + 'mediaEdit/mediaEditTmpl.html'
                        }
                    }
                })

                ///////////
                // Products
                ///////////
                .state('products', {
                    url: '/products',
                    data: { title: 'Products' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'productsCtrl',
                            templateUrl: controllersPath + 'products/productsTmpl.html'
                        }
                    }
                })
                .state('products.view', {
                    url: '/view/:productId',
                    data: { title: 'View Product' },
                    views: {
                        'main@': {
                            controller: 'productViewCtrl',
                            templateUrl: controllersPath + 'productView/productViewTmpl.html'
                        }
                    }
                })
                .state('products.edit', {
                    url: '/edit/:productId',
                    data: { title: 'Edit Product' },
                    views: {
                        'main@': {
                            controller: 'productEditCtrl',
                            templateUrl: controllersPath + 'productEdit/productEditTmpl.html'
                        }
                    }
                })

                ////////////////
                // API keys page
                ////////////////
                .state('apikeys', {
                    url: '/api-keys',
                    data: { title: 'API Keys' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'apiKeysCtrl',
                            templateUrl: controllersPath + 'apiKeys/apiKeysTmpl.html'
                        }
                    }
                });

        }
    ]);

    angular.module('panelApp').run([
        '$rootScope',
        '$location',
        '$state',
        'authService',
        'permissionsService',
        function(
            $rootScope,
            $location,
            $state,
            authService,
            permissionsService
        ) {

            // Handle unknown URLs
            // This is a replacement for the "$urlRouterProvider.otherwise" block in module config
            if (authService.isAdvertiser()) {
                $state.transitionTo('campaigns');
            } else if (authService.isDeveloper()) {
                $state.transitionTo('apikeys');
            }

            $rootScope.$on('stateNotFound', function(event, unfoundState, fromState, fromParams) {
                if (authService.isAdvertiser()) {
                    $state.transitionTo('campaigns');
                } else if (authService.isDeveloper()) {
                    $state.transitionTo('apikeys');
                }
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

                if (toState.name === 'expired') {
                    return;
                }

                if (!authService.isLoggedIn()) {
                    $state.transitionTo('expired');
                    event.preventDefault();
                    return;
                }

                if (!permissionsService.userHasAccess(toState.name)) {
                    if (authService.isAdvertiser()) {
                        $state.transitionTo('campaigns');
                    } else if (authService.isDeveloper()) {
                        $state.transitionTo('apikeys');
                    }
                    event.preventDefault();
                    return;
                }
            });

        }
    ]);

})();

//
// A patch for the ngFileUpload module.
// It's a replacement for the nvFileOver directive, which has multiple bugs.
// Usage - simply add the 'ifm-over-class' attribute to the nv-file-drop element:
// <div nv-file-drop uploader="uploader" ifm-over-class="fileover"></div>
//

(function () {
    'use strict';
    angular.module('panelApp')
        .config(["$provide", function ($provide) {
            $provide.decorator('nvFileDropDirective', ["$delegate", function ($delegate) {
                var directive = $delegate[0],
                    link = directive.link;

                directive.compile = function () {
                    return function (scope, element, attrs) {
                        var overClass = attrs.ifmOverClass || 'fileover';
                        link.apply(this, arguments);
                        element.on('dragover', function () {
                            element.addClass(overClass);
                        });
                        element.on('dragleave', function () {
                            element.removeClass(overClass);
                        });
                        element.on('drop', function () {
                            element.removeClass(overClass);
                        });
                    };
                };

                return $delegate;
            }]);
        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive('ifmClipboard', [ '$tooltip', function( $tooltip ) {
            return {
                restrict: 'A',
                scope: {
                    clipboardSuccess: '&',
                    clipboardError: '&',
                    tooltipTitle: '@',
                    tooltipPlacement: '@',
                    tooltipAnimation: '@'
                },
                link: function( scope, el ) {

                    var tooltipTitle   = ( typeof scope.tooltipTitle === 'undefined') ? 'Copied' : scope.tooltipTitle;
                    var tooltipPlacement = ( typeof scope.tooltipPlacement === 'undefined') ? 'top' : scope.tooltipPlacement;
                    var tooltipAnimation = ( typeof scope.tooltipAnimation === 'undefined') ? 'am-fade-and-scale' : scope.tooltipAnimation;

                    var myTooltip = $tooltip( el, { title: tooltipTitle, placement: tooltipPlacement, animation: tooltipAnimation, trigger: 'manual' } );

                    el.on('mouseout',function(){
                        myTooltip.hide();
                    });

                    var clipboard = new Clipboard(el[0]);

                    clipboard.on('success', function(e) {
                        myTooltip.show();
                        scope.$apply(function () {
                            scope.clipboardSuccess({
                                e: e
                            });
                        });
                    });

                    clipboard.on('error', function(e) {
                        scope.$apply(function () {
                            scope.clipboardError({
                                e: e
                            });
                        });
                    });

                }
            };
        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'headerCtrl', [
            '$scope',
            '$state',
            'authService',
            '$window',
        function (
            $scope,
            $state,
            authService,
            $window
        ) {

            $scope.loggedIn = authService.isLoggedIn();

            $scope.logoSrc = kachingAppConfig.wpTemplateUri + '/assets/images/ic_kaching.png';

            $scope.logoClick = function() {
                if ( authService.isAdvertiser() ) {
                    $state.go('campaigns');
                } else if ( authService.isDeveloper() ) {
                    $state.go('apikeys');
                } else {
                    $window.location.href = kachingAppConfig.homeUrl;
                }
            };

        }]);

})();

(function(){
    'use strict';

    console.log('campaignDetailsModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'campaignDetailsModalCtrl', [
            '$scope',
            'errorHandler',
            '$sce',
            'campaignsService',
            'campaignId',
        function (
            $scope,
            errorHandler,
            $sce,
            campaignsService,
            campaignId
        ) {

            $scope.videogularApi = null;

            $scope.view = {
                busy: false
            };

            $scope.campaign = {};
            $scope.media = {};
            $scope.products = [];
            $scope.videogular = { sources: [] };

            $scope.view.busy = true;

            campaignsService.getCampaign( campaignId ).then(
                function( campaign ) {
                    $scope.campaign = campaign;
                    if ( campaign.products.length > 0 ) {
                        $scope.products = campaign.products;
                    }
                    if ( campaign.media.length > 0 ) {
                        $scope.media = campaign.media[0];
                        $scope.setVideo();
                    }
                    $scope.view.busy = false;
                },
                function( response ) {
                    $scope.view.busy = false;
                    errorHandler.processApiResponse( response );
                    $scope.$hide();
                }
            );

            $scope.hasMedia = function() {
                return ( _.isEmpty( $scope.media ) ) ? false : true;
            };

            $scope.hasProducts = function() {
                return ( $scope.products.length > 0 ) ? true : false;
            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
            };

            $scope.setVideo = function() {
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.media.video), type: "video/mp4"}
                ];
            };
        }]);
})();
(function(){
    'use strict';

    console.log('campaignDeleteModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'campaignDeleteModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'modalOptions',
            'campaign',
        function (
            $scope,
            $alert,
            campaignsService,
            modalOptions,
            campaign
        ) {

            console.log('in campaignDeleteModalCtrl', campaign);

            $scope.campaign = campaign;

            $scope.delete = function() {
                modalOptions.delete( campaign );
                $scope.$hide();
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'campaignStopModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'callbacks',
            'campaign',
        function (
            $scope,
            $alert,
            campaignsService,
            callbacks,
            campaign
        ) {

            $scope.campaign = campaign;

            $scope.stopCampaign = function() {
                callbacks.stopCampaign( campaign );
                $scope.$hide();
            };
        }]);
})();
(function(){
    'use strict';

    console.log('mediaDeleteModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'mediaDeleteModalCtrl', [
            '$scope',
            '$alert',
            'mediaService',
            'modalOptions',
            'media',
        function (
            $scope,
            $alert,
            mediaService,
            modalOptions,
            media
        ) {

            console.log('in mediaDeleteModalCtrl', media);

            $scope.media = media;

            $scope.delete = function() {
                modalOptions.delete( media );
                $scope.$hide();
            };
        }]);
})();
(function(){
    'use strict';

    console.log('mediaLibraryModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'mediaLibraryModalCtrl', [
            '$scope',
            'errorHandler',
            'modalOptions',
            'mediaService',
        function (
            $scope,
            errorHandler,
            modalOptions,
            mediaService
        ) {

            console.log('in mediaLibraryModalCtrl');

            var itemsPerPage = 6;

            $scope.view = {
                busy: true,
                currentPage: 1,
                mediaCount: 0,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [
                    {
                        'value': 'name',
                        'label': 'Order by title'
                    },
                    {
                        'value': '-date_added',
                        'label': 'Newest first'
                    }
                ],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.selectMedia = function() {
                modalOptions.submit( $scope.view.selectItem );
                $scope.$hide();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getMedia();
            };

            $scope.changeOrder = function() {
                getMedia();
            };

            $scope.changePage = function() {
                getMedia();
            };

            $scope.toggleItem = function( item ) {
                if ( item.selected ) {
                    item.selected = false;
                    $scope.view.selectItem = false;
                } else {
                    if ( typeof $scope.view.selectItem === 'object' ) {
                        $scope.view.selectItem.selected = false;
                    }
                    item.selected = true;
                    $scope.view.selectItem = item;
                }
            };

            var init = function() {
                getMedia();
            };

            var getMedia = function( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1),
                    ordering: $scope.view.orderBy
                };

                if ( $scope.view.searchPhrase.length > 0 ) {
                    params.name = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                mediaService.getMedia( params ).then(
                    function( media ) {
                        $scope.view.mediaCount = media.count;
                        $scope.view.media = media.items;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            init();
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'producstLibraryModalCtrl', [
            '$scope',
            'errorHandler',
            'modalOptions',
            'productsService',
        function (
            $scope,
            errorHandler,
            modalOptions,
            productsService
        ) {

            var itemsPerPage = 8;

            $scope.view = {
                busy: true,
                currentPage: 1,
                productsCount: 0,
                products: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [
                    {
                        'value': 'name',
                        'label': 'Order by title'
                    },
                    {
                        'value': '-date_added',
                        'label': 'Newest first'
                    }
                ],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.selectProduct = function() {
                modalOptions.submit( $scope.view.selectItem );
                $scope.$hide();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getProducts();
            };

            $scope.changeOrder = function() {
                getProducts();
            };

            $scope.changePage = function() {
                getProducts();
            };

            $scope.toggleItem = function( item ) {
                if ( item.selected ) {
                    item.selected = false;
                    $scope.view.selectItem = false;
                } else {
                    if ( typeof $scope.view.selectItem === 'object' ) {
                        $scope.view.selectItem.selected = false;
                    }
                    item.selected = true;
                    $scope.view.selectItem = item;
                }
            };

            var init = function() {
                getProducts();
            };

            var getProducts = function( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1),
                    ordering: $scope.view.orderBy
                };

                if ( $scope.view.searchPhrase.length > 0 ) {
                    params.title = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                productsService.getProducts( params ).then(
                    function( products ) {
                        $scope.view.productsCount = products.count;
                        $scope.view.products = products.items;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            init();
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newMediaModalCtrl', [
            '$scope',
            '$state',
            '$alert',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
            'modalOptions',
        function (
            $scope,
            $state,
            $alert,
            apiUrl,
            authToken,
            utils,
            mediaService,
            FileUploader,
            modalOptions
        ) {

            var uploader = $scope.uploader = new FileUploader({
                url: apiUrl + '/media/',
                method: 'PATCH',
                headers: {
                    'Authorization': 'Token ' + authToken.get()
                }
            });

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                uploading: false,
                submitted: false,
                mediaCreated: false,

                videoUploadStarted: false,
                videoUploadProgress: 0,
                videoUploadComplete: false,

                imageUploadStarted: false,
                imageUploadProgress: 0,
                imageUploadComplete: false
            };

            $scope.data = {
                videoFile: '',
                imageFile: '',
                mediaName: '',
                mediaId: ''
            };

            $scope.errors = {
                video: {},
                image: {}
            };

            var init = function() {

                utils.addUploaderTypeFilter( uploader, 'video', {
                    videoFilter: ['video/mp4', 'video/ogg', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
                });
                utils.addUploaderTypeFilter( uploader, 'display', {
                    imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                });
            };

            uploader.onAfterAddingFile = function( newItem ) {

                utils.cleanupUploaderQueue( uploader );

                if ( newItem.alias === 'video' ) {
                    $scope.data.videoFile = newItem._file;
                }

                if ( newItem.alias === 'display' ) {

                    $scope.data.imageFile = newItem._file;

                    mediaService.imageSizeHelper( newItem._file ).then(function( size ){
                        if ( ! mediaService.imageSizeValid( size.width, size.height ) ) {
                            $scope.errors.image.size = true;
                        } else {
                            delete $scope.errors.image.size;
                        }
                    });
                }
            };

            uploader.onBeforeUploadItem = function(item) {
                if ( item.alias === 'video' ) {
                    $scope.view.videoUploadStarted = true;
                }
                if ( item.alias === 'display' ) {
                    $scope.view.imageUploadStarted = true;
                }
                item.url = apiUrl + '/media/'+ $scope.data.mediaId +'/';
            };

            uploader.onCompleteItem = function( fileItem, response, status, headers ) {
                if ( fileItem.alias === 'video' ) {
                    $scope.view.videoUploadComplete = true;
                }
                if ( fileItem.alias === 'display' ) {
                    $scope.view.imageUploadComplete = true;
                }
            };

            uploader.onProgressItem = function(fileItem, progress) {
                if ( fileItem.alias === 'video' ) {
                    $scope.view.videoUploadProgress = progress;
                }
                if ( fileItem.alias === 'display' ) {
                    $scope.view.imageUploadProgress = progress;
                }
            };

            uploader.onCompleteAll = function() {
                $scope.view.mediaCreated = true;

                if ( modalOptions.mode === 'campaignEditor' ) {
                    $scope.closeModal();
                }
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.videoHasError = function() {
                return ( typeof $scope.data.videoFile !== 'object' );
            };

            $scope.imageHasError = function() {
                if ( typeof $scope.data.imageFile !== 'object' || $scope.errors.image.size ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.viewMedia = function() {
                $scope.$hide();
                $state.go( 'media.view', { mediaId: $scope.data.mediaId } );
            };

            $scope.saveMedia = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid && !$scope.imageHasError() && !$scope.videoHasError() ) {
                    $scope.view.uploading = true;
                    mediaService.createMedia( $scope.data.mediaName ).then(
                        function( media ){
                            $scope.data.mediaId = media.id;
                            uploader.uploadAll();
                        },
                        function(){
                            // Show error message
                            // $scope.$hide();
                        }
                    );
                }
            };

            $scope.closeModal = function() {
                if ( $scope.view.mediaCreated  && _.isFunction( modalOptions.submit ) ) {
                    modalOptions.submit( $scope.data.mediaId );
                }
                $scope.$hide();
            };

            init();
        }]);
})();

(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newProductModalCtrl', [
            '$scope',
            '$state',
            'errorHandler',
            'apiUrl',
            'authToken',
            'utils',
            'productsService',
            'FileUploader',
            'modalOptions',
        function (
            $scope,
            $state,
            errorHandler,
            apiUrl,
            authToken,
            utils,
            productsService,
            FileUploader,
            modalOptions
        ) {

            var uploader = $scope.uploader = new FileUploader({
                url: apiUrl + '/products/',
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + authToken.get()
                }
            });

            $scope.fieldHasError = utils.fieldHasError;
            $scope.urlRegex = utils.urlRegex();

            $scope.view = {
                uploading: false,
                submitted: false,
                uploadStarted: false,
                uploadProgress: 0,
                uploadComplete: false,
                productCreated: false,
                externalProducts: []
            };

            $scope.data = {
                productId: undefined,
                title: '',
                url: '',
                price: '',
                description: '',
                image: '',
                imageFile: '',
                external: false
            };

            var init = function() {
                utils.addUploaderTypeFilter( uploader, 'image', {
                    imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                });
            };

            uploader.onAfterAddingFile = function( item ) {
                utils.cleanupUploaderQueue( uploader );
                $scope.data.imageFile = item._file;
            };

            uploader.onBeforeUploadItem = function( item ) {

                var formData = {
                    title: $scope.data.title,
                    url: $scope.data.url,
                    price: $scope.data.price,
                    description: $scope.data.description
                };

                if ( formData.url.match(/^http[s]?:\/\//i) === null ) {
                    formData.url = 'http://' + formData.url;
                }

                if ( $scope.data.image_url ) {
                    formData.image_url = $scope.data.image_url;
                }
                if ( $scope.data.external_id ) {
                    formData.external_id = $scope.data.external_id;
                }

                item.formData.push( formData );
                $scope.view.uploading = true;
                $scope.view.uploadStarted = true;
            };

            uploader.onProgressItem = function(fileItem, progress) {
                $scope.view.uploadProgress = progress;
            };

            uploader.onSuccessItem = function( item, response, status, headers ) {
                console.log("onSuccessItem", item, response, status, headers);

                $scope.data.productId = response.id;
                $scope.data.image = response.image;
                $scope.data.date_added = response.date_added;
                $scope.data.is_active = response.is_active;

                $scope.view.productCreated = true;

                if ( modalOptions.mode === 'campaignEditor' ) {
                    $scope.closeModal();
                }
            };

            uploader.onCompleteAll = function() {
                $scope.view.uploadComplete = true;
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };
            $scope.imageHasError = function() {
                return ( !$scope.data.imageFile );
            };

            $scope.viewProduct = function() {
                $scope.$hide();
                $state.go( 'products.view', { productId: $scope.data.productId } );
            };

            $scope.saveProduct = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    if ( $scope.data.external === true ) {
                        $scope.createProductFromExternal();
                    } else {
                        uploader.uploadAll();
                    }
                }
            };

            $scope.closeModal = function() {
                if ( $scope.view.productCreated  && _.isFunction( modalOptions.submit ) ) {
                    modalOptions.submit({
                        id: $scope.data.productId,
                        title: $scope.data.title,
                        url: $scope.data.url,
                        price: $scope.data.price,
                        description: $scope.data.description,
                        image: $scope.data.image,
                        date_added: $scope.data.date_added,
                        is_active: $scope.data.is_active
                    });
                }
                $scope.$hide();
            };

            $scope.searchExternalProducts = function() {
                $scope.view.busy = true;
                productsService.searchExternalProducts({ search: $scope.view.externalProductsSearchInput }).then(
                    function( products ) {
                        $scope.view.externalProducts = products;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            $scope.resetExternalProducts = function() {
                $scope.view.externalProducts = [];
            };

            $scope.addExternalProduct = function(product) {

                $scope.data.external = true;
                $scope.data.title = product.name;
                $scope.data.url = product.medium_image;
                $scope.data.price = product.price_min;
                $scope.data.description = product.description ? product.description : product.name;
                $scope.data.image_url =  product.medium_image;
                $scope.data.external_id =  product.asin;
                $scope.data.imageFile = product.medium_image;
                $scope.data.image = product.medium_image;

                $scope.resetExternalProducts();
            };

            $scope.createProductFromExternal = function() {

                productsService.createProductFromExternal( $scope.data ).then(
                    function( response ) {

                        $scope.data.productId = response.id;
                        $scope.view.productCreated = true;

                        if ( modalOptions.mode === 'campaignEditor' ) {
                            $scope.closeModal();
                        }
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            init();
        }]);
})();

(function(){
    'use strict';

    console.log('productDeleteModalCtrl loaded');

    angular.module('panelApp')
        .controller( 'productDeleteModalCtrl', [
            '$scope',
            'modalOptions',
            'product',
            'index',
        function (
            $scope,
            modalOptions,
            product,
            index
        ) {

            $scope.product = product;

            $scope.delete = function() {
                modalOptions.delete( product, index );
                $scope.$hide();
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'passwordChangeModalCtrl', [
            '$scope',
            '$alert',
            'errorHandler',
            'utils',
            'userService',
        function (
            $scope,
            $alert,
            errorHandler,
            utils,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                sending: false,
                submitted: false
            };

            $scope.data = {
                currentPassword: '',
                newPassword: '',
                newPasswordRepeat: ''
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.changePassword = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.changePassword( $scope.data.currentPassword, $scope.data.newPassword ).then(
                        function(){
                            $scope.view.sending = false;
                            $alert({
                                title: 'Your password has been changed.',
                                content: '',
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'success',
                                show: true
                            });
                            $scope.$hide();
                        },
                        function( response ){
                            console.log('changePassword response',response);
                            if ( response.status === 400 && typeof response.data.current_password !== 'undefined' ) {
                                $scope.form1.current_password.$setValidity('password', false);
                                $scope.view.sending = false;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        }
                    );
                }
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'appDeleteModalCtrl', [
            '$scope',
            '$alert',
            'campaignsService',
            'modalOptions',
            'app',
        function (
            $scope,
            $alert,
            campaignsService,
            modalOptions,
            app
        ) {

            $scope.app = app;

            $scope.delete = function() {
                modalOptions.delete( app );
                $scope.$hide();
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newAppModalCtrl', [
            '$scope',
            'errorHandler',
            'utils',
            'modalOptions',
            'applicationsService',
        function (
            $scope,
            errorHandler,
            utils,
            modalOptions,
            applicationsService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                showErrors: false,
                categoriesError: false
            };

            $scope.data = {
                appName: '',
                categories: [],
                selectedCategories: []
            };

            var init = function() {

                $scope.view.loading = true;

                applicationsService.getCategories().then(
                    function( response ) {
                        $scope.data.categories = response;
                        $scope.setSelectedCategories();
                        $scope.view.loading = false;
                    },
                    function() {
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            $scope.setSelectedCategories = function() {

                $scope.data.selectedCategories = [];

                angular.forEach( $scope.data.categories, function( category ){
                    if ( category.selected ) {
                        $scope.data.selectedCategories.push( category.id );
                    }
                });

                $scope.view.categoriesError = ( $scope.data.selectedCategories.length === 0 ) ? true : false;
            };

            $scope.clearCustomErrors = function() {
                $scope.form1.key_name.$setValidity( 'nameUnique', true );
            };

            var hasNameError = function( response ) {
                var error = _.findWhere( response.data.errorDetails.paramsMistake.mistakenParams, {name:'name'} );
                return ( typeof error !== 'undefined' ) ? true : false;
            };

            $scope.formSubmit = function() {

                $scope.view.sending = true;

                if ( $scope.form1.$valid && $scope.view.categoriesError === false ) {

                    applicationsService.addApp( $scope.data.appName, $scope.data.selectedCategories ).then(
                        function( app ){
                            modalOptions.submit( app );
                            $scope.$hide();
                        },
                        function( response ){

                            if ( response.status === 400 && hasNameError( response ) ) {
                                $scope.form1.key_name.$setValidity('nameUnique', false);
                                $scope.view.sending = false;
                                $scope.view.showErrors = true;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        }
                    );

                } else {
                    $scope.view.sending = false;
                    $scope.view.showErrors = true;
                }
            };

            init();
        }]);
})();

(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newCardModalCtrl', [
            '$scope',
            'errorHandler',
            'utils',
            'callbacks',
            'billingService',
        function (
            $scope,
            errorHandler,
            utils,
            callbacks,
            billingService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                braintreeLoading: true,
                braintreeReady: false,
                nonceReceived: false,
                savingCard: false,
                cardSaved: false
            };

            var init = function() {

                billingService.getClientToken().then(
                    function( clientToken ) {

                        var btIntegration;

                        braintree.setup( clientToken, "dropin", {
                            container: "braintree-form",
                            onReady: function( integration ){
                                $scope.view.braintreeLoading = false;
                                btIntegration = integration;
                                $scope.view.braintreeReady = true;
                                $scope.$apply();
                            },
                            onPaymentMethodReceived: function( response ) {
                                console.log("onPaymentMethodReceived", response);
                                $scope.view.nonceReceived = true;
                                $scope.view.savingCard = true;

                                btIntegration.teardown(function(){
                                    btIntegration = null;
                                });

                                var data = {
                                    payment_method_nonce: response.nonce
                                };
                                billingService.addCard( data ).then(
                                    function(){
                                        $scope.view.savingCard = false;
                                        $scope.view.cardSaved = true;
                                        callbacks.cardAdded();
                                    },
                                    function( response ){
                                        errorHandler.processApiResponse( response );
                                        $scope.$hide();
                                    }
                                );
                            }
                        });
                    },
                    function(){
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            init();
        }]);
})();

(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'cardDeleteModalCtrl', [
            '$scope',
            '$alert',
            'callbacks',
            'card',
        function (
            $scope,
            $alert,
            callbacks,
            card
        ) {

            $scope.card = card;

            $scope.delete = function() {
                callbacks.delete( card );
                $scope.$hide();
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'appKeyModalCtrl', [ '$scope', 'app', function ( $scope, app ) {
            $scope.app = app;
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'appEditModalCtrl', [
            '$scope',
            'app',
            'utils',
            'modalOptions',
            'errorHandler',
            'applicationsService',
        function (
            $scope,
            app,
            utils,
            modalOptions,
            errorHandler,
            applicationsService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                showErrors: false,
                categoriesError: false
            };

            $scope.data = {
                appName: app.name,
                categories: [],
                selectedCategories: app.app_categories
            };

            var init = function() {

                $scope.view.loading = true;

                applicationsService.getCategories( app.app_categories ).then(
                    function( response ) {
                        $scope.data.categories = response;
                        $scope.setSelectedCategories();
                        $scope.view.loading = false;
                    },
                    function() {
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            $scope.setSelectedCategories = function() {

                $scope.data.selectedCategories = [];

                angular.forEach( $scope.data.categories, function( category ){
                    if ( category.selected ) {
                        $scope.data.selectedCategories.push( category.id );
                    }
                });

                $scope.view.categoriesError = ( $scope.data.selectedCategories.length === 0 ) ? true : false;
            };

            $scope.clearCustomErrors = function() {
                $scope.form1.key_name.$setValidity( 'nameUnique', true );
            };

            var hasNameError = function( response ) {
                var error = _.findWhere( response.data.errorDetails.paramsMistake.mistakenParams, {name:'name'} );
                return ( typeof error !== 'undefined' ) ? true : false;
            };

            $scope.formSubmit = function() {

                $scope.view.sending = true;

                if ( $scope.form1.$valid && $scope.view.categoriesError === false ) {

                    applicationsService.updateApp( app.id, $scope.data.appName, $scope.data.selectedCategories ).then(
                        function( app ){
                            modalOptions.submit( app );
                            $scope.$hide();
                        },
                        function( response ){

                            if ( response.status === 400 && hasNameError( response ) ) {
                                $scope.form1.key_name.$setValidity('nameUnique', false);
                                console.log(">>>> name error");
                                $scope.view.sending = false;
                                $scope.view.showErrors = true;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        }
                    );
                } else {
                    $scope.view.sending = false;
                    $scope.view.showErrors = true;
                }
            };

            init();
        }]);
})();

(function(){
    "use strict";

    console.log('expiredCtrl loaded');

    angular.module('panelApp')
        .controller( 'expiredCtrl', [ '$scope', '$state', 'authService', function ( $scope, $state, authService ) {

            console.log('in expiredCtrl');

            $scope.view = {
                busy: false,
                formError: false
            };

            $scope.loginFormData = {
                email: '',
                password: ''
            };

            $scope.signinFormSubmit = function() {

                console.log('in signinFormSubmit()', $scope.loginFormData.email, $scope.loginFormData.password);

                $scope.view.busy = true;
                $scope.view.formError = false;

                authService.login( $scope.loginFormData.email, $scope.loginFormData.password ).then(
                    function( user ){
                        $scope.view.busy = false;
                        if ( user.usertype === 1 ) {
                            $state.go('campaigns');
                        } else {
                            $state.go('apikeys');
                        }
                    },
                    function(){
                        $scope.view.busy = false;
                        $scope.view.formError = true;
                    }
                );

            };
        }]);

})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'campaignsService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            campaignsService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10,
                filtersActive: false,
                campaignStatuses: [
                    {code: -1, label: 'Any status'},
                    {code: 0, label: 'Incomplete'},
                    {code: 1, label: 'Billing'},
                    {code: 2, label: 'Prepared'},
                    {code: 3, label: 'Live'},
                    {code: 4, label: 'Completed'},
                    {code: 5, label: 'Stopped'}
                ]
            };

            $scope.view.statusFilterModel = $scope.view.campaignStatuses[0];

            $scope.data = {
                campaignsCount: 0,
                campaigns: []
            };

            $scope.filters = {};

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                min: moment().format('YYYY-MM-DD')
            };

            var init = function() {
                initFilters();
                getCampaigns();
            };

            var initFilters = function() {
                $scope.filters = {
                    name: '',
                    client: '',
                    media_title: '',
                    start_date: '',
                    end_date: '',
                    status: undefined
                };
            };

            $scope.changePage = function() {
                getCampaigns();
            };

            $scope.reloadCampaigns = function() {
                $scope.view.currentPage = 1;
                getCampaigns();
            };

            var getCampaigns = function( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1)
                };

                if ( $scope.filters.name.length > 0 ) {
                    params.name = $scope.filters.name;
                }
                if ( $scope.filters.client.length > 0 ) {
                    params.client = $scope.filters.client;
                }
                if ( $scope.filters.media_title.length > 0 ) {
                    params.media_title = $scope.filters.media_title;
                }
                if ( $scope.filters.start_date.length >0 ) {
                    params.start_date = $scope.filters.start_date;
                }
                if ( $scope.filters.end_date.length >0 ) {
                    params.end_date = $scope.filters.end_date;
                }
                if ( typeof $scope.filters.status !== 'undefined' ) {
                    params.status = $scope.filters.status;
                }

                campaignsService.getCampaigns( params ).then(
                    function( campaigns ) {
                        $scope.data.campaignsCount = campaigns.count;
                        $scope.data.campaigns = campaigns.items;
                        $scope.view.initialLoadComplete = true;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var deleteCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.deleteCampaign( campaign.id ).then(
                    function() {
                        $alert({
                            title: 'Campagin deleted.',
                            content: 'Campaign "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getCampaigns();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.startCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.startCampaign( campaign.id ).then(
                    function() {

                        $alert({
                            title: 'Campagin started.',
                            content: 'Campaign "' + name + '" is now live.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });

                        getCampaigns();

                    },
                    function( response ) {

                        var processingError = _.findWhere( response.data.errorDetails.logicProcessing.processingErrors, { code: 3 } );

                        if ( typeof processingError !== 'undefined' ) {
                            $alert({
                                title: 'Incorrect campaign settings.',
                                content: 'Please review your campaign settings then start the campaign',
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'danger',
                                show: true
                            });
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );
            };

            var stopCampaign = function( campaign ) {
                var name = campaign.name;
                campaignsService.stopCampaign( campaign.id ).then(
                    function() {
                        $alert({
                            title: 'Campagin stopped.',
                            content: 'Campaign "' + name + '" has been stopped.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getCampaigns();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showCampaignDetails = function( campaignId ) {
                $modal({
                    templateUrl: 'panel-module/components/campaignDetailsModal/modalTmpl.html',
                    controller: 'campaignDetailsModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        campaignId: function () {
                            return campaignId;
                        }
                    }
                });
            };

            $scope.showDeleteCampaignDialog = function( campaign ) {
                var options = {
                    delete: function( campaign ) {
                        console.log('delete camapgin', campaign);
                        deleteCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/campaignDeleteModal/modalTmpl.html',
                    controller: 'campaignDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        campaign: function () {
                            return campaign;
                        }
                    }
                });
            };

            $scope.showStopCampaignDialog = function( campaign ) {
                var callbacks = {
                    stopCampaign: function( campaign ) {
                        console.log('stop camapgin', campaign);
                        stopCampaign( campaign );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/js/panel-module/components/campaignStopModal/modalTmpl.html',
                    controller: 'campaignStopModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        },
                        campaign: function () {
                            return campaign;
                        }
                    }
                });
            };

            $scope.updateFilters = function() {
                $scope.filters.status = ( $scope.view.statusFilterModel.code === -1 ) ? undefined : $scope.view.statusFilterModel.code;
                $scope.reloadCampaigns();
            };

            $scope.$watch('daterange.dates.startDate', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                $scope.filters.start_date = moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD');
                $scope.filters.end_date = moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD');
                $scope.updateFilters();
            });

            $scope.toggleFilters = function() {
                if ( $scope.view.filtersActive ) {
                    $scope.clearFilters();
                } else {
                    $scope.view.filtersActive = true;
                }
            };

            $scope.clearFilters = function() {
                $scope.view.filtersActive = false;
                initFilters();
                $scope.reloadCampaigns();
            };

            init();
        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'profileCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$q',
            'utils',
            'errorHandler',
            'userService',
        function (
            $scope,
            $alert,
            $modal,
            $q,
            utils,
            errorHandler,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                submitted: false
            };

            $scope.data = {
                user: {},
                countries: []
            };

            var init = function() {

                var deferred1 = $q.defer();
                var deferred2 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise
                ];

                userService.getUser().then(
                    function( user ) {
                        $scope.data.user = user;
                        deferred1.resolve( user );
                    },
                    function( response ) {
                        deferred1.reject( response );
                    }
                );

                userService.getCountries().then(
                    function( countries ) {
                        console.log('countries',countries);
                        $scope.data.countries = countries;
                        deferred2.resolve( countries );
                    },
                    function( response ) {
                        deferred2.reject( response );
                    }
                );

                $q.all( promisses ).then(
                    function() {
                        $scope.view.loading = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.showPasswordChangeDialog = function() {
                $modal({
                    templateUrl: 'panel-module/components/passwordChangeModal/modalTmpl.html',
                    controller: 'passwordChangeModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: 'static'
                });
            };

            $scope.saveProfile = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.updateUser( $scope.data.user ).then(
                        function(){
                            $scope.view.sending = false;
                            $alert({
                                title: 'Account settings saved.',
                                content: '',
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'success',
                                show: true
                            });
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            init();
        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'creditCardsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'billingService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            billingService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                busy: true
            };

            $scope.data = {
                cards: []
            };

            var init = function() {
                $scope.view.busy = true;
                getCards();
            };

            var getCards = function() {
                billingService.getCards().then(
                    function( cards ) {
                        $scope.data.cards = cards;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var deleteCard = function( card ) {
                billingService.deleteCard( card.payment_method_id ).then(
                    function() {
                        $alert({
                            title: 'Your credit card has been deleted.',
                            content: '',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getCards();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.setMainCard = function( card ) {
                billingService.setMainCard( card.payment_method_id ).then(
                    function( cards ) {
                        getCards();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteCardDialog = function( card ) {
                var callbacks = {
                    delete: function( card ) {
                        console.log('delete card', card);
                        deleteCard( card );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/cardDeleteModal/modalTmpl.html',
                    controller: 'cardDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        },
                        card: function () {
                            return card;
                        }
                    }
                });
            };

            $scope.showNewCardDialog = function() {
                var callbacks = {
                    cardAdded: function( card ) {
                        console.log("new card",card);
                        getCards();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newCardModal/modalTmpl.html',
                    controller: 'newCardModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        }
                    }
                });
            };

            init();
        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'addFundsCtrl', [
            '$q',
            'utils',
            '$scope',
            '$rootScope',
            'errorHandler',
            '$modal',
            'billingService',
            'userService',
        function (
            $q,
            utils,
            $scope,
            $rootScope,
            errorHandler,
            $modal,
            billingService,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                submitted: false,
                checkoutSuccess: false,
                checkoutFailure: false,
                paymentDeclined: false,
                mainCardError: false,
                showBillingDetailsForm: false
            };

            $scope.data = {
                card: {
                    masked_number: '',
                    expiration_date: null
                },
                countries: [],
                user: {
                    firstName:  '',
                    lastName: '',
                    company: '',
                    country: undefined,
                    city: '',
                    address: '',
                    postalCode: ''
                },
                amountsList: [ 500, 250, 100, 50 ],
                creditsCustomAmount: null,
                checkoutCredits: 0,
                checkoutTotal: 0,
                creditValue: null
            };

            var init = function() {

                $scope.view.loading = true;

                var deferred1 = $q.defer();
                var deferred2 = $q.defer();
                var deferred3 = $q.defer();
                var deferred4 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise,
                    deferred3.promise,
                    deferred4.promise
                ];

                billingService.getMainCard().then(
                    function( card ) {
                        $scope.data.card = card;
                        deferred1.resolve( card );
                    },
                    function( response ) {
                        $scope.view.mainCardError = true;
                        deferred1.reject( response );
                    }
                );

                userService.getBalance().then(
                    function( response ){
                        $scope.data.creditValue = ( 1 / response.cash_to_credits_conversion_ratio );
                        deferred2.resolve( $scope.data.creditValue );
                    },
                    function( response ){
                        deferred2.reject( response );
                    }
                );

                userService.getUser().then(
                    function( user ) {
                        $scope.data.user = {
                            firstName:  user.firstName,
                            lastName:   user.lastName,
                            company:    user.company,
                            country:    user.country,
                            city:       user.city,
                            address:    user.address,
                            postalCode: user.postalCode
                        };
                        deferred3.resolve( user );
                    },
                    function( response ) {
                        deferred3.reject( response );
                    }
                );

                userService.getCountries().then(
                    function( countries ) {
                        $scope.data.countries = countries;
                        deferred4.resolve( countries );
                    },
                    function( response ) {
                        deferred4.reject( response );
                    }
                );

                $q.all( promisses ).then(
                    function() {
                        if ( ! hasBillingDetails() ) {
                            $scope.view.showBillingDetailsForm = true;
                        }
                        $scope.view.loading = false;
                    },
                    function( response ) {
                        if ( $scope.view.mainCardError === true ) {
                            $scope.view.loading = false;
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );

            };

            var hasBillingDetails = function() {
                if ( $scope.data.user.firstName === '' ) { return false; }
                if ( $scope.data.user.lastName === '' ) { return false; }
                if ( $scope.data.user.company === '' ) { return false; }
                if ( $scope.data.user.country === undefined ) { return false; }
                if ( $scope.data.user.city === '' ) { return false; }
                if ( $scope.data.user.address === '' ) { return false; }
                if ( $scope.data.user.postalCode === '' ) { return false; }
                return true;
            };

            var resetData = function() {
                $scope.data.creditsCustomAmount = null;
                $scope.data.checkoutCredits = 0;
                $scope.data.checkoutTotal = 0;
            };

            var resetCheckoutStatus = function() {
                $scope.view.checkoutSuccess = false;
                $scope.view.checkoutFailure = false;
            };

            $scope.$watch( function(){ return $scope.data.checkoutCredits; }, function(){
                $scope.data.checkoutTotal = $scope.data.checkoutCredits * $scope.data.creditValue;
                if ( $scope.data.checkoutTotal > 0 ) {
                    resetCheckoutStatus();
                }
            });

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.changeBillingDetails = function() {
                $scope.view.showBillingDetailsForm = true;
            };

            $scope.selectCreditsPreset = function(amount) {
                $scope.data.checkoutCredits = amount;
                $scope.data.creditsCustomAmount = null;
            };

            $scope.selectCreditsCustom = function(amount) {
                $scope.data.checkoutCredits = amount;
            };

            $scope.checkoutCancel = function() {
                resetData();
            };

            $scope.checkoutCconfirm = function() {

                if ( $scope.view.showBillingDetailsForm && ! $scope.form1.$valid ) {

                    $scope.view.submitted = true;

                } else {

                    $scope.view.sending = true;
                    $scope.view.showBillingDetailsForm = false;

                    userService.updateUser( $scope.data.user ).then(
                        function(){
                            billingService.buyCredits( $scope.data.card.payment_method_id, $scope.data.checkoutCredits ).then(
                                function( response ){
                                    $scope.view.sending = false;
                                    $scope.view.checkoutSuccess = true;
                                    $rootScope.$broadcast('accountBalanceChanged');
                                    resetData();
                                },
                                function( response ){
                                    $scope.view.sending = false;
                                    if ( response.status === 400 && typeof response.data.error_code !== 'undefined' ) {
                                        if ( response.data.error_code === 1 ) {
                                            $scope.view.checkoutFailure = true;
                                        } else if ( response.data.error_code === 2 ) {
                                            $scope.view.paymentDeclined = true;
                                        }
                                    } else {
                                        errorHandler.processApiResponse( response );
                                    }
                                    resetData();
                                }
                            );
                        },
                        function( response ){
                            $scope.view.sending = false;
                            errorHandler.processApiResponse( response );
                        }
                    );

                }
            };

            init();
        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'billingCtrl', [
            '$scope',
            '$modal',
            '$filter',
            'errorHandler',
            'billingService',
            'userService',
        function (
            $scope,
            $modal,
            $filter,
            errorHandler,
            billingService,
            userService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10
            };

            $scope.data = {
                transactionsCount: 0,
                transactions: [],
                user: {
                    hasBillingDetails: false
                }
            };

            $scope.filters = {};

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                datepickerLabel: 'Select date range'
            };

            var init = function() {

                userService.getUser().then(
                    function( user ) {

                        $scope.data.user.firstName  = user.firstName;
                        $scope.data.user.lastName   = user.lastName;
                        $scope.data.user.company    = user.company;
                        $scope.data.user.country    = user.country;
                        $scope.data.user.city       = user.city;
                        $scope.data.user.address    = user.address;
                        $scope.data.user.postalCode = user.postalCode;
                        $scope.data.user.hasBillingDetails = userHasBillingDetails();

                        getTransactions();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var userHasBillingDetails = function() {
                if ( $scope.data.user.firstName === '' ) { return false; }
                if ( $scope.data.user.lastName === '' ) { return false; }
                if ( $scope.data.user.company === '' ) { return false; }
                if ( $scope.data.user.country === undefined ) { return false; }
                if ( $scope.data.user.city === '' ) { return false; }
                if ( $scope.data.user.address === '' ) { return false; }
                if ( $scope.data.user.postalCode === '' ) { return false; }
                return true;
            };

            $scope.changePage = function() {
                getTransactions();
            };

            $scope.reloadTransactions = function() {
                $scope.view.currentPage = 1;
                getTransactions();
            };

            var getTransactions = function() {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1)
                };

                if ( $scope.filters.start_date ) {
                    params.start_date = $scope.filters.start_date;
                }
                if ( $scope.filters.end_date ) {
                    params.end_date = $scope.filters.end_date;
                }

                billingService.getTransactions( params ).then(
                    function( transactions ) {
                        $scope.data.transactionsCount = transactions.count;
                        $scope.data.transactions = transactions.results;
                        $scope.view.initialLoadComplete = true;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.updateFilters = function() {
                $scope.reloadTransactions();
            };

            $scope.getInvoicePdf = function( transactionId ) {

                var modal = $modal({
                    templateUrl: '/panel-module/components/invoiceDownloadModal/modalTmpl.html',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });

                billingService.getInvoicePdf( transactionId ).then(
                    function( response ){
                        modal.$promise.then(modal.hide);
                    },
                    function( response ){
                        errorHandler.processApiResponse( response );
                        modal.$promise.then(modal.hide);
                    }
                );
            };

            $scope.$watch('daterange.dates.startDate', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                $scope.filters.start_date = moment.utc( $scope.daterange.dates.startDate ).hour(0).minute(0).second(0).format('YYYY-MM-DD');
                $scope.filters.end_date = moment.utc( $scope.daterange.dates.endDate ).hour(23).minute(59).second(59).format('YYYY-MM-DD');
                $scope.daterange.datepickerLabel =  $filter('date')( $scope.filters.start_date, 'yyyy-MM-dd' ) + ' - ' + $filter('date')( $scope.filters.end_date, 'yyyy-MM-dd' );
                $scope.updateFilters();
            });

            init();
        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'apiKeysCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'applicationsService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            applicationsService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                busy: true,
                currentPage: 1,
                maxSize: 10,
                itemsPerPage: itemsPerPage,
                filtersActive: false,
                initialLoadComplete: false
            };

            $scope.data = {
                appsCount: 0,
                apps: []
            };

            $scope.filters = {};

            var init = function() {
                initFilters();
                getApps();
            };

            var initFilters = function() {
                $scope.filters = {
                    name: '',
                    api_key: ''
                };
            };

            $scope.changePage = function() {
                getApps();
            };

            $scope.reloadApps = function() {
                $scope.view.currentPage = 1;
                getApps();
            };

            var getApps = function( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1)
                };

                if ( $scope.filters.name.length > 0 ) {
                    params.name = $scope.filters.name;
                }
                if ( $scope.filters.api_key.length > 0 ) {
                    params.api_key = $scope.filters.api_key;
                }

                $scope.view.busy = true;
                applicationsService.getApps( params ).then(
                    function( apps ) {
                        $scope.data.appsCount = apps.count;
                        $scope.data.apps = apps.items;
                        $scope.view.busy = false;
                        $scope.view.initialLoadComplete = true;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var deleteApp = function( app ) {
                var name = app.name;
                applicationsService.deleteApp( app.id ).then(
                    function() {
                        $alert({
                            title: 'Application deleted.',
                            content: 'Application "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getApps();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteAppDialog = function( app ) {
                var options = {
                    delete: function( app ) {
                        console.log('delete app', app);
                        deleteApp( app );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/appDeleteModal/modalTmpl.html',
                    controller: 'appDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        app: function () {
                            return app;
                        }
                    }
                });
            };

            $scope.showNewAppDialog = function() {
                var options = {
                    submit: function( app ) {
                        $alert({
                            title: 'Application added.',
                            content: 'Application "' + app.name + '" has been added.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.reloadApps();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newAppModal/modalTmpl.html',
                    controller: 'newAppModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showAppEditDialog = function( app ) {
                var options = {
                    submit: function( app ) {
                        $alert({
                            title: 'Application updated.',
                            content: '',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.reloadApps();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/appEditModal/modalTmpl.html',
                    controller: 'appEditModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        app: function () {
                            return app;
                        }
                    }
                });
            };

            $scope.showAppKeyDialog = function( app ) {
                $modal({
                    templateUrl: 'panel-module/components/appKeyModal/modalTmpl.html',
                    controller: 'appKeyModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        app: function () {
                            return app;
                        }
                    }
                });
            };

            $scope.updateFilters = function() {
                $scope.reloadApps();
            };

            $scope.toggleFilters = function() {
                if ( $scope.view.filtersActive ) {
                    $scope.clearFilters();
                } else {
                    $scope.view.filtersActive = true;
                }
            };

            $scope.clearFilters = function() {
                $scope.view.filtersActive = false;
                initFilters();
                $scope.reloadApps();
            };

            init();
        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'mediaCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'mediaService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            mediaService
        ) {

            var itemsPerPage = 9;

            $scope.view = {
                busy: true,
                currentPage: 1,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [
                    {
                        value: 'name',
                        label: 'Order by title'
                    },
                    {
                        value: '-date_added',
                        label: 'Newest first'
                    }
                ],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.data = {
                mediaCount: 0,
                media: []
            };

            var init = function() {
                getMedia();
            };

            $scope.reloadMedia = function() {
                $scope.view.currentPage = 1;
                getMedia();
            };

            $scope.changeOrder = function() {
                $scope.view.currentPage = 1;
                getMedia();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getMedia();
            };

            $scope.nextPage = function() {
                //console.log("SCROLL",$scope.data.media.length, $scope.data.mediaCount, $scope.view.currentPage)
                if ( $scope.view.busy || $scope.data.media.length === $scope.data.mediaCount ) {
                    return;
                }
                $scope.view.currentPage++;
                getMedia();
            };

            var getMedia = function( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1),
                    ordering: $scope.view.orderBy
                };

                if ( $scope.view.searchPhrase.length > 0 ) {
                    params.name = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                mediaService.getMedia( params ).then(
                    function( media ) {
                        $scope.data.mediaCount = media.count;
                        if ( $scope.view.currentPage === 1 ) {
                            $scope.data.media = media.items;
                        } else {
                            $scope.data.media = $scope.data.media.concat( media.items );
                        }
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteMedia = function( media ) {
                var name = media.name;
                mediaService.deleteMedia( media.id ).then(
                    function() {
                        $alert({
                            title: 'Media deleted.',
                            content: 'Media collection "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.reloadMedia();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showNewMediaDialog = function() {
                var options = {
                    submit: function( mediaId ) {
                        console.log("mediaId",mediaId);
                        $scope.reloadMedia();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newMediaModal/modalTmpl.html',
                    controller: 'newMediaModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showDeleteMediaDialog = function( media ) {
                var options = {
                    delete: function( media ) {
                        console.log('delete media', media);
                        deleteMedia( media );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/mediaDeleteModal/modalTmpl.html',
                    controller: 'mediaDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        media: function () {
                            return media;
                        }
                    }
                });
            };

            init();
        }]);
})();


(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'mediaViewCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            '$modal',
            '$sce',
            'errorHandler',
            'mediaService',
        function (
            $scope,
            $state,
            $stateParams,
            $alert,
            $modal,
            $sce,
            errorHandler,
            mediaService
        ) {

            $scope.view = {
                busy: false
            };

            $scope.data = {
                mediaId: $stateParams.mediaId,
                mediaItem: {}
            };

            $scope.videogular = { sources: [] };

            var init = function() {
                $scope.view.busy = true;
                mediaService.getMediaItem( $scope.data.mediaId ).then(
                    function( mediaItem ) {
                        $scope.data.mediaItem = mediaItem;
                        $scope.setVideo();
                        $scope.view.mediaLoaded = true;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteMedia = function( media ) {
                var name = media.name;
                mediaService.deleteMedia( media.id ).then(
                    function() {
                        $alert({
                            title: 'Media deleted.',
                            content: 'Media collection "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $state.go('media');
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.setVideo = function() {
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.data.mediaItem.video), type: "video/mp4"}
                ];
            };

            $scope.showDeleteMediaDialog = function( media ) {
                var options = {
                    delete: function( media ) {
                        console.log('delete media', media);
                        deleteMedia( media );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/mediaDeleteModal/modalTmpl.html',
                    controller: 'mediaDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        media: function () {
                            return media;
                        }
                    }
                });
            };

            init();
        }]);

})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'mediaEditCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            'errorHandler',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
        function (
            $scope,
            $state,
            $stateParams,
            $alert,
            errorHandler,
            apiUrl,
            authToken,
            utils,
            mediaService,
            FileUploader
        ) {

            var uploader = $scope.uploader = new FileUploader({
                url: apiUrl + '/media/',
                method: 'PATCH',
                headers: {
                    'Authorization': 'Token ' + authToken.get()
                }
            });

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                busy: false,
                uploading: false,
                submitted: false,
                mediaCreated: false,

                videoUploadStarted: false,
                videoUploadProgress: 0,
                videoUploadComplete: false,

                imageUploadStarted: false,
                imageUploadProgress: 0,
                imageUploadComplete: false
            };

            $scope.data = {
                mediaId: $stateParams.mediaId,
                mediaItem: {},
                videoFile: '',
                imageFile: '',
                newVideoAdded: false,
                newImageAdded: false
            };

            $scope.errors = {
                video: {},
                image: {}
            };

            var init = function() {

                utils.addUploaderTypeFilter( uploader, 'video', {
                    videoFilter: ['video/mp4', 'video/ogg', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
                });
                utils.addUploaderTypeFilter( uploader, 'display', {
                    imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                });

                $scope.view.busy = true;
                mediaService.getMediaItem( $scope.data.mediaId ).then(
                    function( mediaItem ) {
                        $scope.data.mediaItem = mediaItem;
                        $scope.data.imageFile = mediaItem.display;
                        $scope.view.hasVideo = true;
                        $scope.view.mediaLoaded = true;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                    }
                );
            };


            uploader.onAfterAddingFile = function( newItem ) {

                utils.cleanupUploaderQueue( uploader );

                if ( newItem.alias === 'video' ) {
                    $scope.data.videoFile = newItem._file;
                    $scope.data.newVideoAdded = true;
                }
                if ( newItem.alias === 'display' ) {
                    $scope.data.imageFile = newItem._file;
                    $scope.data.newImageAdded = true;

                    mediaService.imageSizeHelper( newItem._file ).then(function( size ){
                        if ( ! mediaService.imageSizeValid( size.width, size.height ) ) {
                            $scope.errors.image.size = true;
                        } else {
                            delete $scope.errors.image.size;
                        }
                    });
                }
            };

            uploader.onBeforeUploadItem = function(item) {
                if ( item.alias === 'video' ) {
                    $scope.view.videoUploadStarted = true;
                }
                if ( item.alias === 'display' ) {
                    $scope.view.imageUploadStarted = true;
                }
                item.url = apiUrl + '/media/'+ $scope.data.mediaId +'/';
            };

            uploader.onCompleteItem = function( fileItem, response, status, headers ) {
                if ( fileItem.alias === 'video' ) {
                    $scope.view.videoUploadComplete = true;
                }
                if ( fileItem.alias === 'display' ) {
                    $scope.view.imageUploadComplete = true;
                }
            };

            uploader.onProgressItem = function(fileItem, progress) {
                if ( fileItem.alias === 'video' ) {
                    $scope.view.videoUploadProgress = progress;
                }
                if ( fileItem.alias === 'display' ) {
                    $scope.view.imageUploadProgress = progress;
                }
            };

            uploader.onCompleteAll = function() {
                $scope.view.mediaCreated = true;
                $alert({
                    title: 'Media saved.',
                    content: '',
                    container: '#alerts-container',
                    placement: 'top',
                    duration: 3,
                    type: 'success',
                    show: true
                });
                $state.go('media');
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };
            $scope.videoHasError = function() {
                return ( $scope.data.newVideoAdded && typeof $scope.data.videoFile !== 'object' );
            };
            $scope.imageHasError = function() {
                if ( $scope.data.newImageAdded && ( typeof $scope.data.imageFile !== 'object' || $scope.errors.image.size ) ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.saveMedia = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid && !$scope.imageHasError() && !$scope.videoHasError() ) {
                    $scope.view.uploading = true;
                    mediaService.updateMedia( $scope.data.mediaItem ).then(
                        function(){
                            if ( $scope.data.newVideoAdded || $scope.data.newImageAdded ) {
                                uploader.uploadAll();
                            } else {
                                $alert({
                                    title: 'Media saved.',
                                    content: '',
                                    container: '#alerts-container',
                                    placement: 'top',
                                    duration: 3,
                                    type: 'success',
                                    show: true
                                });
                                $state.go('media');
                            }
                        },
                        function(){
                            // Show error message
                            // $scope.$hide();
                        }
                    );
                }
            };

            init();
        }]);

})();


(function() {
    "use strict";

    angular.module('panelApp')
        .controller('productsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$http',
            'apiUrl',
            'authToken',
            'errorHandler',
            'productsService',
        function(
            $scope,
            $alert,
            $modal,
            $http,
            apiUrl,
            authToken,
            errorHandler,
            productsService
        ) {

            var itemsPerPage = 12;

            $scope.view = {
                busy: true,
                currentPage: 1,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [{
                    'value': 'title',
                    'label': 'Order by title'
                }, {
                    'value': '-date_added',
                    'label': 'Newest first'
                }],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.data = {
                deletedCount: 0,
                productsCount: 0,
                products: []
            };

            var init = function() {
                getProducts();
            };

            $scope.reloadProducts = function() {
                $scope.view.currentPage = 1;
                getProducts();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getProducts();
            };

            $scope.nextPage = function() {
                if ( $scope.view.busy || $scope.data.products.length === $scope.data.productsCount ) {
                    return;
                }
                $scope.view.currentPage++;
                getProducts();
            };

            var getProducts = function(argsObj) {

                var params = {
                    limit: itemsPerPage,
                    offset: ( itemsPerPage * ($scope.view.currentPage - 1) ) - $scope.data.deletedCount,
                    ordering: $scope.view.orderBy
                };

                if ($scope.view.searchPhrase.length > 0) {
                    params.title = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                productsService.getProducts(params).then(
                    function(products) {
                        $scope.data.productsCount = products.count;
                        if ($scope.view.currentPage === 1) {
                            $scope.data.products = products.items;
                        } else {
                            $scope.data.products = $scope.data.products.concat(products.items);
                        }
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteProduct = function( product, index ) {
                var title = product.title;

                productsService.deleteProduct(product.id).then(
                    function() {
                        $alert({
                            title: 'Product deleted.',
                            content: '"' + title + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.data.products.splice( index, 1 );
                        $scope.data.productsCount--;
                        $scope.data.deletedCount++;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showNewProductDialog = function() {
                var options = {
                    submit: function(newProduct) {
                        console.log("newProduct", newProduct);
                        $scope.reloadProducts();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newProductModal/modalTmpl.html',
                    controller: 'newProductModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showDeleteProductDialog = function( product, index ) {
                var options = {
                    delete: function( product, index ) {
                        deleteProduct( product, index );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/productDeleteModal/modalTmpl.html',
                    controller: 'productDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        product: function() {
                            return product;
                        },
                        index: function() {
                            return index;
                        }
                    }
                });
            };

            init();
        }
    ]);
})();

(function() {
    "use strict";

    angular.module('panelApp')
        .controller('productViewCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            '$modal',
            'errorHandler',
            'productsService',
        function(
            $scope,
            $state,
            $stateParams,
            $alert,
            $modal,
            errorHandler,
            productsService
        ) {

            $scope.view = {
                busy: false
            };

            $scope.data = {
                productId: $stateParams.productId,
                product: {}
            };

            var init = function() {
                $scope.view.busy = true;
                productsService.getProduct($scope.data.productId).then(
                    function(product) {
                        console.log(product);
                        $scope.data.product = product;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            var deleteProduct = function(product) {
                var title = product.title;
                productsService.deleteProduct(product.id).then(
                    function() {
                        $alert({
                            title: 'Product deleted.',
                            content: '"' + title + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $state.go('products');
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteProductDialog = function(product) {
                var options = {
                    delete: function(product) {
                        deleteProduct(product);
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/productDeleteModal/modalTmpl.html',
                    controller: 'productDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        product: function() {
                            return product;
                        }
                    }
                });
            };

            init();
        }
    ]);

})();

(function() {
    "use strict";

    angular.module('panelApp')
        .controller('productEditCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            'apiUrl',
            'utils',
            'authToken',
            'errorHandler',
            'FileUploader',
            'productsService',
            function(
                $scope,
                $state,
                $stateParams,
                $alert,
                apiUrl,
                utils,
                authToken,
                errorHandler,
                FileUploader,
                productsService
            ) {

                var uploader = $scope.uploader = new FileUploader({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });

                $scope.fieldHasError = utils.fieldHasError;
                $scope.urlRegex = utils.urlRegex();

                $scope.view = {
                    busy: false,
                    submitted: false,
                    uploading: false,
                    uploadStarted: false,
                    uploadProgress: 0,
                    uploadComplete: false
                };

                $scope.data = {
                    productId: $stateParams.productId,
                    product: {},
                    imageFile: '',
                    newImageAdded: false
                };

                var init = function() {

                    utils.addUploaderTypeFilter(uploader, 'image', {
                        imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                    });

                    $scope.view.busy = true;
                    productsService.getProduct($scope.data.productId).then(
                        function(product) {
                            $scope.data.product = product;
                            $scope.data.imageFile = product.image || product.image_url;
                            $scope.view.busy = false;
                        },
                        function( response ) {
                            $scope.view.busy = false;
                            errorHandler.processApiResponse( response );
                            $scope.$hide();
                        }
                    );
                };

                var success = function() {
                    $alert({
                        title: 'Product saved.',
                        content: '',
                        container: '#alerts-container',
                        placement: 'top',
                        duration: 3,
                        type: 'success',
                        show: true
                    });
                    $state.go('products');
                };

                uploader.onAfterAddingFile = function(item) {
                    utils.cleanupUploaderQueue(uploader);
                    $scope.data.imageFile = item._file;
                    $scope.data.newImageAdded = true;
                };

                uploader.onBeforeUploadItem = function(item) {
                    $scope.view.uploading = true;
                    $scope.view.uploadStarted = true;
                    item.url = apiUrl + '/products/' + $scope.data.productId + '/';
                };

                uploader.onProgressItem = function(fileItem, progress) {
                    $scope.view.uploadProgress = progress;
                };

                uploader.onSuccessItem = function(item, response, status, headers) {
                    $scope.view.uploadComplete = true;
                    success();
                };

                $scope.showErrors = function() {
                    return $scope.view.submitted;
                };

                $scope.imageHasError = function() {
                    return ($scope.data.newImageAdded && typeof $scope.data.imageFile !== 'object');
                };

                $scope.saveProduct = function() {
                    $scope.view.submitted = true;
                    if ($scope.form1.$valid) {
                        $scope.view.uploading = true;
                        productsService.updateProduct($scope.data.product).then(
                            function() {
                                if ($scope.data.newImageAdded) {
                                    uploader.uploadAll();
                                } else {
                                    success();
                                }
                            },
                            function() {}
                        );
                    }
                };

                init();
            }
        ]);

})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            'campaignEditorService',
        function (
            $scope,
            $state,
            $stateParams,
            campaignEditorService
        ) {

            var editor = campaignEditorService;

            $scope.logData = function() {
                editor.logData();
            };

            editor.init( $stateParams.campaignId );
            $scope.currentStep = editor.currentStep;

            $scope.states = {
                step1: 'campaigns.' + editor.mode() + '.step1',
                step2: 'campaigns.' + editor.mode() + '.step2',
                step3: 'campaigns.' + editor.mode() + '.step3',
                step4: 'campaigns.' + editor.mode() + '.step4',
                step5: 'campaigns.' + editor.mode() + '.step5',
                step6: 'campaigns.' + editor.mode() + '.step6'
            };

            $state.go( $scope.states.step1 );
        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'editCampaignCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            'campaignEditorService',
            'campaignsService',
            'errorHandler',
            '$alert',
        function (
            $scope,
            $state,
            $stateParams,
            campaignEditorService,
            campaignsService,
            errorHandler,
            $alert
        ) {

            var editor = campaignEditorService;

            editor.init( $stateParams.campaignId );

            $scope.view = {
                currentTab: 'details'
            };

            $scope.data = {
                campaign: {}
            };

            campaignsService.getCampaign( $stateParams.campaignId ).then(
                function( campaign ) {
                    if ( campaign.status === 3 ) {
                        $state.go('campaigns');
                    }
                    $scope.data.campaign = campaign;
                },
                function( response ) {
                    errorHandler.processApiResponse( response );
                }
            );

            $scope.switchTab = function( tab ) {
                $scope.view.currentTab = tab;
            };

            $scope.isCurrentTab = function( tab ) {
                return $scope.view.currentTab === tab;
            };

        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep1Ctrl', [
            '$scope',
            '$state',
            '$stateParams',
            'errorHandler',
            'campaignEditorService',
            'utils',
        function (
            $scope,
            $state,
            $stateParams,
            errorHandler,
            campaignEditorService,
            utils
        ) {

            var editor = campaignEditorService;
            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                busy: true
            };

            $scope.campaign = {};

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                min: moment().format('YYYY-MM-DD'),
                display: 'Select date range'
            };

            var init = function() {

                editor.currentStep('step1');
                editor.previousState( 'campaigns.' + editor.mode() + '.step1' );

                $scope.campaign = editor.dataGet('campaign');

                if ( typeof $scope.campaign.start_date !== 'undefined' && typeof $scope.campaign.end_date !== 'undefined' ) {
                    $scope.daterange.dates.startDate = moment.utc( $scope.campaign.start_date );
                    $scope.daterange.dates.endDate   = moment.utc( $scope.campaign.end_date );
                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                }

                $scope.view.busy = false;

            };

            $scope.$watch( function(){ return $scope.daterange.dates; }, function(newValue, oldValue) {
                if ( newValue === undefined || newValue.startDate === null || newValue.endDate === null ) {
                    return;
                }
                $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
            });

            $scope.showErrors = function() {
                return editor.stepGet('step1', 'submitted');
            };

            $scope.nextStep = function() {

                editor.stepSet('step1', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    editor.stepSet('step1', 'valid', true);

                    $scope.campaign.start_date = moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD') + 'T00:00:00.000Z';
                    $scope.campaign.end_date = moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD') + 'T23:59:59.999Z';
                    editor.dataSet('campaign', $scope.campaign);

                    editor.save('step1').then(
                        function(){
                            $state.go( 'campaigns.' + editor.mode() + '.step2' );
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );

                } else {
                    editor.stepSet('step1', 'valid', false);
                }
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - campaign', angular.copy( $scope.campaign ) );
            };

            init();

        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep2Ctrl', [
            '$scope',
            '$state',
            '$sce',
            'utils',
            '$modal',
            'errorHandler',
            'campaignsService',
            'campaignEditorService',
        function (
            $scope,
            $state,
            $sce,
            utils,
            $modal,
            errorHandler,
            campaignsService,
            campaignEditorService
        ) {

            var editor = campaignEditorService;
            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                busy: false,
                showErrors: false,
                errors: {},
                ageRanges: []
            };

            $scope.data = {
                allCategories: true,
                allLocations: true,
                categories: [],
                locations: [],
                gender: {
                    male: true,
                    female: true
                },
                os: {
                    ios: true,
                    android: true
                },
                ageRange: undefined
            };

            var init = function() {

                if ( ! editor.stepGet('step1', 'valid') ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step2');
                editor.previousState( 'campaigns.' + editor.mode() + '.step2' );

                var targetingData = editor.dataGet('targeting');
                if (  ! _.isEmpty( targetingData ) ) {

                    $scope.data = targetingData;

                } else {

                    $scope.view.busy = true;

                    campaignsService.getTargeting().then(
                        function( response ) {
                            $scope.data.allCategories  = response.allCategories;
                            $scope.data.allLocations   = response.allLocations;
                            $scope.data.categories     = response.categories;
                            $scope.data.locations      = response.locations;
                            $scope.data.gender         = response.gender;
                            $scope.data.os             = response.os;
                            $scope.data.ageRange       = response.ageRange;
                            $scope.view.ageRanges      = response.ageRanges;
                            $scope.view.busy = false;
                        },
                        function( response ) {
                            errorHandler.processApiResponse( response );
                        }
                    );
                }

            };

            $scope.nextStep = function() {

                $scope.view.busy = true;
                editor.stepSet('step2', 'submitted', true);

                campaignsService.saveTargeting( editor.dataGet( 'campaignId' ), $scope.data ).then(
                    function( response ) {
                        editor.stepSet('step2', 'valid', true);
                        editor.dataSet('targeting', $scope.data);
                        $state.go( 'campaigns.' + editor.mode() + '.step3' );
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        editor.stepSet('step2', 'valid', false);
                        if ( typeof response === 'object' && ! _.isEmpty( response.validationErrors ) ) {
                            $scope.view.showErrors = true;
                            $scope.view.errors = response.validationErrors;
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step1' );
            };

            $scope.resetError = function( errorName ) {
                if ( typeof $scope.view.errors[errorName] !== 'undefined' ) {
                    delete $scope.view.errors[errorName];
                }
            };

            init();

        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep3Ctrl', [
            '$scope',
            '$state',
            'utils',
            'errorHandler',
            'campaignsService',
            'campaignEditorService',
            '$timeout',
        function (
            $scope,
            $state,
            utils,
            errorHandler,
            campaignsService,
            campaignEditorService,
            $timeout
        ) {

            var editor = campaignEditorService;
            $scope.fieldHasError = utils.fieldHasError;

            $scope.hasBudget = false;

            $scope.view = {
                busy: false,
                showCharts: false
            };

            $scope.data = {
                budgetType: 'ongoing',
                bidAmount: undefined,
                budgetAmount: undefined
            };

            $scope.estViews = {
                daily: { percentage: 0, min: 0, max: 0 },
                total: { percentage: 0, min: 0, max: 0 }
            };

            $scope.estDailyViewsChart = {
                data: [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ],
                labels: ['', ''],
                colours: [ '#f9cd3f', '#dae2e5' ],
                options: {
                    animationEasing: 'easeOutQuart',
                    showTooltips: false,
                    segmentShowStroke: false,
                    percentageInnerCutout: 85
                }
            };

            $scope.estTotalViewsChart = {
                data: [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ],
                labels: ['', ''],
                colours: [ '#343b45', '#dae2e5' ],
                options: {
                    animationEasing: 'easeOutQuart',
                    showTooltips: false,
                    segmentShowStroke: false,
                    percentageInnerCutout: 85
                }
            };

            var mapBudgetType = function( type ) {
                var types = [ 'ongoing', 'fixed', 'daily' ];
                if ( typeof type === 'number' ) {
                    return types[ type - 1 ];
                } else if ( typeof type === 'string' ) {
                    type = types.indexOf( type );
                    return type + 1;
                }
            };

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step3');
                editor.previousState( 'campaigns.' + editor.mode() + '.step3' );

                var budgetingData = editor.dataGet('budgeting');

                if (  ! _.isEmpty( budgetingData ) ) {

                    $scope.data = budgetingData;
                    $scope.hasBudget = true;

                    $timeout(function(){
                        updateEstimatedViews();
                    }, 300 );

                } else {

                    $timeout(function(){
                        updateEstimatedViews();
                    }, 300 );
                }
            };

            $scope.changedBid = function() {
                updateEstimatedViews();
            };

            var updateEstimatedViews = function() {
                if ( typeof $scope.data.bidAmount === 'undefined' ) {
                    $scope.estViews = {
                        daily: { percentage: 0, min: 0, max: 0 },
                        total: { percentage: 0, min: 0, max: 0 }
                    };
                    updateCharts();
                    $scope.view.showCharts = true;
                } else {
                    campaignsService.getEstimatedViews( editor.dataGet('campaignId'), $scope.data.bidAmount ).then(
                        function( response ) {
                            $scope.estViews = response;
                            updateCharts();
                            $scope.view.showCharts = true;
                        },
                        function( response ) {
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            var updateCharts = function() {
                $scope.estDailyViewsChart.data = [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ];
                $scope.estTotalViewsChart.data = [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ];
            };

            $scope.showErrors = function() {
                return editor.stepGet('step3', 'submitted');
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step2' );
            };

            $scope.nextStep = function() {

                editor.stepSet('step3', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    $scope.view.busy = true;

                    var data = {
                        cost_per_view: $scope.data.bidAmount,
                        amount: $scope.data.budgetAmount,
                        type: mapBudgetType( $scope.data.budgetType )
                    };

                    if ( $scope.data.budgetType === 'ongoing' ) {
                        data.amount = 0;
                    }

                    campaignsService.saveCampaignBudget( editor.dataGet( 'campaignId' ), data, $scope.hasBudget ).then(
                        function( response ) {
                            editor.stepSet('step3', 'valid', true);
                            editor.dataSet('budgeting', $scope.data);
                            $state.go( 'campaigns.' + editor.mode() + '.step4' );
                        },
                        function( response ) {
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            init();

        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep4Ctrl', [
            '$scope',
            '$state',
            '$sce',
            'utils',
            '$modal',
            'errorHandler',
            'mediaService',
            'campaignEditorService',
        function (
            $scope,
            $state,
            $sce,
            utils,
            $modal,
            errorHandler,
            mediaService,
            campaignEditorService
        ) {

            var editor = campaignEditorService;

            $scope.fieldHasError = utils.fieldHasError;
            $scope.videogular = { sources: [] };
            $scope.videogularApi = null;

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid') ||
                    ! editor.stepGet('step3', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step4');
                editor.previousState( 'campaigns.' + editor.mode() + '.step4' );

                $scope.media = editor.dataGet('media');

                $scope.view = {
                    busy: false,
                    busyMedia: false,
                    mediaLoaded: false,
                    playerReady: false,
                    videoSet: false
                };

                if ( hasVideo() ) {
                    $scope.view.mediaLoaded = true;
                    if ( $scope.view.playerReady ) {
                        $scope.setVideo();
                    }
                }
            };

            var hasVideo = function() {
                if ( typeof $scope.media.video === 'string' ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.hasMedia = function() {
                if ( Object.getOwnPropertyNames( $scope.media ).length === 0 ) {
                    return false;
                } else {
                    return true;
                }
            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
                if ( hasVideo() && !$scope.view.videoSet ) {
                    $scope.setVideo();
                }
            };

            $scope.setVideo = function() {
                $scope.videogularApi.stop();
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.media.video), type: "video/mp4"}
                ];
                $scope.view.videoSet = true;
            };

            $scope.showMediaLibrary = function() {
                var options = {
                    submit: function( selectedMedia ) {
                        $scope.getMedia( selectedMedia.id );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/mediaLibraryModal/modalTmpl.html',
                    controller: 'mediaLibraryModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showNewMediaDialog = function() {
                var options = {
                    mode: 'campaignEditor',
                    submit: function( mediaId ) {
                        console.log("mediaId",mediaId);
                        $scope.getMedia( mediaId );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newMediaModal/modalTmpl.html',
                    controller: 'newMediaModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.getMedia = function( mediaId ) {
                $scope.view.busyMedia = true;
                mediaService.getMediaItem( mediaId ).then(
                    function( mediaItem ) {
                        $scope.media = mediaItem;
                        $scope.view.busyMedia = false;
                        $scope.setVideo();
                        $scope.view.mediaLoaded = true;
                    },
                    function() {
                        $scope.view.busyMedia = false;
                    }
                );
            };

            $scope.showErrors = function() {
                return editor.stepGet('step4', 'submitted');
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step3' );
            };

            $scope.nextStep = function() {

                editor.stepSet('step4', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    editor.stepSet('step4', 'valid', true);
                    editor.dataSet('media', $scope.media);

                    editor.save('step4').then(
                        function(){
                            $state.go( 'campaigns.' + editor.mode() + '.step5' );
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );

                } else {
                    editor.stepSet('step4', 'valid', false);
                }
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - media', angular.copy( $scope.media ) );
            };

            init();

        }]);
})();

(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep5Ctrl', [
            '$scope',
            '$state',
            'utils',
            '$modal',
            'errorHandler',
            'campaignsService',
            'campaignEditorService',
            'productsService',
        function (
            $scope,
            $state,
            utils,
            $modal,
            errorHandler,
            campaignsService,
            campaignEditorService,
            productsService
        ) {

            var editor = campaignEditorService;

            $scope.fieldHasError = utils.fieldHasError;
            $scope.urlRegex = utils.urlRegex();

            $scope.products = [];
            $scope.recommendedProducts = [];

            $scope.carouselOptions = {
                nav: true,
                dots: false,
                navText: ['<span class="glyphicon glyphicon-chevron-left"></span>','<span class="glyphicon glyphicon-chevron-right"></span>'],
                navRewind: false,
                loop: false,
                items: 4
            };

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid') ||
                    ! editor.stepGet('step3', 'valid') ||
                    ! editor.stepGet('step4', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step5');
                editor.previousState( 'campaigns.' + editor.mode() + '.step5' );

                $scope.products = editor.dataGet('products');

                productsService.getProducts({ limit: 16, offset: 0, ordering: '-last_used_date' }).then(
                    function( products ) {
                        $scope.recommendedProducts = products.items;
                    }
                );

                $scope.view = {
                    busy: false,
                    submitted: false
                };
            };

            $scope.hasProducts = function() {
                return ! _.isEmpty( $scope.products );
            };

            $scope.showErrors = function() {
                return editor.stepGet('step5', 'submitted');
            };

            $scope.skipStep = function() {
                editor.stepSet('step5', 'submitted', true);
                editor.stepSet('step5', 'valid', true);
                $state.go( 'campaigns.' + editor.mode() + '.step6' );
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step4' );
            };

            $scope.nextStep = function() {

                editor.stepSet('step5', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    editor.stepSet('step5', 'valid', true);
                    editor.dataSet('products', $scope.products);

                    editor.save('step5').then(
                        function(){
                            $state.go( 'campaigns.' + editor.mode() + '.step6' );
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );

                } else {
                    editor.stepSet('step5', 'valid', false);
                }
            };

            $scope.selectRecommendedProduct = function( selectedProduct ) {

                // var index = _.findIndex( $scope.recommendedProducts, function( product ) { return  product.id == selectedProduct.id });
                // console.log('index', index);
                // $scope.recommendedProducts.splice( index, 1 )

                $scope.products.unshift( selectedProduct );
            };

            $scope.showProductsLibrary = function() {
                var options = {
                    submit: function( selectedProduct ) {
                        $scope.products.unshift( selectedProduct );
                    }
                };
                $modal({
                    templateUrl: '/panel-module/components/producstLibraryModal/modalTmpl.html',
                    controller: 'producstLibraryModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showNewProductDialog = function() {
                var options = {
                    mode: 'campaignEditor',
                    submit: function( newProduct ) {
                        console.log("newProduct",newProduct);
                        $scope.products.unshift( newProduct );
                    }
                };
                $modal({
                    templateUrl: '/panel-module/components/newProductModal/modalTmpl.html',
                    controller: 'newProductModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.removeProduct = function( index ) {
                $scope.products.splice(index, 1);
                return;
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - products', angular.copy( $scope.products ) );
                return;
            };

            init();
        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep6Ctrl', [
            '$scope',
            '$state',
            '$sce',
            'utils',
            '$modal',
            'campaignsService',
            'campaignEditorService',
            'errorHandler',
        function (
            $scope,
            $state,
            $sce,
            utils,
            $modal,
            campaignsService,
            campaignEditorService,
            errorHandler
        ) {

            var editor = campaignEditorService;

            $scope.videogularApi = null;

            $scope.campaign = {};
            $scope.media = {};
            $scope.products = [];
            $scope.videogular = { sources: [] };

            $scope.view = {
                loading: true,
                playerReady: false,
                videoSet: false
            };

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid') ||
                    ! editor.stepGet('step3', 'valid') ||
                    ! editor.stepGet('step4', 'valid') ||
                    ! editor.stepGet('step5', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step6');
                editor.previousState( 'campaigns.' + editor.mode() + '.step6' );

                $scope.campaignId = editor.dataGet( 'campaignId' );

                $scope.view.loading = true;

                campaignsService.getCampaign( $scope.campaignId ).then(
                    function( campaign ){

                        $scope.campaign = campaign;

                        if ( campaign.media.length > 0 && typeof campaign.media[0] === 'object' ) {
                            $scope.media = campaign.media[0];
                        }

                        if ( campaign.products.length > 0 ) {
                            $scope.products = campaign.products;
                        }

                        $scope.view.loading = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );

            };

            $scope.onPlayerReady = function( API ) {
                $scope.videogularApi = API;
                $scope.view.playerReady = true;
                $scope.setVideo();
            };

            $scope.setVideo = function() {
                $scope.videogularApi.stop();
                $scope.videogular.sources = [
                    {src: $sce.trustAsResourceUrl($scope.media.video), type: "video/mp4"}
                ];
                $scope.view.videoSet = true;
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step5' );
            };

            $scope.finish = function() {
                campaignsService.setPrepared( $scope.campaignId ).then(
                    function( response ) {
                        $state.go('campaigns');
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.hasProducts = function() {
                return ( $scope.products.length > 0 ) ? true : false;
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - media', angular.copy( $scope.campaign ), angular.copy( $scope.media ), angular.copy( $scope.products ) );
            };

            init();
        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .factory('permissionsService', [
            'statePermissions',
            'authService',
        function(
            statePermissions,
            authService
        ) {

            var userHasAccess = function( stateName ) {
                var usertype = authService.getUsertype();
                return _.contains( statePermissions[usertype], stateName );
            };

            return {
                userHasAccess: userHasAccess
            };
        }]);

})();

(function(){
    'use strict';

    angular.module('panelApp')
        .factory('campaignEditorService', [
                '$q',
                'campaignsService',
                'clientsService',
                'productsService',
            function(
                $q,
                campaignsService,
                clientsService,
                productsService
        ) {

            var view = {};
            var data = {};
            var flags = {};

            var init = function( campaignId ) {

                view = {
                    currentStep: 'step1',
                    previousState: 'campaigns.new.step1',
                    'step1': {
                        valid: false,
                        submitted: false
                    },
                    'step2': {
                        valid: false,
                        submitted: false
                    },
                    'step3': {
                        valid: false,
                        submitted: false
                    },
                    'step4': {
                        valid: false,
                        submitted: false
                    },
                    'step5': {
                        valid: false,
                        submitted: false
                    },
                    'step6': {
                        valid: false,
                        submitted: false
                    }
                };

                data = {
                    campaignId: undefined,
                    campaign: {
                        name: undefined,
                        start_date: undefined,
                        end_date: undefined,
                        budget: undefined
                    },
                    targeting: {},
                    media: {},
                    products: []
                };

                flags = {
                    mode: 'new',
                    campaignLoaded: false
                };

                if ( typeof campaignId !== 'undefined' ) {
                    flag( 'mode', 'edit' );
                    dataSet( 'campaignId', campaignId );
                }
            };

            var mode = function() {
                return flags.mode;
            };

            var flag = function( name, val ) {
                if ( typeof val !== 'undefined' ) {
                    flags[name] = val;
                } else {
                    if ( typeof flags[name] !== 'undefined' ) {
                        return flags[name];
                    } else {
                        return false;
                    }
                }
            };

            var currentStep = function( step ) {
                if ( typeof step === 'string' ) {
                    view.currentStep = step;
                } else {
                    return view.currentStep;
                }
            };

            var previousState = function( state ) {
                if ( typeof state === 'string' ) {
                    view.previousState = state;
                } else {
                    return view.previousState;
                }
            };

            var stepGet = function( step, prop ) {
                if ( typeof step !== 'string' ) {
                    return false;
                }
                if ( typeof prop === 'string' ) {
                    return angular.copy( view[step][prop] );
                }
                return angular.copy( view[step] );
            };

            var stepSet = function( step, prop, val ) {
                if ( typeof step !== 'string' || typeof prop !== 'string' || typeof val === 'undefined' ) {
                    return false;
                }
                view[step][prop] = val;
                return stepGet( step );
            };

            var dataGet = function( prop ) {
                if ( typeof prop !== 'undefined' ) {
                    if ( typeof data[prop] !== 'undefined' ) {
                        return angular.copy( data[prop] );
                    } else {
                        return false;
                    }
                }
                return angular.copy( data );
            };

            var dataSet = function( prop, val ) {
                if ( typeof prop !== 'string' || typeof val === 'undefined' ) {
                    return false;
                }
                data[prop] = val;
                return dataGet();
            };

            var save = function( step ) {
                if ( step === 'step1' ) {
                    return saveStep1();
                } else if ( step === 'step2' ) {
                    return saveStep2();
                } else if ( step === 'step3' ) {
                    return saveStep3();
                } else if ( step === 'step4' ) {
                    return saveStep4();
                } else if ( step === 'step5' ) {
                    return saveStep5();
                }
            };

            var saveStep1 = function() {

                var deferred = $q.defer();

                var campaign = dataGet( 'campaign' );

                saveCampagin( deferred );

                return deferred.promise;
            };

            var saveCampagin = function( deferred ) {

                var campaign = dataGet( 'campaign' );

                var campaignData = {
                    name: campaign.name,
                    start_date: campaign.start_date,
                    end_date: campaign.end_date,
                    budget: campaign.budget
                };

                if ( dataGet( 'campaignId' ) ) {
                    campaignData.id = dataGet( 'campaignId' );
                }

                campaignsService.saveCampagin( campaignData ).then(
                    function( campaign ) {
                        dataSet( 'campaignId', campaign.id );
                        deferred.resolve( dataGet('campaign') );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );
            };

            var saveStep2 = function() {

                var deferred = $q.defer();

                saveCampagin( deferred );

                return deferred.promise;
            };

            var saveStep3 = function() {

                var deferred = $q.defer();

                saveCampagin( deferred );

                return deferred.promise;
            };

            var saveStep4 = function() {

                var deferred = $q.defer();

                var media = dataGet( 'media' );

                var mediaData = {
                    campaignId: dataGet( 'campaignId' ),
                    media: media.id,
                    media_title:  media.media_title,
                    media_description:  media.media_description
                };

                campaignsService.saveMedia( mediaData ).then(
                    function() {
                        //dataSet( 'campaignId', campaign.id );
                        deferred.resolve();
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var saveStep5 = function() {

                var deferred = $q.defer();

                var campaignId = dataGet( 'campaignId' );
                var products = dataGet( 'products' );

                productsService.updateProducts( products ).then(
                    function() {
                        campaignsService.saveProducts( campaignId, products ).then(
                            function( campaign ) {
                                deferred.resolve( campaign );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );


                return deferred.promise;
            };

            var logData = function(){
                console.log('campaignEditorService - data', angular.copy( data ) );
            };

            return {
                init: init,
                flag: flag,
                mode: mode,
                save: save,
                currentStep: currentStep,
                previousState: previousState,
                stepGet: stepGet,
                stepSet: stepSet,
                dataGet: dataGet,
                dataSet: dataSet,
                logData: logData
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .factory('campaignsService', [ '$q', 'apiService', function( $q, apiService ) {

            var getCampaigns = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 10,
                    offset: 0,
                    ordering: '-id'
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'ordering' in params ) {
                        requestParams.ordering = params.ordering;
                    }
                    if ( 'name' in params ) {
                        requestParams.name = params.name;
                    }
                    if ( 'client' in params ) {
                        requestParams.client = params.client;
                    }
                    if ( 'media_title' in params ) {
                        requestParams.media_title = params.media_title;
                    }
                    if ( 'start_date' in params ) {
                        requestParams.start_date = params.start_date;
                    }
                    if ( 'end_date' in params ) {
                        requestParams.end_date = params.end_date;
                    }
                    if ( 'status' in params ) {
                        requestParams.status = params.status;
                    }
                }

                apiService.get( '/campaigns/', requestParams, true ).then(
                    function( response ) {
                        console.log('getCampaigns() success', response);
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function( response ) {
                        console.log('getCampaigns() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getCampaign = function( campaignId ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/' + campaignId + '/', false, true ).then(
                    function( response ) {
                        console.log('getCampaign() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getCampaign() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteCampaign = function( campaignId ) {

                var deferred = $q.defer();

                apiService.delete( '/campaigns/' + campaignId + '/', false, true ).then(
                    function( response ) {
                        console.log('deleteCampaign() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteCampaign() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var stopCampaign = function( campaignId ) {
                return changeCampaignStatus( campaignId, 5 );
            };

            var startCampaign = function( campaignId ) {
                return changeCampaignStatus( campaignId, 3 );
            };

            var setPrepared = function( campaignId ) {
                return changeCampaignStatus( campaignId, 2 );
            };

            var changeCampaignStatus = function( campaignId, status ) {

                var deferred = $q.defer();

                var data = { status: status };

                apiService.put( '/campaigns/' + campaignId + '/status/', data, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var saveCampagin = function( campaign ) {

                var deferred = $q.defer();

                if ( typeof campaign.id === 'undefined' ) {
                    apiService.post( '/campaigns/', campaign, true ).then(
                        function( response ) {
                            console.log('saveCampaign() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaign() failure', response);
                            deferred.reject( response );
                        }
                    );
                } else {
                    apiService.patch( '/campaigns/' + campaign.id + '/', campaign, true ).then(
                        function( response ) {
                            console.log('saveCampaign() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaign() failure', response);
                            deferred.reject( response );
                        }
                    );
                }


                return deferred.promise;
            };

            var saveMedia = function( data ) {

                var deferred = $q.defer();

                var campaignId = data.campaignId;
                delete data.campaignId;

                apiService.patch( '/campaigns/' + campaignId + '/media/', data, true ).then(
                    function( response ) {
                        console.log('saveMedia() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('saveMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var saveProducts = function( campaignId, products ) {

                var deferred = $q.defer();

                var productsData = {
                    products: []
                };

                angular.forEach( products, function( product ){
                    productsData.products.push( product.id );
                });

                apiService.patch( '/campaigns/' + campaignId + '/products/', productsData, true ).then(
                    function( response ) {
                        console.log('saveProducts() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('saveProducts() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getTargetingLocations = function( selectedLocations ) {

                var deferred = $q.defer();

                apiService.get( '/countries/', null, true ).then(
                    function( response ) {

                        var allLocations = true;
                        var locations = [];

                        angular.forEach( response, function( name, id ){

                            id = parseInt( id );
                            var item = { id: id, name: name, selected: true };

                            if ( typeof selectedLocations !== 'undefined'  && selectedLocations.indexOf( id ) === -1 ) {
                                item.selected = false;
                                allLocations = false;
                            }

                            locations.push( item );
                        });

                        deferred.resolve({
                            allLocations: allLocations,
                            locations: locations
                        });
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            var getTargetingCategories = function( selectedCategories ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/categories/', null, true ).then(
                    function( response ) {

                        var allCategories = true;
                        var categories = [];

                        angular.forEach( response, function( name, id ){

                            id = parseInt( id );
                            var item = { id: id, name: name, selected: true };

                            if ( typeof selectedCategories !== 'undefined' && selectedCategories.indexOf( id ) === -1 ) {
                                item.selected = false;
                                allCategories = false;
                            }

                            categories.push( item );
                        });

                        deferred.resolve({
                            allCategories: allCategories,
                            categories: categories
                        });
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            var getAgeRanges = function() {
                return [
                    { value: 0, label: 'Any' },
                    { value: 2130, label: '21 - 30' },
                    { value: 3145, label: '31 - 45' },
                    { value: 4660, label: '46 - 60' },
                    { value: 6180, label: '61 - 80' }
                ];
            };

            var getTargeting = function( campaignId ) {

                var deferred  = $q.defer();
                var deferred1 = $q.defer();
                var deferred2 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise
                ];

                var data = {
                    gender: {},
                    os: {}
                };

                if ( typeof campaignId === 'undefined' ) {

                    getTargetingCategories().then(
                        function( response ) {
                            data.allCategories = response.allCategories;
                            data.categories    = response.categories;
                            deferred1.resolve();
                        },
                        function( response ) { deferred1.reject( response ); }
                    );

                    getTargetingLocations().then(
                        function( response ) {
                            data.allLocations = response.allLocations;
                            data.locations    = response.locations;
                            deferred2.resolve();
                        },
                        function( response ) { deferred2.reject( response ); }
                    );

                    $q.all( promisses ).then(
                        function() {
                            data.gender = { male: true, female: true };
                            data.os = { android: true, ios: true };
                            data.ageRanges = getAgeRanges();
                            data.ageRange = data.ageRanges[0];
                            deferred.resolve( data );
                        },
                        function( response ) { deferred.reject( response ); }
                    );

                } else {

                    apiService.get( '/campaigns/' + campaignId + '/targeting_options/', false, true ).then(
                        function( targetingData ) {

                            getTargetingCategories( targetingData.app_categories ).then(
                                function( response ) {
                                    data.allCategories = response.allCategories;
                                    data.categories    = response.categories;
                                    deferred1.resolve();
                                },
                                function( response ) { deferred1.reject( response ); }
                            );

                            getTargetingLocations( targetingData.location ).then(
                                function( response ) {
                                    data.allLocations = response.allLocations;
                                    data.locations    = response.locations;
                                    deferred2.resolve();
                                },
                                function( response ) { deferred2.reject( response ); }
                            );

                            $q.all( promisses ).then(
                                function() {

                                    // gender: 'F', 'M', 'A' (M+F)
                                    data.gender.male   = ( targetingData.gender === 'M' || targetingData.gender === 'A' ) ? true : false;
                                    data.gender.female = ( targetingData.gender === 'F' || targetingData.gender === 'A' ) ? true : false;

                                    // os: 0 - any, 1 - android, 2 - ios
                                    data.os.android = ( targetingData.os === 1 || targetingData.os === 0 ) ? true : false;
                                    data.os.ios     = ( targetingData.os === 2 || targetingData.os === 0 ) ? true : false;

                                    // Age ranges
                                    data.ageRanges = getAgeRanges();

                                    if ( targetingData.age_range.length > 1 ) {
                                        data.ageRange = data.ageRanges[0];
                                    } else {
                                        var selectedAgeRange = targetingData.age_range[0];
                                        data.ageRange = _.findWhere( data.ageRanges, { value: selectedAgeRange } );
                                    }

                                    deferred.resolve( data );
                                },
                                function( response ) { deferred.reject( response ); }
                            );
                        },
                        function( response ) { deferred.reject( response ); }
                    );
                }


                return deferred.promise;
            };

            var saveTargeting = function( campaignId, settings ) {

                var deferred = $q.defer();
                var data = {};
                var error = {
                    validationErrors: {}
                };

                // Operating system
                if ( settings.os.android === true && settings.os.ios === true ) {
                    data.os = 0;
                } else if ( settings.os.android === true ) {
                    data.os = 1;
                } else if ( settings.os.ios === true ) {
                    data.os = 2;
                } else {
                    error.validationErrors.os = true;
                }

                // Gender
                if ( settings.gender.male === true && settings.gender.female === true ) {
                    data.gender = 'A';
                } else if ( settings.gender.male === true ) {
                    data.gender = 'M';
                } else if ( settings.gender.female === true ) {
                    data.gender = 'F';
                } else {
                    error.validationErrors.gender = true;
                }

                // Age range
                if ( settings.ageRange.value === 0 ) {
                    data.age_range = [];
                    angular.forEach( getAgeRanges(), function( range ){
                        if ( range.value !== 0 ) {
                            data.age_range.push( range.value );
                        }
                    });
                } else {
                    data.age_range = [ settings.ageRange.value ];
                }

                // Locations
                data.location = [];
                angular.forEach( settings.locations, function( location ){
                    if ( settings.allLocations === true || location.selected === true ) {
                        data.location.push( location.id );
                    }
                });
                if ( data.location.length === 0 ) {
                    error.validationErrors.locations = true;
                }

                // Categories
                data.app_categories = [];
                angular.forEach( settings.categories, function( category ){
                    if ( settings.allCategories === true || category.selected === true ) {
                        data.app_categories.push( category.id );
                    }
                });
                if ( data.app_categories.length === 0 ) {
                    error.validationErrors.categories = true;
                }

                if ( _.isEmpty( error.validationErrors ) ) {
                    // Save data in the backend
                    apiService.put( '/campaigns/' + campaignId + '/targeting_options/', data, true ).then(
                        function( response ) { deferred.resolve( response ); },
                        function( response ) { deferred.reject( response ); }
                    );
                } else {
                    deferred.reject( error );
                }

                return deferred.promise;
            };

            var getEstimatedViews = function( campaignId, cpv ) {

                var deferred = $q.defer();
                var requestParams = {};

                if ( typeof cpv !== 'undefined' ) {
                    requestParams.cpv = cpv;
                }

                apiService.get( '/campaigns/' + campaignId + '/estimated_views/', requestParams, true ).then(
                    function( response ) {
                        console.log('getEstimatedViews() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getEstimatedViews() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getCampaignBudget = function( campaignId ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/' + campaignId + '/budget/', null, true ).then(
                    function( response ) {
                        console.log('getCampaignBudget() success', response);
                        // deferred.resolve( response );
                        // Temporary workaround until the endpoint is fixed (shouldn't have pagination)
                        deferred.resolve( response.results[0] );
                    },
                    function( response ) {
                        console.log('getCampaignBudget() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var saveCampaignBudget = function( campaignId, data, hasBudget, budgetId ) {

                var deferred = $q.defer();

                if ( hasBudget ) {
                    apiService.put( '/campaigns/' + campaignId + '/budget/' + budgetId + '/', data, true ).then(
                        function( response ) {
                            console.log('saveCampaignBudget() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaignBudget() failure', response);
                            deferred.reject( response );
                        }
                    );
                } else {
                    apiService.post( '/campaigns/' + campaignId + '/budget/', data, true ).then(
                        function( response ) {
                            console.log('saveCampaignBudget() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaignBudget() failure', response);
                            deferred.reject( response );
                        }
                    );
                }

                return deferred.promise;
            };

            var campaignHasBudget = function( campaignId ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/' + campaignId + '/budget/', null, true ).then(
                    function( response ) {
                        console.log('campaignHasBudget() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getCampaignBudget() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            return {
                getCampaigns: getCampaigns,
                getCampaign: getCampaign,
                saveCampagin: saveCampagin,
                deleteCampaign: deleteCampaign,
                saveProducts: saveProducts,
                saveMedia: saveMedia,
                stopCampaign: stopCampaign,
                startCampaign: startCampaign,
                setPrepared: setPrepared,
                saveTargeting: saveTargeting,
                getTargeting: getTargeting,
                getEstimatedViews: getEstimatedViews,
                getCampaignBudget: getCampaignBudget,
                saveCampaignBudget: saveCampaignBudget
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .factory('clientsService', [ '$q', 'apiService', function( $q, apiService ) {

            var getClients = function() {

                var deferred = $q.defer();

                apiService.get( '/clients/', false, true ).then(
                    function( response ) {
                        console.log('getClients() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getClients() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var saveClient = function( name ) {

                var deferred = $q.defer();

                var data = { name: name };

                apiService.post( '/clients/', data, true ).then(
                    function( client ) {
                        console.log('saveClient() success', client);
                        getClients().then(
                            function( clients ) {
                                deferred.resolve( client, clients );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    },
                    function( response ) {
                        console.log('saveClient() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            return {
                getClients: getClients,
                saveClient: saveClient
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .factory('mediaService', [ '$q', 'apiService', function( $q, apiService ) {

            var getMedia = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 6,
                    offset: 0,
                    ordering: 'name'
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'ordering' in params ) {
                        requestParams.ordering = params.ordering;
                    }
                    if ( 'name' in params ) {
                        requestParams.name = params.name;
                    }
                }

                apiService.get( '/media/', requestParams, true ).then(
                    function( response ) {
                        console.log('getMedia() success', response);
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function( response ) {
                        console.log('getMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getMediaItem = function( mediaId ) {

                var deferred = $q.defer();

                apiService.get( '/media/'+mediaId+'/', false, true ).then(
                    function( response ) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteMedia = function( mediaId ) {

                var deferred = $q.defer();

                apiService.delete( '/media/'+mediaId+'/', false, true ).then(
                    function( response ) {
                        console.log('deleteMedia() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var createMedia = function( mediaName ) {

                var deferred = $q.defer();

                var data = { name: mediaName };

                apiService.post( '/media/', data, true ).then(
                    function( response ) {
                        console.log('getMediaItem() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getMediaItem() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateMedia = function( mediaItem ) {

                var deferred = $q.defer();

                var data = {
                    name: mediaItem.name
                };

                apiService.patch( '/media/' + mediaItem.id + '/', data, true ).then(
                    function( response ) {
                        console.log('updateMedia() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('updateMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var imageSizeHelper = function( imageFile ) {

                var deferred = $q.defer();

                var reader = new FileReader();
                reader.readAsDataURL( imageFile );
                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        deferred.resolve({
                            width: this.width,
                            height: this.height
                        });
                    };
                };

                return deferred.promise;
            };

            var imageSizeValid = function( width, height ) {
                if ( width !== 1280 ) {
                    return false;
                }
                if ( height !== 1200 ) {
                    return false;
                }
                return true;
            };

            return {
                getMedia: getMedia,
                getMediaItem: getMediaItem,
                deleteMedia: deleteMedia,
                createMedia: createMedia,
                updateMedia: updateMedia,
                imageSizeHelper: imageSizeHelper,
                imageSizeValid: imageSizeValid
            };
        }]);
})();
(function() {
    'use strict';

    angular.module('panelApp')
        .factory('productsService', ['$http', '$q', 'apiService', function($http, $q, apiService) {

            var getProducts = function(params) {

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
                    function( response ) {
                        console.log('getProducts() success', response);
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function( response ) {
                        console.log('getProducts() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getProduct = function(productId) {

                var deferred = $q.defer();

                apiService.get('/products/' + productId + '/', false, true).then(
                    function( response ) {
                        console.log('getProduct() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getProduct() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var searchExternalProducts = function(params) {

                var deferred = $q.defer();

                $http({
                    url: 'http://search.ulab.com/wrapper/get_data',
                    method: "POST",
                    data: {
                        url: "http://staging.shopide.com/api/v1/products?search=" + encodeURIComponent( params.search ) + "&page=" + params.page + "&per=" + params.per,
                        type: "GET"
                    },
                    headers: {
                        Accept: 'application/vnd.ulab.v0+json'
                    }
                }).then(
                    function( response ) {
                        console.log('searchExternalProducts() success', response);
                        deferred.resolve( JSON.parse( response.data.data ) );
                    },
                    function( response ) {
                        console.log('searchExternalProducts() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteProduct = function(productId) {

                var deferred = $q.defer();

                apiService.delete('/products/' + productId + '/', false, true).then(
                    function( response ) {
                        console.log('deleteProduct() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteProduct() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateProduct = function(product) {

                var deferred = $q.defer();

                var data = {
                    title: product.title,
                    url: product.url,
                    price: product.price,
                    description: product.description
                };

                if ( data.url.match(/^http[s]?:\/\//i) === null ) {
                    data.url = 'http://' + data.url;
                }

                apiService.patch('/products/' + product.id + '/', data, true).then(
                    function( response ) {
                        console.log('updateProduct() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('updateProduct() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateProducts = function(products) {

                var deferred = $q.defer();

                var promisses = [];

                angular.forEach(products, function(product) {

                    var prodDeferred = $q.defer();

                    promisses.push(prodDeferred.promise);

                    updateProduct(product).then(
                        function( response ) {
                            prodDeferred.resolve( response );
                        },
                        function( response ) {
                            prodDeferred.reject( response );
                        }
                    );
                });

                $q.all(promisses).then(function() {
                    deferred.resolve();
                });

                return deferred.promise;
            };

            var createProductFromExternal = function( product ) {

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

              if ( data.url.match(/^http[s]?:\/\//i) === null ) {
                  data.url = 'http://' + data.url;
              }

              apiService.post('/products/', data, true).then(
                  function( response ) {
                      console.log('createProductFromExternal() success', response);
                      deferred.resolve( response );
                  },
                  function( response ) {
                      console.log('createProductFromExternal() failure', response);
                      deferred.reject( response );
                  }
              );

              return deferred.promise;
            };

            return {
                getProduct: getProduct,
                getProducts: getProducts,
                deleteProduct: deleteProduct,
                updateProduct: updateProduct,
                updateProducts: updateProducts,
                searchExternalProducts: searchExternalProducts,
                createProductFromExternal: createProductFromExternal
            };
        }]);
})();

(function(){
    'use strict';

    angular.module('panelApp')
        .factory('applicationsService', [ '$q', 'apiService', 'userService', function( $q, apiService, userService ) {

            var getApps = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 10,
                    offset: 0
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'name' in params ) {
                        requestParams.name = params.name;
                    }
                    if ( 'api_key' in params ) {
                        requestParams.api_key = params.api_key;
                    }
                }

                apiService.get( '/applications/', requestParams, true ).then(
                    function( data ) {
                        console.log('getApps() success', data);
                        deferred.resolve({
                            count: data.count,
                            items: data.results
                        });
                    },
                    function( response ) {
                        console.log('getApps() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteApp = function( appId ) {

                var deferred = $q.defer();

                apiService.delete( '/applications/' + appId + '/', false, true ).then(
                    function( data ) {
                        console.log('deleteApp() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('deleteApp() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var addApp = function( appName, selectedCategories ) {

                var deferred = $q.defer();

                userService.getUser().then(
                    function ( user ) {

                        var data = {
                            name: appName,
                            publisher: user.id,
                            app_categories: selectedCategories
                        };

                        apiService.post( '/applications/', data, true ).then(
                            function( data ) {
                                console.log('addApp() success', data);
                                deferred.resolve( data );
                            },
                            function( response ) {
                                console.log('addApp() failure', response);
                                deferred.reject( response );
                            }
                        );
                    },
                    function () {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateApp = function( id, appName, selectedCategories ) {

                var deferred = $q.defer();

                var data = {
                    name: appName,
                    app_categories: selectedCategories
                };

                apiService.patch( '/applications/' + id + '/', data, true ).then(
                    function( data ) {
                        console.log('updateApp() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('updateApp() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getCategories = function( selectedCategories ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/categories/', null, true ).then(
                    function( response ) {

                        var categories = [];

                        angular.forEach( response, function( name, id ){

                            id = parseInt( id );
                            var item = { id: id, name: name, selected: false };

                            if ( typeof selectedCategories !== 'undefined' && selectedCategories.indexOf( id ) !== -1 ) {
                                item.selected = true;
                            }

                            categories.push( item );
                        });

                        deferred.resolve( categories );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            return {
                getApps: getApps,
                deleteApp: deleteApp,
                addApp: addApp,
                updateApp: updateApp,
                getCategories: getCategories
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('panelApp')
        .factory('billingService', [
            '$q',
            'apiService',
            '$timeout',
            '$http',
            'apiUrl',
            'authToken',
        function(
            $q,
            apiService,
            $timeout,
            $http,
            apiUrl,
            authToken
        ) {

            var getCards = function() {

                var deferred = $q.defer();

                apiService.get( '/payments/cards/', false, true ).then(
                    function( response ) {
                        var cards = response.results;
                        if ( cards.length > 0 ) {
                            apiService.get( '/payments/cards/default/', false, true ).then(
                                function( response ){
                                    angular.forEach( cards, function( card ){
                                        card.default = ( card.payment_method_id === response.payment_method_id ) ? true : false;
                                    });
                                    deferred.resolve( cards );
                                },
                                function( response ){
                                    angular.forEach( cards, function( card ){
                                        card.default = false;
                                    });
                                    deferred.resolve( cards );
                                }
                            );
                        } else {
                            deferred.resolve( cards );
                        }
                    },
                    function( response ) {
                        console.log('getCards() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var addCard = function( data ) {

                var deferred = $q.defer();

                apiService.post( '/payments/cards/', data, true ).then(
                    function( response ) {
                        console.log('addCard() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('addCard() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var deleteCard = function( id ) {

                var deferred = $q.defer();

                apiService.delete( '/payments/cards/' + id + '/', false, true ).then(
                    function( response ) {
                        console.log('deleteCard() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteCard() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var setMainCard = function( id ) {

                var deferred = $q.defer();

                apiService.post( '/payments/cards/' + id + '/default/', false, true ).then(
                    function( response ) {
                        console.log('setMainCard() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('setMainCard() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getMainCard = function() {

                var deferred = $q.defer();

                apiService.get( '/payments/cards/default/', false, true ).then(
                    function( response ){
                        deferred.resolve( response );
                    },
                    function( response ){
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getClientToken = function() {

                var deferred = $q.defer();

                apiService.get( '/payments/cards/client_token/', false, true ).then(
                    function( response ) {
                        console.log('getClientToken() success', response);
                        deferred.resolve( response.client_token );
                    },
                    function( response ) {
                        console.log('getClientToken() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var buyCredits = function( paymentMethodId, credits ) {

                var deferred = $q.defer();

                var data = { credits: credits };

                apiService.post( '/payments/cards/' + paymentMethodId + '/buy_credits/', data, true ).then(
                    function( response ) {
                        console.log('buyCredits() success', response);
                        deferred.resolve( response.client_token );
                    },
                    function( response ) {
                        console.log('buyCredits() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getTransactions = function( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 10,
                    offset: 0,
                    ordering: '-id'
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'start_date' in params ) {
                        requestParams.start_date = params.start_date;
                    }
                    if ( 'end_date' in params ) {
                        requestParams.end_date = params.end_date;
                    }
                }

                apiService.get( '/payments/transactions/', requestParams, true ).then(
                    function( response ) {
                        console.log('getTransactions() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getTransactions() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getInvoicePdf = function( transactionId ) {

                var deferred = $q.defer();

                var request = {
                    method: 'GET',
                    responseType: 'blob',
                    url: apiUrl + '/payments/transactions/' + transactionId + '/invoice/',
                    headers: {
                        'Authorization': 'Token ' + authToken.get( true )
                    }
                };

                $http( request ).then(
                    function( response ) {
                        var blob = new Blob( [ response.data ], { type: 'application/pdf' } );
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = 'kaching_transaction_' + transactionId + '.pdf';
                        link.click();
                        deferred.resolve( response );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            return {
                getCards: getCards,
                addCard: addCard,
                deleteCard: deleteCard,
                setMainCard: setMainCard,
                getMainCard: getMainCard,
                getClientToken: getClientToken,
                buyCredits: buyCredits,
                getTransactions: getTransactions,
                getInvoicePdf: getInvoicePdf
            };
        }]);
})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("siteNav", function(){
            return {
                restrict: 'A',
                replace: true,
                templateUrl: kachingAppConfig.mainMenuTmpl
            };
        });

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("owlCarousel", function() {
            return {
                restrict: 'EA',
                transclude: false,
                link: function( scope, element, attrs ) {

                    scope.initCarousel = function() {

                        var defaultOptions = {};
                        var customOptions = scope.$eval($(element).attr('data-options'));

                        for (var key in customOptions) {
                            defaultOptions[key] = customOptions[key];
                        }

                        $(element).owlCarousel(defaultOptions);
                    };
                }
            };
        });

    angular.module('panelApp')
        .directive('owlCarouselItem', [function() {
            return {
                restrict: 'A',
                transclude: false,
                link: function(scope, element) {
                    // wait for the last item in the ng-repeat then call init
                    if (scope.$last) {
                        scope.initCarousel();
                    }
                }
            };
        }]);

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignProduct", [ 'utils', function( utils ){
            return {
                restrict: 'A',
                scope: {
                    product: '=campaignProduct',
                    index: '=productIndex',
                    showLabels: '=showLabels',
                    onRemove: '&'
                },
                templateUrl: 'panel-module/directives/campaignProduct/campaignProductTmpl.html',
                controller: ['$scope', function($scope){

                    $scope.urlRegex = utils.urlRegex();

                    $scope.remove = function( index ){
                        $scope.onRemove({ index: index });
                    };
                }]
            };
        }]);

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("ifmUploaderPreviewImage", ['$window', '$parse', function( $window, $parse ) {
            var helper = {
                support: !!$window.FileReader,
                isFile: function(item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function(file) {
                    var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                }
            };
            return {
                restrict: 'A',
                link: function( scope, el, attr, ctrl ) {

                    var reader;

                    if (!helper.support) return;

                    scope.$watch( attr.ifmUploaderPreviewImage, function( newValue, oldValue ) {
                        if ( typeof newValue === 'string' && newValue.length > 0 ) {
                            var url = $parse(attr.ifmUploaderPreviewImage)(scope);
                            el.css('background-image', 'url(' + url + ')').addClass('image-selected');
                        } else {

                            if ( !helper.isFile( newValue ) ) return;
                            if ( !helper.isImage( newValue ) ) return;
                            reader = new FileReader();
                            reader.onload = function (e) {
                                el.css('background-image', 'url(' + e.target.result + ')').addClass('image-selected');
                            };
                            reader.readAsDataURL( newValue );
                        }
                    });

                }
            };
        }]);

})();

(function(){
    "use strict";

    angular.module('panelApp')
        .directive("ifmUploaderPreviewVideo", ['$window', function( $window ) {
            return {
                restrict: 'A',
                link: function( scope, el, attr, ctrl ) {

                    scope.$watch( attr.ifmUploaderPreviewVideo, function( newValue, oldValue ) {
                        console.log('ifmUploaderPreviewVideo - newValue', newValue);
                        if ( typeof newValue === 'object' ) {
                            el.addClass('video-selected');
                        }
                    });

                }
            };
        }]);

})();
(function(){
    "use strict";

    console.log('ifmMin loaded');

    angular.module('panelApp')
        .directive("ifmMin", function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    var minVal = parseFloat( attr.ifmMin );
                    ctrl.$validators.ifmMin = function(modelValue, viewValue) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }
                        var val = parseFloat(viewValue);
                        if ( isNaN(val) ) {
                            return false;
                        }
                        return val >= minVal;
                    };
                }
            };
        });

})();

(function(){
    "use strict";

    angular.module('panelApp')
        .directive("ifmMax", function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    var maxVal = parseFloat( attr.ifmMax );
                    ctrl.$validators.ifmMax = function(modelValue, viewValue) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }
                        var val = parseFloat(viewValue);
                        if ( isNaN(val) ) {
                            return false;
                        }
                        return val <= maxVal;
                    };
                }
            };
        });

})();

(function(){
    "use strict";

    console.log('ifmNumber loaded');

    angular.module('panelApp')
        .directive("ifmNumber", function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function( scope, el, attr, ctrl ) {
                    ctrl.$validators.ifmNumber = function( modelValue, viewValue ) {
                        if ( ctrl.$isEmpty(modelValue) ) {
                            return true;
                        }
                        return !isNaN(parseFloat( viewValue )) && isFinite(viewValue);
                    };
                }
            };
        });

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignEditDetails", [
            '$alert',
            '$state',
            '$stateParams',
            '$filter',
            'utils',
            'errorHandler',
            'campaignsService',
        function(
            $alert,
            $state,
            $stateParams,
            $filter,
            utils,
            errorHandler,
            campaignsService
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: 'panel-module/directives/campaignEditDetails/campaignEditDetailsTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.view = {
                        busy: false,
                        submitted: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        campaign: {}
                    };

                    $scope.daterange = {
                        dates: {
                            startDate: null,
                            endDate:   null
                        },
                        min: moment().format('YYYY-MM-DD'),
                        display: 'Select date range'
                    };

                    var init = function() {

                        $scope.view.busy = true;

                        campaignsService.getCampaign( $scope.data.campaignId ).then(
                            function( campaign ){

                                $scope.data.campaign = campaign;

                                if ( typeof campaign.start_date !== 'undefined' && typeof campaign.end_date !== 'undefined' ) {
                                    $scope.daterange.dates.startDate = moment.utc( campaign.start_date );
                                    $scope.daterange.dates.endDate = moment.utc( campaign.end_date );
                                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                                }

                                $scope.view.busy = false;
                            },
                            function( response ) {
                                errorHandler.processApiResponse( response );
                            }
                        );

                    };

                    $scope.$watch( function(){ return $scope.daterange.dates; }, function(newValue, oldValue) {
                        if ( newValue === undefined || newValue.startDate === null || newValue.endDate === null ) {
                            return;
                        }
                        $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
                    });

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            var data = {
                                id: $scope.data.campaignId,
                                name: $scope.data.campaign.name,
                                start_date: moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                                end_date: moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD') + 'T23:59:59.999Z'
                            };

                            console.log("save",data);

                            campaignsService.saveCampagin( data ).then(
                                function(){
                                    $alert({
                                        title: 'Campaign details have been saved.',
                                        content: '',
                                        container: '#alerts-container',
                                        placement: 'top',
                                        duration: 3,
                                        type: 'success',
                                        show: true
                                    });
                                },
                                function( response ){
                                    errorHandler.processApiResponse( response );
                                }
                            );
                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }]
            };
        }]);

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignEditTargeting", [
            '$q',
            '$alert',
            '$state',
            '$stateParams',
            'campaignsService',
            'errorHandler',
            'utils',
        function(
            $q,
            $alert,
            $state,
            $stateParams,
            campaignsService,
            errorHandler,
            utils
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: 'panel-module/directives/campaignEditTargeting/campaignEditTargetingTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.view = {
                        busy: false,
                        showErrors: false,
                        errors: {},
                        ageRanges: []
                    };

                    $scope.data = {
                        allCategories: true,
                        allLocations: true,
                        categories: [],
                        locations: [],
                        gender: {
                            male: true,
                            female: true
                        },
                        os: {
                            ios: true,
                            android: true
                        },
                        ageRange: undefined
                    };

                    $scope.campaignId = $stateParams.campaignId;

                    var init = function() {

                        $scope.view.busy = true;

                        campaignsService.getTargeting( $scope.campaignId ).then(
                            function( response ) {
                                $scope.data.allCategories  = response.allCategories;
                                $scope.data.allLocations   = response.allLocations;
                                $scope.data.categories     = response.categories;
                                $scope.data.locations      = response.locations;
                                $scope.data.gender         = response.gender;
                                $scope.data.os             = response.os;
                                $scope.data.ageRange       = response.ageRange;
                                $scope.view.ageRanges      = response.ageRanges;
                                $scope.view.busy = false;
                            },
                            function( response ) {
                                errorHandler.processApiResponse( response );
                            }
                        );

                    };

                    $scope.saveForm = function() {

                        $scope.view.busy = true;

                        campaignsService.saveTargeting( $scope.campaignId, $scope.data ).then(
                            function( response ) {
                                $scope.view.showErrors = false;
                                $scope.view.busy = false;
                                $alert({
                                    title: 'Campaign details have been saved.',
                                    content: '',
                                    container: '#alerts-container',
                                    placement: 'top',
                                    duration: 3,
                                    type: 'success',
                                    show: true
                                });
                            },
                            function( response ) {
                                $scope.view.busy = false;
                                if ( typeof response === 'object' && ! _.isEmpty( response.validationErrors ) ) {
                                    $scope.view.showErrors = true;
                                    $scope.view.errors = response.validationErrors;
                                } else {
                                    errorHandler.processApiResponse( response );
                                }
                            }
                        );
                    };

                    $scope.resetError = function( errorName ) {
                        if ( typeof $scope.view.errors[errorName] !== 'undefined' ) {
                            delete $scope.view.errors[errorName];
                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }]
            };
        }]);

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignEditBudgeting", [
            '$alert',
            '$state',
            '$stateParams',
            '$timeout',
            'campaignsService',
            'errorHandler',
            'utils',
        function(
            $alert,
            $state,
            $stateParams,
            $timeout,
            campaignsService,
            errorHandler,
            utils
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: 'panel-module/directives/campaignEditBudgeting/campaignEditBudgetingTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.hasBudget = true;

                    $scope.view = {
                        busy: false,
                        showCharts: false,
                        submitted: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        budgetId: undefined,
                        budgetType: 'ongoing',
                        bidAmount: undefined,
                        budgetAmount: undefined
                    };

                    $scope.estViews = {
                        daily: { percentage: 0, min: 0, max: 0 },
                        total: { percentage: 0, min: 0, max: 0 }
                    };

                    $scope.estDailyViewsChart = {
                        data: [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ],
                        labels: ['', ''],
                        colours: [ '#f9cd3f', '#dae2e5' ],
                        options: {
                            animationEasing: 'easeOutQuart',
                            showTooltips: false,
                            segmentShowStroke: false,
                            percentageInnerCutout: 85
                        }
                    };

                    $scope.estTotalViewsChart = {
                        data: [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ],
                        labels: ['', ''],
                        colours: [ '#343b45', '#dae2e5' ],
                        options: {
                            animationEasing: 'easeOutQuart',
                            showTooltips: false,
                            segmentShowStroke: false,
                            percentageInnerCutout: 85
                        }
                    };

                    var mapBudgetType = function( type ) {
                        var types = [ 'ongoing', 'fixed', 'daily' ];
                        if ( typeof type === 'number' ) {
                            return types[ type - 1 ];
                        } else if ( typeof type === 'string' ) {
                            type = types.indexOf( type );
                            return type + 1;
                        }
                    };

                    var init = function() {

                        $scope.view.busy = true;

                        campaignsService.getCampaignBudget( $scope.data.campaignId ).then(
                            function( response ) {
                                if ( typeof response === 'undefined' ) {
                                    $scope.hasBudget = false;
                                } else {
                                    $scope.data.budgetId = response.id;
                                    $scope.data.bidAmount = response.cost_per_view;
                                    $scope.data.budgetAmount = response.amount;
                                    $scope.data.budgetType = mapBudgetType( response.type );
                                }
                                $scope.view.busy = false;
                                updateEstimatedViews();
                            },
                            function( response ) {
                                errorHandler.processApiResponse( response );
                            }
                        );
                    };

                    $scope.changedBid = function() {
                        updateEstimatedViews();
                    };

                    var updateEstimatedViews = function() {
                        if ( typeof $scope.data.bidAmount === 'undefined' ) {
                            $scope.estViews = {
                                daily: { percentage: 0, min: 0, max: 0 },
                                total: { percentage: 0, min: 0, max: 0 }
                            };
                            updateCharts();
                            $scope.view.showCharts = true;
                        } else {
                            campaignsService.getEstimatedViews( $scope.data.campaignId, $scope.data.bidAmount ).then(
                                function( response ) {
                                    $scope.estViews = response;
                                    updateCharts();
                                    $scope.view.showCharts = true;
                                },
                                function( response ) {
                                    errorHandler.processApiResponse( response );
                                }
                            );
                        }
                    };

                    var updateCharts = function() {
                        $scope.estDailyViewsChart.data = [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ];
                        $scope.estTotalViewsChart.data = [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ];
                    };

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            var data = {
                                cost_per_view: $scope.data.bidAmount,
                                amount: $scope.data.budgetAmount,
                                type: mapBudgetType( $scope.data.budgetType )
                            };

                            if ( $scope.data.budgetType === 'ongoing' ) {
                                data.amount = 0;
                            }

                            campaignsService.saveCampaignBudget( $scope.data.campaignId, data, $scope.hasBudget, $scope.data.budgetId ).then(
                                function( response ) {
                                    $alert({
                                        title: 'Campaign details have been saved.',
                                        content: '',
                                        container: '#alerts-container',
                                        placement: 'top',
                                        duration: 3,
                                        type: 'success',
                                        show: true
                                    });
                                },
                                function( response ) {
                                    errorHandler.processApiResponse( response );
                                }
                            );
                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }]
            };
        }]);

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignEditMedia", [
            '$state',
            '$stateParams',
            '$alert',
            '$sce',
            'apiUrl',
            'utils',
            '$modal',
            'errorHandler',
            'mediaService',
            'campaignsService',
        function(
            $state,
            $stateParams,
            $alert,
            $sce,
            apiUrl,
            utils,
            $modal,
            errorHandler,
            mediaService,
            campaignsService
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: 'panel-module/directives/campaignEditMedia/campaignEditMediaTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;
                    $scope.videogular = { sources: [] };
                    $scope.videogularApi = null;

                    $scope.view = {
                        loading: false,
                        submitted: false,
                        loadingMedia: false,
                        mediaLoaded: false,
                        playerReady: false,
                        videoSet: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        campaign: {},
                        media: {},
                        mediaTitle: '',
                        mediaDesc: ''
                    };

                    var init = function() {

                        $scope.view.loading = true;
                        campaignsService.getCampaign( $scope.data.campaignId ).then(function( campaign ){
                            $scope.data.campaign = campaign;
                            if ( campaign.media.length > 0 && typeof campaign.media[0] === 'object' ) {
                                $scope.data.media = campaign.media[0];
                                $scope.data.mediaTitle = campaign.media[0].media_title;
                                $scope.data.mediaDesc  = campaign.media[0].media_description;
                            }
                            $scope.view.loading = false;

                            if ( hasVideo() ) {
                                $scope.view.mediaLoaded = true;
                                if ( $scope.view.playerReady ) {
                                    $scope.setVideo();
                                }
                            }
                        });
                    };

                    var hasVideo = function() {
                        if ( typeof $scope.data.media.video === 'string' ) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    $scope.hasMedia = function() {
                        if ( Object.getOwnPropertyNames( $scope.data.media ).length === 0 ) {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    $scope.onPlayerReady = function( API ) {
                        $scope.view.playerReady = true;
                        $scope.videogularApi = API;
                        if ( hasVideo() && !$scope.view.videoSet ) {
                            $scope.setVideo();
                        }
                    };

                    $scope.setVideo = function() {
                        $scope.videogularApi.stop();
                        $scope.videogular.sources = [
                            {src: $sce.trustAsResourceUrl($scope.data.media.video), type: "video/mp4"}
                        ];
                        $scope.view.videoSet = true;
                    };

                    $scope.showMediaLibrary = function() {
                        var options = {
                            submit: function( selectedMedia ) {
                                $scope.getMedia( selectedMedia.id );
                            }
                        };
                        $modal({
                            templateUrl: 'panel-module/components/mediaLibraryModal/modalTmpl.html',
                            controller: 'mediaLibraryModalCtrl',
                            animation: 'am-fade-and-scale',
                            resolve: {
                                modalOptions: function() {
                                    return options;
                                }
                            }
                        });
                    };

                    $scope.showNewMediaDialog = function() {
                        var options = {
                            mode: 'campaignEditor',
                            submit: function( mediaId ) {
                                console.log("mediaId",mediaId);
                                $scope.getMedia( mediaId );
                            }
                        };
                        $modal({
                            templateUrl: 'panel-module/components/newMediaModal/modalTmpl.html',
                            controller: 'newMediaModalCtrl',
                            animation: 'am-fade-and-scale',
                            backdrop: 'static',
                            resolve: {
                                modalOptions: function() {
                                    return options;
                                }
                            }
                        });
                    };

                    $scope.getMedia = function( mediaId ) {
                        $scope.view.loadingMedia = true;
                        $scope.view.mediaLoaded = false;
                        mediaService.getMediaItem( mediaId ).then(
                            function( media ) {
                                $scope.data.media = media;
                                $scope.setVideo();
                                $scope.view.loadingMedia = false;
                                $scope.view.mediaLoaded = true;
                            },
                            function() {
                                $scope.view.loadingMedia = false;
                            }
                        );
                    };

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            var mediaData = {
                                campaignId: $scope.data.campaignId,
                                media: $scope.data.media.id,
                                media_title:  $scope.data.mediaTitle,
                                media_description:  $scope.data.mediaDesc
                            };

                            console.log("save : mediaData", mediaData);

                            campaignsService.saveMedia( mediaData ).then(
                                function() {
                                    $alert({
                                        title: 'Campaign details have been saved.',
                                        content: '',
                                        container: '#alerts-container',
                                        placement: 'top',
                                        duration: 3,
                                        type: 'success',
                                        show: true
                                    });
                                },
                                function( response ) {
                                    errorHandler.processApiResponse( response );
                                }
                            );

                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }]
            };
        }]);

})();
(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignEditProducts", [
            '$state',
            '$stateParams',
            '$alert',
            '$sce',
            'apiUrl',
            'utils',
            '$modal',
            'errorHandler',
            'productsService',
            'campaignsService',
        function(
            $state,
            $stateParams,
            $alert,
            $sce,
            apiUrl,
            utils,
            $modal,
            errorHandler,
            productsService,
            campaignsService
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: 'panel-module/directives/campaignEditProducts/campaignEditProductsTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;
                    $scope.videogular = { sources: [] };
                    $scope.videogularApi = null;

                    $scope.view = {
                        loading: false,
                        submitted: false,
                        loadingMedia: false,
                        mediaLoaded: false,
                        playerReady: false,
                        videoSet: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        campaign: {},
                        products: []
                    };

                    var init = function() {

                        $scope.view.loading = true;
                        campaignsService.getCampaign( $scope.data.campaignId ).then(function( campaign ){
                            $scope.data.campaign = campaign;
                            if ( campaign.products.length > 0 ) {
                                $scope.data.products = campaign.products;
                            }
                            $scope.view.loading = false;
                        });
                    };

                    $scope.hasProducts = function() {
                        return ! _.isEmpty( $scope.data.products );
                    };

                    $scope.removeProduct = function( index ) {
                        $scope.data.products.splice(index, 1);
                        return;
                    };

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.showProductsLibrary = function() {
                        var options = {
                            submit: function( selectedProduct ) {
                                $scope.data.products.unshift( selectedProduct );
                            }
                        };
                        $modal({
                            templateUrl: 'panel-module/components/producstLibraryModal/modalTmpl.html',
                            controller: 'producstLibraryModalCtrl',
                            animation: 'am-fade-and-scale',
                            resolve: {
                                modalOptions: function() {
                                    return options;
                                }
                            }
                        });
                    };

                    $scope.showNewProductDialog = function() {
                        var options = {
                            mode: 'campaignEditor',
                            submit: function( newProduct ) {
                                console.log("newProduct",newProduct);
                                $scope.data.products.unshift( newProduct );
                            }
                        };
                        $modal({
                            templateUrl: 'panel-module/components/newProductModal/modalTmpl.html',
                            controller: 'newProductModalCtrl',
                            animation: 'am-fade-and-scale',
                            backdrop: 'static',
                            resolve: {
                                modalOptions: function() {
                                    return options;
                                }
                            }
                        });
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            console.log("save : data", $scope.data.campaignId, $scope.data.products);

                            productsService.updateProducts( $scope.data.products ).then(
                                function() {
                                    campaignsService.saveProducts( $scope.data.campaignId, $scope.data.products ).then(
                                        function( response ) {
                                            $alert({
                                                title: 'Campaign details have been saved.',
                                                content: '',
                                                container: '#alerts-container',
                                                placement: 'top',
                                                duration: 3,
                                                type: 'success',
                                                show: true
                                            });
                                        },
                                        function( response ) {
                                            errorHandler.processApiResponse( response );
                                        }
                                    );
                                },
                                function( response ) {
                                    errorHandler.processApiResponse( response );
                                }
                            );

                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }]
            };
        }]);

})();
(function(){
    'use strict';

    angular.module('panelApp')
        .filter('campaignStatus', function () {
            return function ( statusCode ) {
                var statusMap = [
                    'Incomplete',
                    'Billing',      // campaign that was created but the payment has to been yet processed
                    'Prepared',     // campaign created and waiting to go LIVE in their planned lottery
                    'Live',         // campaign currently available in KaChing
                    'Completed',
                    'Stopped'
                ];
                return statusMap[ parseInt(statusCode) ];
            };
        });

})();

(function(){
    'use strict';

    angular.module('panelApp')
        .filter('transactionStatus', function () {
            return function ( statusCode ) {
                var statusMap = [
                    'Pending',
                    'Completed',
                    'Failed'
                ];
                return statusMap[ parseInt(statusCode) - 1 ];
            };
        });

})();

(function(){
    'use strict';

    angular.module('panelApp')
        .filter('transactionType', function () {
            return function ( code ) {
                var statusMap = [
                    'One time pay'
                ];
                return statusMap[ parseInt(code) - 1 ];
            };
        });
})();

(function(){
    'use strict';

    angular.module('panelApp')
        .filter('budgetType', function () {
            return function ( type ) {
                var types = [ 'Ongoing', 'Fixed', 'Daily' ];
                return types[ type - 1 ];
            };
        });
})();

(function(){
    'use strict';

    angular.module('panelApp')
        .filter('trustUrl', ['$sce', function ($sce) {
            return function (recordingUrl) {
                return $sce.trustAsResourceUrl(recordingUrl);
            };
        }]);
})();

})(jQuery);
//# sourceMappingURL=panelApp.js.map
