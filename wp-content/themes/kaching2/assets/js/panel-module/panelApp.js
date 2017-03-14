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
