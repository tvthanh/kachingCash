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
                SCANS: 'scans',
                SALES: 'sales',

                CAMPAIGN_OVERVIEW: 'overview',
                CAMPAIGN_PAYOUT: 'payout',
                PRODUCT_REVENUE: 'revenue',
                PRODUCT_TRAFFIC: 'traffic',
                PURCHASE_FUNNEL: 'funnel'
            };

            var templateFolder = kachingAppConfig.wpTemplateUri + '/assets/kaching/analytics/tabs/';

            $scope.analyticsTab = {
                scans   : templateFolder + '/scans/scans-tab.html',
                sales   : templateFolder + '/sales/sales-tab.html',

                overview : templateFolder + 'overview-tab.html',
                payout : templateFolder + 'payout-tab.html',
                revenue : templateFolder + '/productRevenue/revenue-tab.html',
                traffic : templateFolder + 'traffic-tab.html',
                funnel : templateFolder + 'funnel-tab.html'
            };

            $scope.updateTab = function(tab) {
                $scope.activedTab = tab;
            };

            var init = function() {
                $scope.activedTab = $scope.tab.SCANS;
            };

            init();

        }]);
})();
