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