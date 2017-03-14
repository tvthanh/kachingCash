(function(){
    'use strict';

    angular.module('panelApp')
        .directive('siteNav', function(){
            return {
                restrict: 'AE',
                // replace: true,
                templateUrl: kachingAppConfig.mainMenuTmpls
            };
        });

})();
