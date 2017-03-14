(function() {
    'use strict';

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
            'chart.js',
            'ui.mask',
            'ngImgCrop',
            'ngMap',
            'ngCsv'
        ])
        .constant('apiUrl', kachingAppConfig.apiUrl)
        .constant('ulabApiUrl', kachingAppConfig.ulabApiUrl)
        .constant('sessionDays', 30)
        .constant('statePermissions', {
            advertiser: [
                'expired',
                'kaching.account',
                'kaching.cards',
                'kaching.funds',
                'kaching.fundManagement',
                'kaching.activeList',
                'kaching.archivedFund',
                'billing',
                'billing.paymentRequest',
                'billing.paymentRequest.edit',
                'kaching.campaigns',
                'kaching.campaigns.edit',
                'kaching.campaigns.view',
                'campaigns.new',
                'campaigns.new.step1',
                'campaigns.new.step2',
                'campaigns.new.step3',
                'campaigns.new.step4',
                'campaigns.new.step5',
                'campaigns.new.step6',
                'kaching.campaigns.newCampaign',
                'media',
                'media.view',
                'media.edit',
                'kaching.products',
                'kaching.products.view',
                'kaching.products.edit',
                'kaching.questions',
                'kaching.dashboard',
                'advertisements',
                'advertisements.new',
                'advertisements.edit',
                'zones',
                'kaching.analytics',
                'kaching.orderHistory',
                'kaching.orderHistory.edit',
                'kaching.lottery',
                'kaching.testLottery',
                'kaching.coinMapping',
                'kaching.advertiserOrganizationManagement',
                'kaching.advertiserOrganizationManagement.edit',
                'kaching.advertiserOrganizationManagement.new',
                'kaching.userManagement',
                'kaching.userManagement.edit',
                'kaching.userManagement.new',
                'kaching.userManagement.company',
                'kaching'
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
        'highchartsNGProvider',
        function(
            $stateProvider,
            $urlRouterProvider,
            statePermissions,
            highchartsNGProvider
        ) {

            var controllersPath = kachingAppConfig.wpTemplateUri + '/assets/kaching/panel-module/controllers/';
            highchartsNGProvider.basePath('/js/');
            var globalHeaderView = {
                controller: 'headerCtrl',
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/panel-module/components/header/headerTmpl.html'
            };

            $urlRouterProvider.otherwise('/kaching');

            $stateProvider
                // Kaching
                .state('kaching', {
                    url: '/kaching',
                    data: { title: 'Home' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'campaignsCtrl',
                            templateUrl: controllersPath + 'campaigns/campaignsTmpl.html'
                        }
                    }
                })
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
                .state('kaching.account', {
                    url: '/account',
                    data: { title: 'Account Settings' },
                    views: {
                        'main@': {
                            controller: 'profileCtrl',
                            templateUrl: controllersPath + 'profile/profileTmpl.html'
                        }
                    }
                })
                // Credit cards
                .state('kaching.cards', {
                    url: '/credit-cards',
                    data: { title: 'Credit Cards' },
                    views: {
                        'main@': {
                            controller: 'creditCardsCtrl',
                            templateUrl: controllersPath + 'creditCards/creditCardsTmpl.html'
                        }
                    }
                })
                // Analytics
                .state('kaching.analytics', {
                    url: '/analytics',
                    data: { title: 'Analytics' },
                    views: {
                        'main@': {
                            controller: 'analyticsCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/analytics/analyticsTmpl.html'
                        }
                    }
                })
                // Add funds
                .state('kaching.funds', {
                    url: '/add-funds',
                    data: { title: 'Add Funds' },
                    views: {
                        'main@': {
                            controller: 'addFundsCtrl',
                            templateUrl: controllersPath + 'addFunds/addFundsTmpl.html'
                        }
                    }
                })
                .state('kaching.fundManagement', {
                    url: '/fund-management',
                    data: { title: 'Fund Management' },
                    views: {
                        'main@': {
                            controller: 'fundManagementCtrl',
                            templateUrl: controllersPath + 'fundManagement/fundManagementTmpl.html'
                        }
                    }
                })
                .state('kaching.coinMapping', {
                    url: '/coin-mapping',
                    data: { title: 'Coin Mapping' },
                    views: {
                        'main@': {
                            controller: 'coinMappingCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/coin-mapping/coinMappingTmpl.html'
                        }
                    }
                })
                .state('kaching.activeList', {
                    url: '/active-list',
                    data: { title: 'Active Fund Lists' },
                    views: {
                        'main@': {
                            controller: 'activeFundCtrl',
                            templateUrl: controllersPath + 'addFunds/activeFundTmpl.html'
                        }
                    }
                })//archivedFund
                .state('kaching.archivedFund', {
                    url: '/archived-fund',
                    data: { title: 'Archived Fund Lists' },
                    views: {
                        'main@': {
                            controller: 'archivedFundCtrl',
                            templateUrl: controllersPath + 'addFunds/archivedFundTmpl.html'
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
                .state('billing.paymentRequest', {
                    url: '/payment-request',
                    data: { title: 'Payment Request' },
                    views: {
                        'main@': {
                            controller: 'paymentRequestCtrl',
                            templateUrl: controllersPath + 'billing/paymentRequestTmpl.html'
                        }
                    }
                })
                .state('billing.paymentRequest.edit', {
                    url: '/edit/:paymentId',
                    data: { title: 'Payment Request' },
                    views: {
                        'main@': {
                            controller: 'editPaymentRequestCtrl',
                            templateUrl: controllersPath + 'billing/editPaymentRequestTmpl.html'
                        }
                    }
                })
                // Dashboard
                .state('kaching.dashboard', {
                    url: '/dashboard',
                    data: { title: 'Dashboard' },
                    views: {
                        'main@': {
                            controller: 'dashboardCtrl',
                            templateUrl: controllersPath + 'dashboard/dashboard-tmpl.html'
                        }
                    }
                })
                ////////////
                // Campaigns
                ////////////
                .state('kaching.campaigns', {
                    url: '/campaigns',
                    data: { title: 'Campaigns' },
                    views: {
                        'main@': {
                            controller: 'campaignsCtrl',
                            templateUrl: controllersPath + 'campaigns/campaignsTmpl.html'
                        }
                    }
                })
                .state('kaching.campaigns.edit', {
                    url: '/edit/:campaignId',
                    data: { title: 'Edit Campaign' },
                    views: {
                        'main@': {
                            // controller: 'editCampaignCtrl',
                            // templateUrl: controllersPath + 'campaignEditor/editCampaignTmpl.html'
                            controller: 'newCampaignEditorCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/newCampaignEditor/newCampaignEditorTmpl.html'
                        }
                    }
                })
                .state('kaching.campaigns.view', {
                    url: '/view/:campaignId',
                    data: { title: 'Edit Campaign' },
                    views: {
                        'main@': {
                            controller: 'newCampaignEditorCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/newCampaignEditor/newCampaignEditorTmpl.html'
                        }
                    }
                })
                .state('kaching.campaigns.newCampaign', {
                    url: '/create-new-campaign',
                    data: { title: 'New Campaign' },
                    views: {
                        'main@': {
                            controller: 'newCampaignEditorCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/newCampaignEditor/newCampaignEditorTmpl.html'
                        }
                    },
                    resolve: {
                        campaignId: function(utils) {
                            return utils.getCampaignId();
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
                .state('advertisements', {
                    url: '/advertisements',
                    data: { title: 'Advertisement' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'advertisementsCtrl',
                            templateUrl: controllersPath + 'advertisement/advertisement-tmpl.html'
                        }
                    }
                })
                .state('advertisements.new', {
                    url: '/new-advertisement',
                    data: { title: 'Advertisement' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'editAdvertisementCtrl',
                            templateUrl: controllersPath + 'advertisementEditor/advertisement-editor-tmpl.html'
                        }
                    }
                })
                .state('advertisements.edit', {
                    url: '/edit/:advertId',
                    data: { title: 'Edit Advertisement' },
                    views: {
                        'main@': {
                            controller: 'editAdvertisementCtrl',
                            templateUrl: controllersPath + 'advertisementEditor/advertisement-editor-tmpl.html'
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
                .state('kaching.products', {
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
                .state('kaching.products.view', {
                    url: '/view/:productId',
                    data: { title: 'View Product' },
                    views: {
                        'main@': {
                            controller: 'productViewCtrl',
                            templateUrl: controllersPath + 'productView/productViewTmpl.html'
                        }
                    }
                })
                .state('kaching.products.edit', {
                    url: '/edit/:productId',
                    data: { title: 'Edit Product' },
                    views: {
                        'main@': {
                            controller: 'productEditCtrl',
                            templateUrl: controllersPath + 'productEdit/productEditTmpl.html'
                        }
                    }
                })
                .state('kaching.questions', {
                    url: '/questions',
                    data: { title: 'Questions' },
                    views: {
                        'header@': globalHeaderView,
                        'main@': {
                            controller: 'questionsCtrl',
                            templateUrl: controllersPath + 'questions/questionsTmpl.html'
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
                })
                ////////////////
                // Order History
                ////////////////
                .state('kaching.orderHistory', {
                    url: '/order-history',
                    data: { title: 'Order History' },
                    params: { updatingId: null },
                    views: {
                        'main@': {
                            controller: 'orderHistoryCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/order-history/orderHistoryTmpl.html'
                        }
                    }
                })
                /////////////////////
                // Order History Edit
                /////////////////////
                .state('kaching.orderHistory.edit', {
                    url: '/order-detail/:orderNumber',
                    data: { title: 'Order History Detail' },
                    params: { order: null },
                    views: {
                        'main@': {
                            controller: 'orderHistoryDetailCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/order-history/orderHistoryDetailTmpl.html'
                        }
                    }
                })
                /////////////////////
                // Lottery List
                /////////////////////
                .state('kaching.lottery', {
                    url: '/lottery',
                    data: { title: 'Lottery List' },
                    params: { order: null },
                    views: {
                        'main@': {
                            controller: 'lotteryCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/lottery/lotteryTmpl.html'
                        }
                    }
                })
                .state('kaching.testLottery', {
                    url: '/lottery-test',
                    data: { title: 'Lottery List' },
                    params: { order: null },
                    views: {
                        'main@': {
                            controller: 'testLotteryCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/lottery/testLotteryTmpl.html'
                        }
                    }
                })
                /////////////////////////
                // Advertiser Management
                /////////////////////////
                .state('kaching.advertiserOrganizationManagement', {
                    url: '/business-management',
                    data: { title: 'Business Management' },
                    views: {
                        'main@': {
                            controller: 'advertiserOrganizationManagementCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/advertiserOrganizationManagement/advertiserOrganizationManagementTmpl.html'
                        }
                    }
                })
                //////////////////////////////
                // New Advertiser Management
                //////////////////////////////
                .state('kaching.advertiserOrganizationManagement.new', {
                    url: '/new-business',
                    data: { title: 'New Business' },
                    views: {
                        'main@': {
                            controller: 'advertiserManagementDetailCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/advertiserOrganizationManagement/advertiserManagementCreateTmpl.html'
                        }
                    }
                })
                //////////////////////////////
                // Advertiser Management Edit
                //////////////////////////////
                .state('kaching.advertiserOrganizationManagement.edit', {
                    url: '/business-detail/:id',
                    data: { title: 'Business Management Detail' },
                    views: {
                        'main@': {
                            controller: 'advertiserManagementDetailCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/advertiserOrganizationManagement/advertiserManagementDetailTmpl.html'
                        }
                    }
                })
                ///////////////////
                // User Management
                ///////////////////
                .state('kaching.userManagement', {
                    url: '/user-management',
                    data: { title: 'User Management' },
                    views: {
                        'main@': {
                            controller: 'userManagementCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/userManagement/userManagementTmpl.html'
                        }
                    }
                })
                ////////////////////////
                // List User of Comapny Management
                ////////////////////////
                .state('kaching.userManagement.company', {
                    url: '/user-management/:company',
                    data: { title: 'User of management' },
                    views: {
                        'main@': {
                            controller: 'userManagementCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/userManagement/userManagementTmpl.html'
                        }
                    }
                })
                ////////////////////////
                // New User Management
                ////////////////////////
                .state('kaching.userManagement.new', {
                    url: '/new-user',
                    data: { title: 'New User' },
                    views: {
                        'main@': {
                            controller: 'userManagementDetailCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/userManagement/userManagementCreateTmpl.html'
                        }
                    }
                })
                ////////////////////////
                // User Management Edit
                ////////////////////////
                .state('kaching.userManagement.edit', {
                    url: '/user-detail/:id',
                    data: { title: 'User Management Detail' },
                    views: {
                        'main@': {
                            controller: 'userManagementDetailCtrl',
                            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/management/userManagement/userManagementDetailTmpl.html'
                        }
                    }
                })
                /////////
                // Zone
                /////////
                .state('zones', {
                    url: '/kaching-zones',
                    data: { title: 'Kaching zones' },
                    views: {
                      'header@': globalHeaderView
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
            // This is a replacement for the '$urlRouterProvider.otherwise' block in module config
            if (authService.isAdvertiser()) {
                $state.transitionTo('kaching');
            } else if (authService.isDeveloper()) {
                $state.transitionTo('apikeys');
            }

            $rootScope.$on('stateNotFound', function(event, unfoundState, fromState, fromParams) {
                if (authService.isAdvertiser()) {
                    $state.transitionTo('kaching');
                } else if (authService.isDeveloper()) {
                    $state.transitionTo('apikeys');
                }
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

                if (toState.name === 'expired') {
                    angular.element('.sidebar-area').hide();
                    return;
                }

                angular.element('.sidebar-area').show();

                if (!authService.isLoggedIn()) {
                    $state.transitionTo('expired');
                    event.preventDefault();
                    return;
                }

                if (!permissionsService.userHasAccess(toState.name)) {
                    if (authService.isAdvertiser()) {
                        $state.transitionTo('kaching');
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
