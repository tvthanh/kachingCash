(function(){
    'use strict';

    angular.module('panelApp')
        .directive('panelNav', [ 'utils', 'authService', '$window', function( utils, authService, $window ){
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    'loggedIn' : '='
                },
                templateUrl: templateDirUri + '/assets/kaching/directives/panelNav/panelNavTmpl.html',
                link: function(scope, element, attrs) {
                    var ele = element;

                    ele.on('click', 'a.item-level-1', function(event) {
                        event.preventDefault();

                        var $item = angular.element(this);

                        var $selectorItem = $item.closest('ul.panel-nav > li');
                        var $subNavigation = $selectorItem.find('.sub-navigation-kaching');

                        $subNavigation.slideToggle();

                        var $others = angular.element('ul.panel-nav > li').not($selectorItem);
                        $others.find('a.item-level-1').removeClass('active');
                        $others.find('a.item-level-2').removeClass('active');
                        $others.find('.sub-navigation-kaching').slideUp();

                        $item.addClass('active');
                    });

                    ele.on('click', 'a.item-level-2', function(event) {
                        event.preventDefault();

                        var $item = angular.element(this);
                        var $selectorItem = $item.closest('ul.sub-navigation-kaching > li');
                        var $others = angular.element('ul.sub-navigation-kaching > li').not($selectorItem);

                        $others.find('a.item-level-2').removeClass('active');
                        $item.addClass('active');
                    });
                },
                controller: ['$rootScope', '$scope', '$state', '$modal', function( $rootScope, $scope, $state, $modal) {
                    $scope.$state = $state;
                    $scope.isPanel = kachingAppConfig.isPanelPage;

                    $scope.urls = {
                        campaigns: kachingAppConfig.panelUrl + '#/campaigns',
                        media:     kachingAppConfig.panelUrl + '#/media',
                        products:  kachingAppConfig.panelUrl + '#/products',
                        billing:   kachingAppConfig.panelUrl + '#/billing',
                        apikeys:   kachingAppConfig.panelUrl + '#/api-keys',
                        dashboard:  kachingAppConfig.panelUrl + '#/dashboard',
                    };

                    $scope.isAdvertiser = function() {
                        return authService.isAdvertiser();
                    };

                    $scope.isDeveloper = function() {
                        return authService.isDeveloper();
                    };

                    var defaultOption = {
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/billboards/billboards-popup-tmpl.html',
                        controller: 'billboardsCtrl',
                        animation: 'am-fade-and-scale',
                        // placement: 'center',
                        backdrop: 'static',
                        title: 'Billboards',
                        onShow: function(){
                            angular.element('html').css('overflow','hidden');
                        },
                        onBeforeHide: function() {
                            angular.element('html').css('overflow','initial');
                        },
                        resolve: {
                            campaignId: function(){
                                return undefined;
                            },
                            viewDetail: function(){
                                return undefined;
                            }
                        },
                        onHide: function() {
                            $rootScope.$broadcast('reload-campaigns');
                        }
                    };

                    var instoreOption = {
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/instore-campaign/instore-campaign-popup-tmpl.html',
                        controller: 'instoreCampaignCtrl',
                        title: 'Instore Campaign'
                    };

                    var magazineOption = {
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/magazine-ads/magazine-ads-popup-tmpl.html',
                        controller: 'magazineAdsCtrl',
                        title: 'Magazine Ads'
                    };

                    var radioOption = {
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/radio-ads/radio-ads-popup-tmpl.html',
                        controller: 'radioAdsCtrl',
                        title: 'Radio Ads'
                    };

                    var tvOption = {
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/tv-ads/tv-ads-popup-tmpl.html',
                        controller: 'tvAdsCtrl',
                        title: 'TV Ads'
                    };

                    $scope.showKachingZonePopup = function(type) {

                        var option = {};

                        switch (type) {
                            case 'billboards':
                                angular.extend(option, defaultOption);
                                break;
                            case 'instore':
                                angular.extend(option, defaultOption, instoreOption);
                                break;
                            case 'magazine-ads':
                                angular.extend(option, defaultOption, magazineOption);
                                break;
                            case 'radio-ads':
                                angular.extend(option, defaultOption, radioOption);
                                break;
                            case 'tv-ads':
                                angular.extend(option, defaultOption, tvOption);
                                break;
                            default:
                                break;
                        }

                        $modal(option);
                    };

                    $scope.logout = function() {
                        authService.logout().then(function() {
                            $window.location.href = kachingAppConfig.homeUrl;
                        });
                    };

                    $scope.isStaff = function() {
                        return document.cookie.search('isStaff=true') !== -1 ? true : false;
                    }

                }]
            };
        }]);

})();
