(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newCampaignEditorCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            // 'campaignId',
        function (
            $scope,
            $state,
            $stateParams
            // campaignId
        ) {

            $scope.campaignTemplate = kachingAppConfig.wpTemplateUri + '/assets/kaching/kaching-zones/billboards/billboards-popup-tmpl.html';

        }]);
})();
