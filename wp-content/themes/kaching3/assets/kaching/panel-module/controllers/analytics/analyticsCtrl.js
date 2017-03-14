(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'analyticsCtrl', [
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
            $scope.tab = {
                CAMPAIGN_OVERVIEW: 'overview',
                CAMPAIGN_PAYOUT: 'payout',
                PRODUCT_REVENUE: 'revenue',
                PRODUCT_TRAFFIC: 'traffic',
                PURCHASE_FUNNEL: 'funnel'
            };

            var templateFolder = kachingAppConfig.wpTemplateUri + '/assets/kaching/pannel-module/analytics/tabs/';

            $scope.analyticsTab = {
                overview : templateFolder + 'overview-tab.html',
                payout : templateFolder + 'payout-tab.html',
                revenue : templateFolder + 'revenue-tab.html',
                traffic : templateFolder + 'traffic-tab.html',
                funnel : templateFolder + 'funnel-tab.html'
            };

            $scope.updateTab = function(tab) {
                $scope.activedTab = tab;
            }

            var init = function() {
                $scope.activedTab = $scope.tab.CAMPAIGN_OVERVIEW;
            }

            init();

        }]);
})();
