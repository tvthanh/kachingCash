(function() {
  'use strict';
  angular.module('panelApp')
          .directive('campaignActionSettings', [
            '$state',
            '$stateParams',
            '$timeout',
            'campaignsService',
            'errorHandler',
            'utils',
            function(
              $state,
              $stateParams,
              $timeout,
              campaignsService,
              errorHandler,
              utils
            ) {
                return {
                  restrict: 'E',
                  scope: {
                    data: '=injectedData'
                  },
                  templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/campaignActionSettings/campaignActionSettingsTmpl.html',
                  controller: function($scope) {

                  }
                };
            }
          ]);
})();
